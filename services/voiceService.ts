import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';

// Audio Processing Helpers
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// Navigation Tools
const navigateToDeclaration: FunctionDeclaration = {
  name: 'navigate_to',
  parameters: {
    type: Type.OBJECT,
    description: 'Switch between main app views like home and blog.',
    properties: {
      view: { type: Type.STRING, description: 'Options: "home", "blog".' },
    },
    required: ['view'],
  },
};

const scrollToSectionDeclaration: FunctionDeclaration = {
  name: 'scroll_to_section',
  parameters: {
    type: Type.OBJECT,
    description: 'Scroll to a specific section on the current page.',
    properties: {
      section: { type: Type.STRING, description: 'Options: "about", "mission-vision", "philosophy", "events", "objectives", "programs", "contact".' },
    },
    required: ['section'],
  },
};

interface VoiceCallbacks {
  onNavigate: (view: 'home' | 'blog') => void;
  onScroll: (section: string) => void;
  onTranscription: (text: string) => void;
  onError: (msg: string) => void;
}

export async function connectVoiceNavigation(callbacks: VoiceCallbacks) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    callbacks.onError("API key is missing.");
    throw new Error("API key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  let nextStartTime = 0;
  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const outputNode = outputAudioContext.createGain();
  outputNode.connect(outputAudioContext.destination);
  const sources = new Set<AudioBufferSourceNode>();

  const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      outputAudioTranscription: {},
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
      tools: [{ functionDeclarations: [navigateToDeclaration, scrollToSectionDeclaration] }],
      systemInstruction: 'You are the "Inclusive Eyes" voice assistant for The Invisible Hands. You help users with visual, hearing, or physical impairments. When a user hovers over text or asks for information, read it clearly and then ask a brief, relevant follow-up question to keep them engaged hands-free. Be empathetic and patient.',
    },
    callbacks: {
      onopen: () => {
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        scriptProcessor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);
          sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob })).catch(() => {});
        };
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);
      },
      onmessage: async (message: LiveServerMessage) => {
        if (message.serverContent?.outputTranscription) {
          callbacks.onTranscription(message.serverContent.outputTranscription.text);
        }

        const parts = message.serverContent?.modelTurn?.parts ?? [];
        const base64Audio = parts.find(p => p.inlineData)?.inlineData?.data;
        if (base64Audio) {
          nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
          const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
          const source = outputAudioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(outputNode);
          source.start(nextStartTime);
          nextStartTime += audioBuffer.duration;
          sources.add(source);
          source.onended = () => sources.delete(source);
        }

        if (message.serverContent?.interrupted) {
          sources.forEach(s => { try { s.stop(); } catch (e) {} });
          sources.clear();
          nextStartTime = 0;
        }

        const functionCalls = message.toolCall?.functionCalls ?? [];
        for (const fc of functionCalls) {
          if (fc.name === 'navigate_to') callbacks.onNavigate((fc.args as any).view);
          if (fc.name === 'scroll_to_section') callbacks.onScroll((fc.args as any).section);
          sessionPromise.then(s => s.sendToolResponse({
            functionResponses: { id: fc.id, name: fc.name, response: { result: "ok" } }
          }));
        }
      },
      onerror: (e: any) => callbacks.onError(e.message || 'Voice error'),
    },
  });

  return {
    sendText: async (text: string) => {
      const session = await sessionPromise;
      session.sendRealtimeInput({ media: [{ text }] });
    },
    stop: async () => {
      const session = await sessionPromise;
      session.close();
      stream.getTracks().forEach(t => t.stop());
      await inputAudioContext.close();
      await outputAudioContext.close();
    }
  };
}