import React, { useState, useEffect, useRef } from 'react';
import { Accessibility, Sun, Moon, Type, Eye, Link, RefreshCcw, Mic, MicOff, Loader2 } from 'lucide-react';
import { connectVoiceNavigation } from '../services/voiceService.ts';

interface Props {
  onNavigate: (view: 'home' | 'blog') => void;
  onScroll: (section: string) => void;
}

const AccessibilityToolbar: React.FC<Props> = ({ onNavigate, onScroll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [dyslexia, setDyslexia] = useState(false);
  const [links, setLinks] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const voiceSessionRef = useRef<{ stop: () => Promise<void> } | null>(null);

  useEffect(() => {
    const body = document.body;
    contrast ? body.classList.add('high-contrast') : body.classList.remove('high-contrast');
    dyslexia ? body.classList.add('dyslexia-font') : body.classList.remove('dyslexia-font');
    links ? body.classList.add('highlight-links') : body.classList.remove('highlight-links');
    document.documentElement.style.setProperty('--font-scale', fontSize.toString());
  }, [contrast, dyslexia, links, fontSize]);

  const toggleVoice = async () => {
    if (isVoiceActive) {
      if (voiceSessionRef.current) {
        await voiceSessionRef.current.stop();
        voiceSessionRef.current = null;
      }
      setIsVoiceActive(false);
    } else {
      setIsConnecting(true);
      try {
        const session = await connectVoiceNavigation({
          onNavigate,
          onScroll,
          onError: (err) => {
            console.error(err);
            setIsVoiceActive(false);
          }
        });
        voiceSessionRef.current = session;
        setIsVoiceActive(true);
      } catch (err) {
        console.error("Failed to start voice:", err);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const reset = () => {
    setContrast(false);
    setDyslexia(false);
    setLinks(false);
    setFontSize(1);
    if (isVoiceActive) toggleVoice();
  };

  return (
    <div className="fixed top-24 right-6 z-[110]">
      <div className="relative">
        {isVoiceActive && (
          <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-25"></div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Accessibility Options"
          aria-expanded={isOpen}
          className={`relative bg-white border-2 ${isVoiceActive ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : 'border-emerald-600'} text-emerald-600 p-3 rounded-full shadow-xl hover:scale-110 transition-all flex items-center justify-center`}
        >
          <Accessibility className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-16 right-0 bg-white rounded-3xl shadow-2xl w-72 border border-slate-100 p-6">
          <h4 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase">
            Display Options
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-900 uppercase">Voice Mode</span>
                <span className="text-[8px] text-emerald-700">Hands-Free control</span>
              </div>
              <button 
                onClick={toggleVoice}
                disabled={isConnecting}
                className={`p-2 rounded-xl border-2 transition-all ${isVoiceActive ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-emerald-200 text-emerald-400'}`}
              >
                {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isVoiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />)}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">High Contrast</span>
              <button onClick={() => setContrast(!contrast)} className={`p-2 rounded-lg border ${contrast ? 'bg-emerald-600 text-white' : 'bg-slate-50'}`}><Sun className="w-4 h-4" /></button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Dyslexia Font</span>
              <button onClick={() => setDyslexia(!dyslexia)} className={`p-2 rounded-lg border ${dyslexia ? 'bg-emerald-600 text-white' : 'bg-slate-50'}`}><Type className="w-4 h-4" /></button>
            </div>

            <button onClick={reset} className="w-full pt-2 border-t text-[10px] font-bold text-slate-400 hover:text-emerald-600">RESET ALL</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityToolbar;