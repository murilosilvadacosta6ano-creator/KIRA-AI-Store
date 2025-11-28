import React, { useState } from 'react';
import { CardData } from '../types';
import { ArrowUpRight, Play, Cpu, Sparkles } from 'lucide-react';
import AiTerminal from './AiTerminal';

interface HeroProps {
  data: CardData;
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <>
      {/* Background Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
         <div key={data.id} className="absolute inset-0 w-full h-full">
            <img 
              src={data.imageUrl} 
              alt={data.title}
              className="w-full h-full object-cover opacity-60" 
            />
            {/* Soft Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90" />
         </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 h-full flex flex-col justify-center px-10 md:px-32 max-w-[90vw] md:max-w-6xl pointer-events-none">
         <div className="pointer-events-auto">
             {/* Top Label */}
             <div className="flex items-center gap-3 mb-4">
                <div className={`px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase text-blue-200 shadow-lg flex items-center gap-2`}>
                   <Sparkles size={12} className="text-blue-400" />
                   {data.label}
                </div>
                {data.type === 'ai' && (
                    <div className="px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-bold tracking-widest uppercase text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        ACTIVE
                    </div>
                )}
             </div>

             {/* Main Title */}
             <h1 className="text-5xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-4 leading-tight tracking-tight drop-shadow-2xl">
                {data.title}
             </h1>
             
             {/* Subtitle */}
             <div className="flex items-center gap-4 mb-8">
                 <div className="h-[1px] w-12 bg-gradient-to-r from-blue-400 to-transparent" />
                 <h2 className="text-xl md:text-2xl font-light tracking-widest text-blue-100/80 uppercase">
                    {data.subtitle}
                 </h2>
             </div>

             {/* Description */}
             <div className="glass-panel p-6 rounded-2xl max-w-lg mb-10 border-l-4 border-l-blue-500/50">
                <p className="text-gray-200 font-light leading-relaxed text-sm md:text-base">
                    {data.description}
                </p>
             </div>

             {/* Primary Action Button */}
             <button 
               onClick={() => data.type === 'ai' && setIsAiOpen(true)}
               className="group relative px-8 py-4 rounded-full bg-white text-black font-display font-bold text-sm tracking-widest w-fit flex items-center gap-4 overflow-hidden interactive transition-all duration-300 hover:bg-gray-200"
             >
                <span className="relative z-10 flex items-center gap-3">
                   {data.buttonText}
                   {data.type === 'game' ? <Play size={18} fill="currentColor" /> : 
                    data.type === 'ai' ? <Cpu size={18} /> :
                    <ArrowUpRight size={20} />}
                </span>
             </button>
         </div>
      </div>

      <AiTerminal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </>
  );
};

export default Hero;