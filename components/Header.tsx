import React from 'react';
import { Wallet } from 'lucide-react';

const Header = () => {
  return (
    <div className="fixed top-8 right-12 z-50">
       <button className="group flex items-center gap-3 px-6 py-2.5 glass-button rounded-full text-white font-display font-medium text-sm tracking-wide interactive overflow-hidden relative">
          <Wallet size={16} className="text-blue-300" />
          <span>CONNECT ID</span>
          <div className="w-2 h-2 rounded-full bg-red-400/80 shadow-[0_0_8px_rgba(248,113,113,0.6)]"></div>
       </button>
    </div>
  );
};

export default Header;