import React, { useState } from 'react';
import { Wand2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE } from '../../services/api';

interface ChatWidgetProps {
  userContext?: string;
}

export default function ChatWidget({ userContext }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMsg = message;
    setChatLog([...chatLog, { role: 'user', text: userMsg }]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, user_context: userContext })
      });
      const data = await response.json();
      setChatLog(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (error) {
      setChatLog(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting to the brain right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                <span className="font-bold">Recrux Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100">×</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatLog.length === 0 && (
                <div className="text-center py-10">
                   <p className="text-slate-400 text-sm">Ask me anything about your career or job matches!</p>
                </div>
              )}
              {chatLog.map((log, i) => (
                <div key={i} className={`flex ${log.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${log.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                    {log.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none animate-pulse">
                      <div className="flex gap-1">
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                   </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..." 
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" 
              />
              <button onClick={handleSend} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                 <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        {isOpen ? <ChevronRight className="w-6 h-6 rotate-90" /> : <Wand2 className="w-6 h-6" />}
      </button>
    </div>
  );
}
