import React, { useState } from 'react';
import { Home, Gamepad2, Settings } from 'lucide-react';
import SettingsCard from './SettingsCard';

interface SidebarProps {
  currentView: 'home' | 'games';
  onChangeView: (view: 'home' | 'games') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="fixed left-4 top-4 bottom-4 w-[70px] glass-panel rounded-full flex flex-col items-center py-8 z-50 shadow-2xl border border-white/20">
        {/* Logo Area */}
        <div 
          onClick={() => onChangeView('home')}
          className="mb-16 interactive hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="flex flex-col items-center">
              <span className="font-display text-2xl font-bold bg-gradient-to-br from-gray-200 to-blue-500 bg-clip-text text-transparent">
                  K-AI
              </span>
          </div>
        </div>
        
        {/* Nav Items */}
        <div className="flex flex-col gap-8 w-full px-2">
          <NavButton 
            icon={<Home size={22} />} 
            label="HOME" 
            active={currentView === 'home'} 
            onClick={() => onChangeView('home')} 
          />
          
          <NavButton 
            icon={<Gamepad2 size={22} />} 
            label="GAMES" 
            active={currentView === 'games'} 
            onClick={() => onChangeView('games')} 
          />
        </div>

        {/* Bottom Settings Button (Replaces Photo) */}
        <div className="mt-auto mb-2">
          <button 
             onClick={() => setShowSettings(!showSettings)}
             className={`
               w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300
               ${showSettings 
                  ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/30'}
             `}
          >
               <Settings size={20} className={showSettings ? "animate-spin-slow" : ""} />
          </button>
        </div>
      </div>

      {/* Settings Modal Component */}
      <SettingsCard isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

// Helper component for clearer code
const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`
      relative group w-full aspect-square flex items-center justify-center rounded-2xl transition-all duration-300
      ${active ? 'bg-white/20 text-blue-400 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]' : 'text-white/40 hover:text-white hover:bg-white/10'}
    `}
  >
    {icon}
    {/* Tooltip */}
    <span className="absolute left-14 ml-2 px-3 py-1 glass-panel rounded-lg text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
      {label}
    </span>
    {active && <div className="absolute -left-1 w-1 h-6 bg-blue-400 rounded-r-full shadow-[0_0_10px_#60a5fa]"></div>}
  </button>
);

export default Sidebar;