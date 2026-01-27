import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for "The Invisible Hands", a CBO dedicated to empowering adults and youth with disabilities (PWD) in rural Tanzania.
Your goal is to inform visitors about the organization's mission, objectives, and the current landscape of disability in Tanzania.

Key Facts about The Invisible Hands:
- Focus: Adult-focused empowerment, economic and vocational skills, rural access.
- Target: Diverse disabilities including physical, visual, intellectual, albinism, and psychosocial.
- Short-Term (Years 1-2): Legal setup, needs assessment of 300+ people, pilot training for 100+ adults.
- Long-Term (Years 3-5+): Scaling to 500+ adults, policy advocacy, operational sustainability.
- Gap: We fill the gap left by organizations that focus only on children/students. We focus on independent living and jobs for adults.

Context: Tanzania has 2-3M PWD. High rural poverty. Less than 1% employment in formal sectors. We work with organizations like SHIVYAWATA.

Tone: Professional, empathetic, hopeful, and informative. Use Swahili greetings if appropriate but primarily answer in English unless requested otherwise.
`;

export async function askPITAssistant(prompt: string) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Gemini API Key is missing. Please set API_KEY in your environment variables.");
    return "I'm sorry, I'm currently unable to access my knowledge base because the API key is not configured. Please contact the administrator.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again or contact us directly at info@theinvisiblehands.or.tz";
  }
}