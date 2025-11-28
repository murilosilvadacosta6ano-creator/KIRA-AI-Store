
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchGames } from '../services/gameService';
import { RawgGame } from '../types';
import { Star, Monitor, Calendar, AlertTriangle, RefreshCw, Maximize2, Search, X } from 'lucide-react';
import GameModal from './GameModal';

const GameGrid: React.FC = () => {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [selectedGame, setSelectedGame] = useState<RawgGame | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const observer = useRef<IntersectionObserver | null>(null);

  // Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 600); // 600ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset Grid when Search Changes
  useEffect(() => {
    setGames([]);
    setPage(1);
    setHasMore(true);
    // The loadGames effect will trigger because debouncedSearch changes or retryTrigger/page dependencies
  }, [debouncedSearch]);

  // Infinite Scroll Observer
  const lastGameElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !error) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, error]);

  useEffect(() => {
    const controller = new AbortController();
    
    const loadGames = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const newGames = await fetchGames(page, controller.signal, debouncedSearch);
        
        if (newGames && newGames.length > 0) {
            setGames(prev => {
                // If page 1, strictly set games (avoids duplication on search reset)
                if (page === 1) return newGames;
                
                const existingIds = new Set(prev.map(g => g.id));
                const uniqueNewGames = newGames.filter(g => !existingIds.has(g.id));
                return [...prev, ...uniqueNewGames];
            });
            setHasMore(true); 
        } else {
            setHasMore(false);
            if (page === 1) setGames([]); // Clear if no results found on first page
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
            console.error("Load Games Error:", err);
            setError("Connection lost.");
        }
      } finally {
        if (!controller.signal.aborted) {
            setLoading(false);
        }
      }
    };

    loadGames();

    return () => {
      controller.abort();
    };
  }, [page, retryTrigger, debouncedSearch]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryTrigger(prev => prev + 1);
    setPage(1); 
  };

  return (
    <>
      <div className="h-full w-full overflow-y-auto px-6 md:px-12 pt-24 pb-10 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
        <div className="max-w-[1600px] mx-auto min-h-[500px]">
          
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white drop-shadow-lg">
                  GAMES
              </h2>

              {/* Search Bar */}
              <div className="relative group w-full md:w-[320px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH DATABASE..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-11 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all font-medium tracking-wide backdrop-blur-md"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
          </div>

          {error ? (
              <div className="flex flex-col items-center justify-center h-[300px] glass-panel rounded-3xl p-8 text-center border border-red-500/20">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                      <AlertTriangle size={32} className="text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">SIGNAL LOST</h3>
                  <p className="text-white/50 mb-6 max-w-md text-sm">
                      Unable to retrieve data from the K-AI cloud node.
                  </p>
                  <button 
                      onClick={handleRetry}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                      <RefreshCw size={16} />
                      RECONNECT
                  </button>
              </div>
          ) : (
              <>
                {games.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-white/30">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-light tracking-widest">NO RESULTS FOUND</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {games.map((game, index) => {
                        const isLast = games.length === index + 1;
                        return (
                            <div 
                                ref={isLast ? lastGameElementRef : null} 
                                key={`${game.id}-${index}`} 
                                onClick={() => setSelectedGame(game)}
                                className="group relative flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
                                style={{ height: '340px' }}
                            >
                                {/* Image Container */}
                                <div className="absolute inset-0 w-full h-full">
                                    <img 
                                        src={game.background_image || 'https://via.placeholder.com/600x400'} 
                                        alt={game.name}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
                                </div>
                                
                                {/* Hover Overlay Icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                                        <Maximize2 size={20} className="text-white" />
                                    </div>
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                                    {/* Meta Badge */}
                                    <div className="flex justify-between items-start absolute top-4 left-4 right-4">
                                        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] uppercase font-bold text-white/90">
                                            {game.genres?.[0]?.name || 'RPG'}
                                        </div>
                                        {game.metacritic && (
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 font-bold text-xs backdrop-blur-sm">
                                                {game.metacritic}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-display font-bold text-white leading-tight mb-2 group-hover:text-blue-300 transition-colors">
                                        {game.name}
                                    </h3>
                                    
                                    <div className="flex items-center gap-4 text-[11px] font-medium text-white/70">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={12} className="text-blue-400" />
                                            <span>{game.released?.split('-')[0] || 'TBA'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                            <span>{game.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Monitor size={12} className="text-purple-400" />
                                            <span className="truncate max-w-[80px]">
                                                {game.parent_platforms?.map(p => p.platform.slug).slice(0, 2).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                )}
              </>
          )}
          
          {loading && !error && (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Detail Modal */}
      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </>
  );
};

export default GameGrid;
