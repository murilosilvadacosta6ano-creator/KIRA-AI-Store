import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Bot } from 'lucide-react';
import { generateSystemResponse } from '../services/geminiService';

interface AiTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiTerminal: React.FC<AiTerminalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'system'; text: string }[]>([
    { role: 'system', text: 'Hello. I am K-AI. How can I assist you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await generateSystemResponse(userMsg);

    setHistory(prev => [...prev, { role: 'system', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Glass Container */}
      <div className="w-full max-w-lg glass-panel rounded-3xl overflow-hidden flex flex-col h-[70vh] relative shadow-2xl border border-white/20">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Sparkles size={16} className="text-white" />
            </div>
            <div>
                <span className="text-sm font-bold text-white tracking-wide block">K-AI ASSISTANT</span>
                <span className="text-[10px] text-blue-300 font-mono">ONLINE // V.26</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {history.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-white/10 backdrop-blur-md text-gray-100 rounded-bl-sm border border-white/5'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 bg-white/5 border-t border-white/10">
          <div className="relative flex items-center">
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask K-AI..."
                className="w-full pl-5 pr-12 py-3 bg-black/20 border border-white/10 rounded-full text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all font-light"
                autoFocus
             />
             <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-400 disabled:opacity-50 disabled:bg-gray-600 transition-all shadow-lg"
             >
               <Send size={16} />
             </button>
          </div>
        </form>
        
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default AiTerminal;