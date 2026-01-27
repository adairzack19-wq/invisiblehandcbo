import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, ChevronRight } from 'lucide-react';
import { askPITAssistant } from '../services/geminiService.ts';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Habari! I am the assistant for The Invisible Hands. How can I help you understand our mission for PWD empowerment in Tanzania today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await askPITAssistant(userMsg);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: response || 'I apologize, I could not generate a response.' }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-end gap-0">
      {isOpen ? (
        <div className="flex items-center animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Cancel/Close Tab */}
          <button
            onClick={() => setIsOpen(false)}
            className="hidden sm:flex bg-emerald-700 text-white py-8 px-2 rounded-l-2xl shadow-2xl hover:bg-emerald-800 transition-colors flex-col items-center justify-center gap-2 border-r border-emerald-600/30 group"
            aria-label="Cancel and close chat"
          >
            <span className="[writing-mode:vertical-lr] rotate-180 font-bold text-[10px] uppercase tracking-widest">Close</span>
            <X className="w-4 h-4 group-hover:scale-125 transition-transform" />
          </button>

          {/* Chat Window */}
          <div 
            className="bg-white rounded-3xl sm:rounded-l-none rounded-r-3xl shadow-2xl w-[320px] sm:w-[400px] flex flex-col overflow-hidden border border-slate-100 max-h-[80vh]"
            role="dialog"
            aria-labelledby="chat-title"
          >
            <div className="bg-emerald-600 p-4 md:p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl" aria-hidden="true">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 id="chat-title" className="font-bold text-sm md:text-base">Support Assistant</h4>
                  <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] opacity-80 uppercase tracking-widest font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span>
                    Online Now
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/10 p-1.5 rounded-lg"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              ref={scrollRef} 
              className="h-80 md:h-96 overflow-y-auto p-4 md:p-5 space-y-4 bg-slate-50/50"
              role="log"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                    }`}
                    aria-label={`${m.role === 'user' ? 'You said' : 'Assistant said'}: ${m.content}`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1" aria-label="Assistant is typing">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 md:p-4 bg-white border-t border-slate-100 flex gap-2">
              <label htmlFor="chat-input" className="sr-only">Type your message</label>
              <input 
                id="chat-input"
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-2 text-xs md:text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              />
              <button 
                onClick={handleSend}
                className="bg-emerald-600 text-white p-2 md:p-2.5 rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50"
                disabled={isTyping || !input.trim()}
                aria-label="Send message"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 text-white p-3 md:p-4 rounded-full shadow-2xl hover:bg-emerald-700 hover:scale-110 transition-all group flex items-center gap-3"
          aria-label="Open chat with assistant"
        >
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold text-sm">
            Chat with us
          </span>
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}
    </div>
  );
};

export default AIAssistant;