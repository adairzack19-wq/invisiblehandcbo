import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import ObjectiveCard from './components/ObjectiveCard.tsx';
import ProgramSection from './components/ProgramSection.tsx';
import EventsSection from './components/EventsSection.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import AccessibilityToolbar from './components/AccessibilityToolbar.tsx';
import BlogView from './components/blog/BlogView.tsx';
import BlogAdmin from './components/blog/BlogAdmin.tsx';
import { SHORT_TERM_OBJECTIVES, LONG_TERM_OBJECTIVES, MISSION, VISION, PHILOSOPHY } from './constants.tsx';
import { Target, Eye, Globe, ShieldCheck, Heart, Mail, Phone } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'blog' | 'admin'>('home');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const voiceSessionRef = useRef<any>(null);
  const lastReadRef = useRef<string>('');

  const scrollToSection = (id: string) => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hover-to-Speak Logic
  const handleGlobalMouseOver = useCallback((e: MouseEvent) => {
    if (!isVoiceActive || !voiceSessionRef.current) return;

    const target = e.target as HTMLElement;
    // Look for text-heavy elements or headers
    const readable = target.closest('p, h1, h2, h3, h4, li, blockquote');
    if (readable && readable.textContent && readable.textContent !== lastReadRef.current) {
      const text = readable.textContent.trim();
      if (text.length > 10) { // Avoid reading tiny fragments
        lastReadRef.current = text;
        voiceSessionRef.current.sendText(`Please read this section to the user and ask them a relevant question to see if they need more info on this specific topic: "${text}"`);
      }
    }
  }, [isVoiceActive]);

  useEffect(() => {
    window.addEventListener('mouseover', handleGlobalMouseOver);
    return () => window.removeEventListener('mouseover', handleGlobalMouseOver);
  }, [handleGlobalMouseOver]);

  const handleVoiceToggle = (session: any | null) => {
    if (session) {
      voiceSessionRef.current = session;
      setIsVoiceActive(true);
    } else {
      if (voiceSessionRef.current) voiceSessionRef.current.stop();
      voiceSessionRef.current = null;
      setIsVoiceActive(false);
      setTranscription('');
      lastReadRef.current = '';
    }
  };

  if (view === 'blog') return (
    <>
      <Navbar onNavigate={setView} activeView={view} />
      <AccessibilityToolbar 
        onNavigate={(v) => setView(v as any)} 
        onScroll={scrollToSection}
        isVoiceActive={isVoiceActive}
        onVoiceToggle={handleVoiceToggle}
        transcription={transcription}
      />
      <BlogView onBack={() => setView('home')} />
      <AIAssistant />
    </>
  );

  if (view === 'admin') return <BlogAdmin onBack={() => setView('home')} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onNavigate={setView} activeView={view} />
      <AccessibilityToolbar 
        onNavigate={(v) => setView(v as any)} 
        onScroll={scrollToSection}
        isVoiceActive={isVoiceActive}
        onVoiceToggle={handleVoiceToggle}
        transcription={transcription}
      />
      
      <main className="flex-grow">
        <Hero />
        
        <section id="mission-vision" className="py-24 bg-white px-4 sm:px-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="bg-emerald-50 p-12 rounded-[3rem] flex flex-col hover:ring-2 hover:ring-emerald-400 transition-all">
              <Target className="text-emerald-600 mb-6 w-10 h-10" />
              <h2 className="text-3xl font-bold mb-6 text-emerald-900 uppercase">Mission</h2>
              <p className="text-xl text-emerald-800 leading-relaxed font-medium">"{MISSION}"</p>
            </div>
            <div className="bg-slate-900 p-12 rounded-[3rem] text-white flex flex-col hover:ring-2 hover:ring-emerald-400 transition-all">
              <Eye className="text-emerald-400 mb-6 w-10 h-10" />
              <h2 className="text-3xl font-bold mb-6 text-white uppercase">Vision</h2>
              <p className="text-xl text-slate-300 leading-relaxed font-medium">"{VISION}"</p>
            </div>
          </div>
        </section>

        <section id="about" className="py-24 bg-slate-900 text-white px-4 sm:px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Our Context</h2>
              <h3 className="text-5xl font-bold mb-8">Empowering the <span className="text-emerald-400 italic">Unseen</span>.</h3>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">Tanzania's adults with disabilities face a harsh transition into adulthood. We ensure that age means independence, not isolation.</p>
              <div className="space-y-6">
                <div className="flex gap-4"><Globe className="text-emerald-400" /> <span>Rural Inclusion in Dodoma and Mbeya</span></div>
                <div className="flex gap-4"><ShieldCheck className="text-emerald-400" /> <span>Rights-based Advocacy</span></div>
              </div>
            </div>
            <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white/5">
              <img src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?q=80&w=800" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="PWD artisan at work" />
            </div>
          </div>
        </section>

        <section id="objectives" className="py-24 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-4xl font-bold mb-16 text-center">Measurement Roadmap</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SHORT_TERM_OBJECTIVES.map(obj => <ObjectiveCard key={obj.id} objective={obj} />)}
            </div>
          </div>
        </section>

        <ProgramSection />
        <EventsSection onNavigateToBlog={() => setView('blog')} />
        
        <section id="contact" className="py-24 px-4 sm:px-8 bg-emerald-900 text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
            <div className="flex-1">
              <h3 className="text-5xl font-bold mb-10">Join the <span className="text-emerald-400">Movement</span>.</h3>
              <address className="not-italic space-y-6">
                <div className="flex gap-4"><Mail className="text-emerald-400" /> info@theinvisiblehands.or.tz</div>
                <div className="flex gap-4"><Phone className="text-emerald-400" /> +255 700 000 000</div>
              </address>
            </div>
            <form className="flex-1 bg-white p-12 rounded-[3rem] text-slate-900" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <input placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                <input placeholder="Email Address" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                <textarea rows={4} placeholder="Your Message" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                <button type="submit" className="w-full bg-emerald-600 text-white p-5 rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors">Send Story</button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-12 text-slate-500 text-center uppercase tracking-widest text-[10px] font-bold border-t border-white/5">
        <p>© 2024 The Invisible Hands CBO. All rights reserved.</p>
      </footer>
      <AIAssistant />
    </div>
  );
};

export default App;