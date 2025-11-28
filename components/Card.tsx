import React, { useState } from 'react';
import { CardData } from '../types';
import { ArrowUpRight } from 'lucide-react';
import AiTerminal from './AiTerminal';

interface CardProps {
  data: CardData;
  isActive: boolean;
}

const Card: React.FC<CardProps> = ({ data, isActive }) => {
  const [isAiOpen, setIsAiOpen] = useState(false);

  const handleAction = () => {
    if (data.type === 'ai') {
      setIsAiOpen(true);
    }
  };

  return (
    <>
      <div 
        className={`
          relative group transition-all duration-500 ease-out
          w-[85vw] md:w-[420px] 
          h-[55vh] md:h-[65vh]
          border bg-[#111] overflow-hidden
          ${isActive 
            ? 'border-white/40 scale-100 opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.5)]' 
            : 'border-white/5 scale-[0.98] opacity-40 grayscale hover:opacity-60'}
        `}
      >
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={data.imageUrl} 
            alt={data.title}
            className={`
              w-full h-full object-cover transition-transform duration-700
              ${isActive ? 'scale-105' : 'scale-100'}
            `}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
          
          {/* Header Badge */}
          <div className="flex items-start justify-between">
             <div className="flex flex-col gap-1">
                <div className={`
                  w-fit px-2 py-0.5 border border-white/20 text-[10px] font-bold tracking-widest uppercase bg-black/50 backdrop-blur-sm
                  ${isActive ? 'text-white' : 'text-white/50'}
                `}>
                  {data.type}
                </div>
                <div className="w-1 h-8 border-l border-white/20 mt-2"></div>
             </div>
             {data.type === 'ai' && (
               <div className="animate-pulse w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
             )}
          </div>

          {/* Main Text */}
          <div className={`transform transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-80'}`}>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase leading-[0.9] mb-2 tracking-tight">
              {data.title}
            </h2>
            <div className="flex items-center gap-3 mb-6">
               <div className="h-[1px] w-8 bg-white"></div>
               <span className="text-xs font-bold tracking-[0.2em] text-white/80 uppercase">
                 {data.subtitle}
               </span>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-[90%] mb-8 line-clamp-3">
              {data.description}
            </p>

            {/* Action Button */}
            <button 
              onClick={handleAction}
              className={`
                group/btn relative overflow-hidden px-6 py-3 bg-white text-black font-bold text-xs tracking-widest flex items-center gap-3 interactive
                hover:bg-gray-200 transition-colors
              `}
            >
               <span className="relative z-10">{data.buttonText}</span>
               <ArrowUpRight size={16} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
               
               {/* Button Glitch Effect Overlay */}
               <div className="absolute inset-0 bg-emerald-500 w-0 group-hover/btn:w-full transition-all duration-300 opacity-20" />
            </button>
          </div>
        </div>

        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* AI Modal Integration */}
      {data.type === 'ai' && (
        <AiTerminal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      )}
    </>
  );
};

export default Card;
