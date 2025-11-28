import React, { useRef, useEffect } from 'react';
import { CardData } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CarouselProps {
  data: CardData[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({ data, activeIndex, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll active item into view
    if (containerRef.current) {
        const activeEl = containerRef.current.children[activeIndex] as HTMLElement;
        if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
  }, [activeIndex]);

  return (
    <div className="absolute bottom-6 right-6 z-30 w-full md:w-auto md:max-w-[70vw] flex items-end">
        {/* Navigation Controls (Mobile/Desktop) */}
        <div className="hidden md:flex gap-3 mb-8 mr-6 z-40">
             <button 
                onClick={() => onSelect(Math.max(0, activeIndex - 1))}
                className="p-3 rounded-full glass-button text-white hover:bg-white hover:text-black transition-all disabled:opacity-30 interactive"
                disabled={activeIndex === 0}
             >
                <ChevronLeft size={20} />
             </button>
             <button 
                onClick={() => onSelect(Math.min(data.length - 1, activeIndex + 1))}
                className="p-3 rounded-full glass-button text-white hover:bg-white hover:text-black transition-all disabled:opacity-30 interactive"
                disabled={activeIndex === data.length - 1}
             >
                <ChevronRight size={20} />
             </button>
        </div>

      <div 
        ref={containerRef}
        className="flex items-end gap-4 px-4 md:px-8 overflow-x-auto no-scrollbar pb-6 md:pb-8 w-full mask-linear-fade"
      >
        {data.map((item, index) => {
          const isActive = index === activeIndex;
          
          return (
            <button
              key={item.id}
              onClick={() => onSelect(index)}
              className={`
                relative flex-shrink-0 transition-all duration-300 ease-out group text-left rounded-2xl overflow-hidden
                ${isActive 
                    ? 'w-[220px] md:w-[300px] h-[140px] md:h-[180px] opacity-100 ring-2 ring-white/30 shadow-2xl' 
                    : 'w-[100px] md:w-[140px] h-[70px] md:h-[100px] opacity-40 hover:opacity-80 grayscale hover:grayscale-0'}
              `}
            >
              {/* Image */}
              <div className="absolute inset-0 bg-gray-900">
                <img 
                   src={item.imageUrl} 
                   alt={item.title} 
                   className={`w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-100' : 'scale-105'}`}
                />
                <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors" />
              </div>
              
              {/* Content overlay only for active */}
              <div className={`
                 absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-5 flex flex-col justify-end
                 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}
              `}>
                  <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]" />
                      <div className="text-[10px] tracking-widest text-blue-200 font-bold uppercase">{item.label}</div>
                  </div>
                  <div className="text-lg md:text-xl font-display font-medium text-white tracking-wide">{item.title}</div>
              </div>
              
              {/* Static Progress bar for active */}
              {isActive && (
                <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-400 to-indigo-500 w-full shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
              )}
            </button>
          );
        })}
        {/* Spacer */}
        <div className="w-12 flex-shrink-0" />
      </div>
    </div>
  );
};

export default Carousel;