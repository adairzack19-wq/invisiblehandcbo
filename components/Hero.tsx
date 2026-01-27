
import React from 'react';
import { ArrowRight, CheckCircle2, Users } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-40 overflow-hidden bg-white">
      <div className="absolute top-0 right-0 -z-10 w-2/3 h-full bg-emerald-50/50 rounded-l-[10rem] blur-3xl opacity-60 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-1/4 h-1/2 bg-amber-50/30 rounded-full blur-3xl opacity-50 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold text-slate-900 leading-[1] mb-8 tracking-tighter">
              Dignity <span className="text-emerald-600 italic font-light">for every</span> <br className="hidden md:block" /> Ability.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0">
              The Invisible Hands bridges the gap in Tanzania's disability landscape by focusing on adult economic independence, vocational excellence, and rural inclusion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center lg:justify-start">
              <button 
                onClick={scrollToContact}
                className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 group"
              >
                Support Our Mission
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={scrollToAbout}
                className="bg-white text-slate-700 border border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center shadow-lg shadow-slate-100/50"
              >
                Learn More
              </button>
            </div>
          </div>
          
          <div className="relative mt-12 lg:mt-0">
            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(5,150,105,0.2)] z-10 w-full aspect-square sm:aspect-video lg:aspect-square group">
              <img 
                src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200&auto=format&fit=crop" 
                alt="Empowerment Hub in Tanzania" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
            </div>

            <div className="absolute -bottom-10 left-0 sm:-left-10 bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl z-20 max-w-[280px] border border-emerald-50">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <Users className="text-emerald-600 w-6 h-6" />
                </div>
                <div className="font-heading font-bold text-slate-900 text-2xl md:text-3xl tracking-tighter">2M+</div>
              </div>
              <div className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest leading-relaxed">PWD in Tanzania seeking empowerment and dignity.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
