import React from 'react';
import { PROGRAMS, getIcon } from '../constants.tsx';

const ProgramSection: React.FC = () => {
  return (
    <section id="programs" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-emerald-600 font-bold tracking-widest text-sm uppercase mb-3">Our Focus Areas</h2>
          <h3 className="text-4xl font-heading font-bold text-slate-900 mb-6">Holistic Empowerment Programs</h3>
          <p className="text-lg text-slate-600">
            Designed to bridge the gap between school and independent living, our programs provide practical tools for adults with disabilities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PROGRAMS.map((program) => (
            <div key={program.id} className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden hover:border-emerald-200 transition-all">
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                  {getIcon(program.icon, "w-6 h-6")}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{program.title}</h4>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {program.description}
                </p>
                <button className="text-emerald-600 font-bold flex items-center gap-2 group/btn">
                  Learn about this program
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;