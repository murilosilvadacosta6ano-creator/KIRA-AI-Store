
import React, { useEffect, useState } from 'react';
import { RawgGame } from '../types';
import { X, Play, Heart, Share2, Download, Monitor, Star, Calendar, Cpu, ShoppingBag, ExternalLink, ChevronRight } from 'lucide-react';

interface GameModalProps {
  game: RawgGame | null;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ game, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showInstallOptions, setShowInstallOptions] = useState(false);

  useEffect(() => {
    if (game) {
      setIsVisible(true);
      setShowInstallOptions(false);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
  }, [game]);

  if (!game) return null;

  const handleStoreRedirect = (storeName: string, storeSlug: string) => {
    // Construct a search URL for the specific store since API often returns generic domain
    let url = '';
    const query = encodeURIComponent(game.name);

    if (storeSlug.includes('steam')) url = `https://store.steampowered.com/search/?term=${query}`;
    else if (storeSlug.includes('epic')) url = `https://store.epicgames.com/en-US/browse?q=${query}`;
    else if (storeSlug.includes('playstation')) url = `https://store.playstation.com/en-us/search/${query}`;
    else if (storeSlug.includes('xbox')) url = `https://www.xbox.com/en-us/search?q=${query}`;
    else if (storeSlug.includes('gog')) url = `https://www.gog.com/en/games?query=${query}`;
    else if (storeSlug.includes('nintendo')) url = `https://www.nintendo.com/search/#q=${query}`;
    else url = `https://www.google.com/search?q=${query} ${storeName} store`;

    window.open(url, '_blank');
  };

  const availableStores = game.stores && game.stores.length > 0 
    ? game.stores 
    : [
        { store: { id: 1, name: "Steam", slug: "steam", domain: "steampowered.com" } },
        { store: { id: 2, name: "Epic Games", slug: "epic-games", domain: "epicgames.com" } }
      ]; // Fallback if API has no store data for display purposes

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content - Expanded Width */}
      <div className={`
        relative w-full max-w-6xl max-h-[90vh] glass-panel rounded-3xl overflow-hidden flex flex-col md:flex-row
        transform transition-all duration-500 shadow-2xl border border-white/20
        ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}
      `}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/10"
        >
          <X size={20} />
        </button>

        {/* Left Side - Image/Visuals - Expanded width for cinematic feel */}
        <div className="relative w-full md:w-6/12 h-64 md:h-auto overflow-hidden group">
           <img 
             src={game.background_image} 
             alt={game.name}
             className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0f172a] via-transparent to-transparent" />
           
           <div className="absolute bottom-8 left-8 right-8">
              <div className="flex flex-wrap gap-2 mb-4">
                 {game.genres?.map((g, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-md bg-black/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                        {g.name}
                    </span>
                 ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 leading-none tracking-tight shadow-xl">
                 {game.name}
              </h1>
           </div>
        </div>

        {/* Right Side - Info & Options */}
        <div className="flex-1 p-8 md:p-10 flex flex-col bg-[#0f172a] backdrop-blur-xl overflow-y-auto border-l border-white/5 relative">
           
           {/* Header Info */}
           <div className="mb-8 flex items-end justify-between border-b border-white/5 pb-6">
              <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                    <span className="text-emerald-300 text-[10px] font-bold tracking-[0.2em] uppercase">Verified Protocol</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-300">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-white">{game.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue-400" />
                        <span>{game.released?.split('-')[0] || 'TBA'}</span>
                    </div>
                  </div>
              </div>
              
              <div className="hidden md:flex flex-col items-end gap-1 text-right">
                  <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Platform</span>
                  <div className="flex items-center gap-2 text-white text-xs font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    <Monitor size={14} className="text-purple-400" />
                    {game.parent_platforms?.map(p => p.platform.name).slice(0, 3).join(', ')}
                  </div>
              </div>
           </div>

           {/* Dynamic Content Switching */}
           {!showInstallOptions ? (
             <>
               {/* Description */}
               <div className="flex-1 mb-8 animate-fadeIn">
                  <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Cpu size={14} /> System Description
                  </h3>
                  <div className="text-sm text-gray-300 leading-relaxed space-y-4">
                     <p>
                        Access granted to {game.name}. This title is available for immediate secure installation via authorized K-AI distribution channels. 
                     </p>
                     <p className="opacity-70">
                        Experience high-fidelity graphics and immersive gameplay protocols. Optimization status is nominal.
                     </p>
                  </div>
               </div>
             </>
           ) : (
             <div className="flex-1 mb-8 animate-fadeIn">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Download size={14} /> Select Installation Source
                </h3>
                <div className="grid grid-cols-1 gap-3">
                   {availableStores.map((storeObj, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleStoreRedirect(storeObj.store.name, storeObj.store.slug)}
                        className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-left"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center">
                               <ShoppingBag size={20} className="text-white" />
                            </div>
                            <div>
                               <div className="text-white font-bold text-sm tracking-wide">{storeObj.store.name}</div>
                               <div className="text-xs text-gray-500 font-mono">{storeObj.store.domain}</div>
                            </div>
                         </div>
                         <ExternalLink size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                      </button>
                   ))}
                </div>
                <button 
                  onClick={() => setShowInstallOptions(false)}
                  className="mt-6 text-xs text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <ChevronRight className="rotate-180" size={14} /> Back to details
                </button>
             </div>
           )}

           {/* Actions Footer */}
           <div className="mt-auto pt-6 border-t border-white/5">
              {!showInstallOptions ? (
                <div className="flex flex-col gap-3">
                    <button className="group relative w-full py-4 bg-white text-black rounded-xl font-display font-bold text-sm tracking-widest flex items-center justify-center gap-3 overflow-hidden interactive transition-all hover:bg-gray-200 shadow-lg shadow-white/10">
                        <span className="relative z-10 flex items-center gap-2">
                            <Play size={18} fill="currentColor" />
                            LAUNCH STREAM
                        </span>
                        <div className="absolute inset-0 bg-blue-400/20 w-0 group-hover:w-full transition-all duration-300" />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setShowInstallOptions(true)}
                            className="py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-200 font-medium text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-blue-600/30 hover:text-white transition-all"
                        >
                            <Download size={16} />
                            INSTALL
                        </button>
                        <button className="py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                            <Heart size={16} />
                            FAVORITE
                        </button>
                    </div>
                </div>
              ) : (
                <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                       Redirecting to external provider
                    </p>
                </div>
              )}
              
              <button className="w-full flex items-center justify-center gap-2 text-[10px] text-white/30 hover:text-white transition-colors mt-4 uppercase tracking-widest">
                 <Share2 size={12} />
                 Share Network Link
              </button>
           </div>

        </div>
      </div>
    </div>
  );
};

export default GameModal;