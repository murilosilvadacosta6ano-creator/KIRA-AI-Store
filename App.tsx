import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import GameGrid from './components/GameGrid';
import { CARD_DATA } from './constants';
import { fetchHeroGames } from './services/gameService';
import { CardData } from './types';

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentView, setCurrentView] = useState<'home' | 'games'>('home');
  const [heroData, setHeroData] = useState<CardData[]>([]);
  const [loadingHero, setLoadingHero] = useState(true);

  // Fetch dynamic games for the carousel on mount
  useEffect(() => {
    const loadHeroGames = async () => {
      setLoadingHero(true);
      const games = await fetchHeroGames();
      if (games.length > 0) {
        setHeroData(games);
      }
      setLoadingHero(false);
    };
    loadHeroGames();
  }, []);

  // Auto-advance functionality only on Home view
  useEffect(() => {
    if (currentView !== 'home' || heroData.length === 0) return;

    const timer = setInterval(() => {
       setActiveIndex(prev => (prev + 1) % heroData.length);
    }, 8000); 

    return () => clearInterval(timer);
  }, [currentView, heroData.length]);

  // Ensure activeIndex is valid if data changes
  useEffect(() => {
    if (activeIndex >= heroData.length) {
      setActiveIndex(0);
    }
  }, [heroData.length]);

  const activeItem = heroData[activeIndex] || heroData[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Dynamic Liquid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#000000]"></div>
        {/* Orbs/Gradients - Static now */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-500/20 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
        <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-gray-500/10 rounded-full blur-[80px] opacity-20 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Structural Layout */}
      <div className="relative z-10 flex w-full h-full">
         <Sidebar currentView={currentView} onChangeView={setCurrentView} />
         
         <main className="relative flex-1 h-full ml-[90px] p-4">
            <Header />
            
            {currentView === 'home' ? (
              <div className="h-full w-full relative rounded-3xl overflow-hidden glass-panel">
                {loadingHero ? (
                   <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <div className="text-blue-200 text-xs font-bold tracking-widest uppercase">INITIALIZING STREAM...</div>
                   </div>
                ) : heroData.length > 0 ? (
                  <>
                    {/* Active Content Display */}
                    {activeItem && <Hero data={activeItem} />}
                    
                    {/* Bottom Navigation Carousel */}
                    <Carousel 
                      data={heroData} 
                      activeIndex={activeIndex} 
                      onSelect={setActiveIndex} 
                    />
                  </>
                ) : (
                   <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-white/50 text-sm">NO SIGNAL DETECTED</div>
                   </div>
                )}
              </div>
            ) : (
              <GameGrid />
            )}
         </main>
      </div>

      {/* OS Version Indicator - Only visible on Home */}
      {currentView === 'home' && (
        <div className="fixed bottom-8 left-[120px] z-20 pointer-events-none hidden md:block">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <div className="text-[10px] text-white/40 font-display tracking-widest uppercase">
                  K-AI SYSTEM // IOS.26
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;