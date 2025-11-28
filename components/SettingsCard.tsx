import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Type, Eye, Palette, Info, Moon, Sun, Zap, ChevronRight, User, LogOut, Lock, Mail, Globe, Check } from 'lucide-react';

interface SettingsCardProps {
  isOpen: boolean;
  onClose: () => void;
}

type Page = 'main' | 'accessibility' | 'theme' | 'about' | 'account';
interface StoredUser {
  email: string;
  pass: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ isOpen, onClose }) => {
  const [activePage, setActivePage] = useState<Page>('main');
  
  // Accessibility States
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Account States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [errorMsg, setErrorMsg] = useState('');
  const [googleConfig, setGoogleConfig] = useState(true); // Mock Google Config

  // Load saved settings on mount
  useEffect(() => {
    const savedLogin = localStorage.getItem('loggedIn') === 'true';
    if (savedLogin) {
      const currentUser = localStorage.getItem('currentUserEmail');
      if (currentUser) {
        setIsLoggedIn(true);
        setUserEmail(currentUser);
      }
    }
  }, []);

  // Accessibility Logic
  const toggleFontSize = () => {
    const newState = !largeFont;
    setLargeFont(newState);
    document.body.style.fontSize = newState ? "120%" : "";
  };

  const toggleContrast = () => {
    const newState = !highContrast;
    setHighContrast(newState);
    document.body.style.filter = newState ? "contrast(1.5) saturate(1.2)" : "";
  };

  // Theme Logic
  const setAppTheme = (theme: 'dark' | 'light' | 'neon') => {
    document.body.classList.remove('theme-light', 'theme-neon');
    document.body.style.background = "";
    document.body.style.color = "";

    if (theme === 'dark') {
      document.body.style.backgroundColor = "#000000";
      document.body.style.color = "#ffffff";
    } else if (theme === 'light') {
      document.body.style.backgroundColor = "#f0f0f0";
      document.body.style.color = "#000000";
    } else if (theme === 'neon') {
      document.body.style.background = "linear-gradient(135deg, #0e0022, #4e00ff)";
      document.body.style.color = "#ffffff";
    }
  };

  // Auth Logic
  const handleAuth = () => {
    setErrorMsg('');

    // Basic Validation
    if (!emailInput || !passInput) {
      setErrorMsg('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (passInput.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    // Fetch existing users
    const usersStr = localStorage.getItem('kai_users');
    const users: StoredUser[] = usersStr ? JSON.parse(usersStr) : [];

    if (authMode === 'signup') {
      // Check for existing email
      if (users.some(u => u.email === emailInput)) {
        setErrorMsg('An account with this email already exists.');
        return;
      }

      // Register new user
      const newUser = { email: emailInput, pass: passInput };
      users.push(newUser);
      localStorage.setItem('kai_users', JSON.stringify(users));
      
      // Auto-login
      loginUser(emailInput);
    } else {
      // Login Logic
      const foundUser = users.find(u => u.email === emailInput && u.pass === passInput);
      
      if (foundUser) {
        loginUser(emailInput);
      } else {
        setErrorMsg('Invalid email or password.');
      }
    }
  };

  const loginUser = (email: string) => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('currentUserEmail', email);
    setUserEmail(email);
    setIsLoggedIn(true);
    setErrorMsg('');
  };

  const handleSocialLogin = (provider: string) => {
    // Simulating OAuth process
    const mockEmail = `user@${provider.toLowerCase()}.com`;
    // Add artificial delay
    setTimeout(() => {
        loginUser(mockEmail);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('currentUserEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    setEmailInput('');
    setPassInput('');
    setErrorMsg('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-[100px] bottom-4 z-50 w-[340px] glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/20 animate-fadeIn text-white">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <h2 className="text-sm font-bold tracking-widest uppercase text-white">Settings</h2>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Content Area */}
      <div className="relative h-[480px] overflow-hidden bg-black/40">
        
        {/* Main Menu */}
        <div className={`absolute inset-0 p-4 transition-transform duration-300 ${activePage === 'main' ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="flex flex-col gap-2">
              <MenuOption 
                icon={<User size={18} />} 
                label="Account" 
                subLabel={isLoggedIn ? userEmail : 'Sign In / Register'}
                onClick={() => setActivePage('account')} 
              />
              <MenuOption 
                icon={<Type size={18} />} 
                label="Accessibility" 
                onClick={() => setActivePage('accessibility')} 
              />
              <MenuOption 
                icon={<Palette size={18} />} 
                label="Themes" 
                onClick={() => setActivePage('theme')} 
              />
              <MenuOption 
                icon={<Info size={18} />} 
                label="About App" 
                onClick={() => setActivePage('about')} 
              />
           </div>
        </div>

        {/* Subpage: Account */}
        <SubPage isActive={activePage === 'account'} onBack={() => setActivePage('main')} title="Account">
           {isLoggedIn ? (
             <div className="flex flex-col items-center justify-start h-full pb-8 animate-fadeIn overflow-y-auto">
                <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.3)] mt-4">
                  <User size={40} className="text-blue-300" />
                </div>
                <h4 className="text-lg font-bold mb-1 tracking-wide">{userEmail}</h4>
                <p className="text-xs text-emerald-400 mb-6 flex items-center gap-1.5 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse"></span> SYSTEM CONNECTED
                </p>

                <div className="w-full bg-white/5 rounded-xl p-3 mb-6">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Linked Accounts</h5>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <div className="flex items-center gap-2 text-sm text-gray-200">
                           <Globe size={14} /> Google Account
                        </div>
                        <button onClick={() => setGoogleConfig(!googleConfig)} className={`w-8 h-4 rounded-full relative transition-colors ${googleConfig ? 'bg-blue-500' : 'bg-gray-600'}`}>
                           <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${googleConfig ? 'left-4.5' : 'left-0.5'}`} />
                        </button>
                    </div>
                </div>

                <button onClick={handleLogout} className="mt-auto flex items-center gap-2 px-6 py-2.5 bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-xl text-sm transition-all w-full justify-center font-bold tracking-wider">
                  <LogOut size={16} /> DISCONNECT ID
                </button>
             </div>
           ) : (
             <div className="flex flex-col h-full animate-fadeIn overflow-y-auto pr-1">
                {/* Tabs */}
                <div className="flex p-1 bg-white/5 rounded-xl mb-4 border border-white/5 shrink-0">
                  <button 
                    onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all tracking-widest ${authMode === 'login' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    LOGIN
                  </button>
                  <button 
                    onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all tracking-widest ${authMode === 'signup' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    REGISTER
                  </button>
                </div>
                
                {/* Form */}
                <div className="flex flex-col gap-3 shrink-0">
                    <div className="relative group">
                        <Mail size={16} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-black/40 text-white transition-all placeholder:text-gray-600"
                        />
                    </div>
                    
                    <div className="relative group">
                        <Lock size={16} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                        type="password" 
                        placeholder="Enter password" 
                        value={passInput}
                        onChange={(e) => setPassInput(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-black/40 text-white transition-all placeholder:text-gray-600"
                        />
                    </div>
                    
                    {errorMsg && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-300 text-center animate-fadeIn">
                            {errorMsg}
                        </div>
                    )}

                    <button 
                    onClick={handleAuth}
                    className="mt-1 w-full py-3 bg-white text-black font-bold text-xs tracking-widest rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase"
                    >
                    {authMode === 'login' ? 'Authenticate' : 'Create Identity'}
                    </button>
                </div>

                {/* Social Login Section */}
                <div className="mt-6 flex flex-col gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="h-[1px] bg-white/10 flex-1"></div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Or connect with</span>
                        <div className="h-[1px] bg-white/10 flex-1"></div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => handleSocialLogin('Google')} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                             <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.053-3.24 2.067-2.067 2.693-5.24 2.693-7.84 0-.76-.067-1.48-.173-2H12.48z" />
                             </svg>
                             <span className="text-[10px] mt-1 text-gray-400">Google</span>
                        </button>
                        <button onClick={() => handleSocialLogin('GitHub')} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                             <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                             </svg>
                             <span className="text-[10px] mt-1 text-gray-400">GitHub</span>
                        </button>
                        <button onClick={() => handleSocialLogin('Microsoft')} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                             <div className="w-5 h-5 grid grid-cols-2 gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                <div className="bg-[#f25022]"></div>
                                <div className="bg-[#7fba00]"></div>
                                <div className="bg-[#00a4ef]"></div>
                                <div className="bg-[#ffb900]"></div>
                             </div>
                             <span className="text-[10px] mt-1 text-gray-400">Microsoft</span>
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 text-center pb-4">
                    <p className="text-[10px] text-gray-600">
                        Secure K-AI Authentication Protocol v2.4
                    </p>
                </div>
             </div>
           )}
        </SubPage>

        {/* Subpage: Accessibility */}
        <SubPage isActive={activePage === 'accessibility'} onBack={() => setActivePage('main')} title="Accessibility">
           <div className="flex flex-col gap-4 mt-2">
              <ToggleRow 
                label="Large Text" 
                description="Increase general font size"
                isActive={largeFont} 
                onToggle={toggleFontSize} 
                icon={<Type size={16} />}
              />
              <ToggleRow 
                label="High Contrast" 
                description="Increase interface contrast"
                isActive={highContrast} 
                onToggle={toggleContrast} 
                icon={<Eye size={16} />}
              />
           </div>
        </SubPage>

        {/* Subpage: Themes */}
        <SubPage isActive={activePage === 'theme'} onBack={() => setActivePage('main')} title="Themes">
           <div className="flex flex-col gap-3 mt-2">
              <ThemeButton onClick={() => setAppTheme('dark')} label="Dark Mode (Default)" icon={<Moon size={16} />} />
              <ThemeButton onClick={() => setAppTheme('light')} label="Light Mode" icon={<Sun size={16} />} />
              <ThemeButton onClick={() => setAppTheme('neon')} label="Neon Mode" icon={<Zap size={16} />} />
           </div>
        </SubPage>

        {/* Subpage: About */}
        <SubPage isActive={activePage === 'about'} onBack={() => setActivePage('main')} title="About">
           <div className="text-center mt-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
                 <Info size={32} className="text-blue-300" />
              </div>
              <p className="text-sm font-bold text-white mb-1">K-AI OS</p>
              <p className="text-xs text-white/50 mb-4">Version 26.0.1</p>
              <p className="text-[10px] text-white/30">Created for XOCIETY ecosystem.</p>
           </div>
        </SubPage>

      </div>
    </div>
  );
};

// Helper Components
const MenuOption = ({ icon, label, subLabel, onClick }: { icon: any, label: string, subLabel?: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 transition-all text-left group"
  >
    <span className="text-blue-300 group-hover:text-white transition-colors">{icon}</span>
    <div className="flex-1 overflow-hidden">
      <div className="text-sm font-medium text-gray-200 group-hover:text-white truncate">{label}</div>
      {subLabel && <div className="text-[10px] text-gray-500 group-hover:text-gray-400 truncate">{subLabel}</div>}
    </div>
    <ChevronRight size={16} className="ml-auto text-white/20 group-hover:text-white/60 flex-shrink-0" />
  </button>
);

const SubPage = ({ isActive, onBack, title, children }: any) => (
  <div className={`absolute inset-0 p-4 transition-transform duration-300 bg-[#000000]/90 backdrop-blur-xl ${isActive ? 'translate-x-0' : 'translate-x-full'}`}>
     <button onClick={onBack} className="flex items-center gap-2 text-xs text-white/60 hover:text-white mb-4 transition-colors">
        <ChevronLeft size={14} /> Back
     </button>
     <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">{title}</h3>
     {children}
  </div>
);

const ToggleRow = ({ label, description, isActive, onToggle, icon }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
     <div className="flex items-center gap-3">
        <span className="text-gray-400">{icon}</span>
        <div>
          <div className="text-sm text-gray-200 font-medium">{label}</div>
          <div className="text-[10px] text-gray-500">{description}</div>
        </div>
     </div>
     <button 
        onClick={onToggle}
        className={`w-10 h-6 rounded-full relative transition-colors ${isActive ? 'bg-blue-500' : 'bg-white/20'}`}
     >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isActive ? 'left-5' : 'left-1'}`} />
     </button>
  </div>
);

const ThemeButton = ({ onClick, label, icon }: any) => (
   <button 
     onClick={onClick}
     className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 transition-all text-left text-sm text-gray-200 hover:text-white"
   >
      {icon} {label}
   </button>
);

export default SettingsCard;