
import React from 'react';
import { Objective } from '../types';
import { Calendar, Target } from 'lucide-react';

interface Props {
  objective: Objective;
}

const ObjectiveCard: React.FC<Props> = ({ objective }) => {
  const isShortTerm = objective.type === 'short-term';
  
  return (
    <div className={`relative p-8 rounded-3xl transition-all duration-300 border h-full flex flex-col ${
      isShortTerm 
        ? 'bg-white border-emerald-100 hover:shadow-xl hover:shadow-emerald-50' 
        : 'bg-emerald-900 border-emerald-800 text-white hover:shadow-2xl hover:shadow-emerald-900/20'
    }`}>
      <div className="flex items-start justify-between mb-6">
        <div className={`p-3 rounded-2xl ${isShortTerm ? 'bg-emerald-50' : 'bg-emerald-800/50'}`}>
          <Target className={`w-6 h-6 ${isShortTerm ? 'text-emerald-600' : 'text-emerald-400'}`} />
        </div>
        <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${isShortTerm ? 'text-emerald-600' : 'text-emerald-400'}`}>
          <Calendar className="w-4 h-4" />
          {objective.timeline}
        </div>
      </div>
      
      <h3 className={`text-xl font-bold mb-3 ${isShortTerm ? 'text-slate-900' : 'text-white'}`}>
        {objective.title}
      </h3>
      
      <p className={`text-sm mb-6 flex-grow ${isShortTerm ? 'text-slate-500' : 'text-emerald-100/70'}`}>
        {objective.description}
      </p>
      
      <div className="space-y-3">
        {objective.metrics.map((metric, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isShortTerm ? 'bg-emerald-500' : 'bg-emerald-400'}`} />
            <span className={`text-sm font-medium ${isShortTerm ? 'text-slate-700' : 'text-emerald-50'}`}>
              {metric}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjectiveCard;
