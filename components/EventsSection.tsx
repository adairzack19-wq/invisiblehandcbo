
import React from 'react';
import { Calendar, MapPin, ArrowRight, Bell } from 'lucide-react';
import { EVENTS } from '../constants';

interface Props {
  onNavigateToBlog: () => void;
}

const EventsSection: React.FC<Props> = ({ onNavigateToBlog }) => {
  return (
    <section id="events" className="py-24 bg-slate-50 border-y border-slate-100" aria-labelledby="events-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h2 className="text-emerald-600 font-bold tracking-widest text-sm uppercase mb-3 flex items-center gap-2 justify-center md:justify-start">
              <Bell className="w-4 h-4" /> Community Calendar
            </h2>
            <h3 id="events-title" className="text-4xl font-heading font-bold text-slate-900">Upcoming & Recent Events</h3>
          </div>
          <button 
            onClick={onNavigateToBlog}
            className="text-slate-500 font-bold flex items-center gap-2 hover:text-emerald-600 transition-colors mx-auto md:mx-0"
          >
            View Full Archive <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {EVENTS.map((event) => (
            <div 
              key={event.id} 
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 flex flex-col group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <event.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                    <Calendar className="w-3 h-3" /> {event.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                    <MapPin className="w-3 h-3" /> {event.location}
                  </div>
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                {event.title}
              </h4>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                {event.description}
              </p>
              
              <button 
                onClick={onNavigateToBlog}
                className="w-full py-4 rounded-xl border border-slate-100 font-bold text-xs uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-amber-50 p-4 rounded-full text-amber-600">
              <Bell className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Stay updated on our next mission</h4>
              <p className="text-slate-500 text-sm">Join our mailing list to receive event alerts directly in your inbox.</p>
            </div>
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none flex-grow md:w-64"
            />
            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors whitespace-nowrap">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
