import React, { useState, useEffect, useRef } from 'react';
import { Accessibility, Sun, Type, Mic, MicOff, Loader2, Maximize, Minimize, MousePointer2, Type as BrailleIcon } from 'lucide-react';
import { connectVoiceNavigation } from '../services/voiceService.ts';

interface Props {
  onNavigate: (view: 'home' | 'blog') => void;
  onScroll: (section: string) => void;
  isVoiceActive: boolean;
  onVoiceToggle: (session: any | null) => void;
  transcription: string;
}

const AccessibilityToolbar: React.FC<Props> = ({ onNavigate, onScroll, isVoiceActive, onVoiceToggle, transcription }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [dyslexia, setDyslexia] = useState(false);
  const [braille, setBraille] = useState(false);
  const [fontSize, setFontSize] = useState<0.2 | 0.5 | 1.0 | 2.0>(1.0);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.className = body.className.replace(/scale-\d+/g, '');
    body.classList.add(`scale-${fontSize.toString().replace('.', '')}`);
    
    contrast ? body.classList.add('high-contrast') : body.classList.remove('high-contrast');
    dyslexia ? body.classList.add('dyslexia-font') : body.classList.remove('dyslexia-font');
    braille ? body.classList.add('braille-mode') : body.classList.remove('braille-mode');
  }, [contrast, dyslexia, fontSize, braille]);

  const toggleVoice = async () => {
    if (isVoiceActive) {
      onVoiceToggle(null);
    } else {
      setIsConnecting(true);
      try {
        const session = await connectVoiceNavigation({
          onNavigate,
          onScroll,
          onTranscription: (text) => {}, // App handled
          onError: (err) => {
            console.error(err);
            onVoiceToggle(null);
          }
        });
        onVoiceToggle(session);
      } catch (err) {
        console.error("Failed to start voice:", err);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  return (
    <div className="fixed top-24 right-6 z-[110] flex flex-col items-end gap-4">
      {/* Transcription Overlay */}
      {isVoiceActive && transcription && (
        <div className="bg-slate-900/90 text-white p-4 rounded-2xl max-w-xs text-sm font-medium animate-in fade-in slide-in-from-bottom-2 shadow-2xl border border-white/20">
          <p className="leading-relaxed">{transcription}</p>
        </div>
      )}

      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Accessibility Options"
          className={`relative bg-white border-2 ${isVoiceActive ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : 'border-emerald-600'} text-emerald-600 p-4 rounded-full shadow-2xl hover:scale-105 transition-all`}
        >
          <Accessibility className="w-6 h-6" />
        </button>

        {isOpen && (
          <div className="absolute top-20 right-0 bg-white rounded-[2rem] shadow-2xl w-80 border border-slate-100 p-8">
            <h4 className="font-heading font-bold text-slate-900 mb-6 flex items-center gap-2 text-xs uppercase tracking-widest">
              Assistive Settings
            </h4>

            <div className="space-y-6">
              {/* Voice Mode */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-900 uppercase block">Voice Assistant</span>
                  <span className="text-[8px] text-emerald-700">Hands-Free Navigation</span>
                </div>
                <button 
                  onClick={toggleVoice}
                  disabled={isConnecting}
                  className={`p-2.5 rounded-xl border-2 transition-all ${isVoiceActive ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-emerald-200 text-emerald-400'}`}
                >
                  {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isVoiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />)}
                </button>
              </div>

              {/* Text Scaling */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Text Scale</span>
                <div className="grid grid-cols-4 gap-2">
                  {[0.2, 0.5, 1.0, 2.0].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setFontSize(s as any)}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${fontSize === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-100'}`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setContrast(!contrast)}
                  className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${contrast ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">High Visibility Mode</span>
                </button>

                <button 
                  onClick={() => setBraille(!braille)}
                  className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${braille ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                >
                  <BrailleIcon className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Braille Spacing</span>
                </button>
              </div>

              <button 
                onClick={() => { setFontSize(1.0); setContrast(false); setDyslexia(false); setBraille(false); }}
                className="w-full text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase"
              >
                Reset All Options
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityToolbar;