import React, { useState } from 'react';
import { X, Sparkles, Send, Bot } from 'lucide-react';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToBoq: () => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToBoq,
}) => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your VT BuildOS AI Assistant. I can help calculate BOQ estimates, convert site voice notes, or answer queries about your projects and materials. How can I assist you?',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    'How do I add my first project?',
    'Calculate BOQ estimate',
    'Record site worker muster',
  ];

  const handleSend = (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const newMsg = { sender: 'user' as const, text: textToSend, time: 'Just now' };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      let reply = '';
      if (textToSend.includes('project')) {
        reply = 'You can click "+ Add New Project" under the Projects & Portfolio tab or use the "Quick Create" button at the top header to enter your site name, client, and contract budget.';
      } else if (textToSend.includes('boq') || textToSend.includes('estimate')) {
        reply = 'Opening the BOQ & Cost Estimator! You can enter your plot dimensions (width × length), number of floors, and finish quality to calculate concrete, steel, sand, and bricks.';
      } else {
        reply = `Logged "${textToSend}". I am synchronized with your VT BuildOS database.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply, time: 'Just now' }]);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#0A0E1A] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-[#0E1424] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#141C2E] text-cyan-400 border border-cyan-400/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">BuildOS AI Assistant</h3>
            <span className="text-[10px] text-cyan-400 font-mono">Operations Copilot</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-2xl bg-[#141C2E] text-cyan-300 border border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-cyan-400 text-slate-950 font-bold'
                  : 'bg-[#111726] border border-slate-800 text-slate-200'
              }`}
            >
              <div>{m.text}</div>
              <div className={`text-[9px] mt-1 font-mono text-right ${m.sender === 'user' ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                {m.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2.5 border-t border-slate-800 bg-[#0C111E]">
        <div className="text-[10px] text-slate-400 mb-1.5 font-bold uppercase">Quick Inquiries:</div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[10px] bg-[#141C2E] hover:bg-[#1a253d] text-cyan-300 border border-cyan-400/30 px-3 py-1 rounded-xl transition cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800 bg-[#0E1424] flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about projects, materials, BOQ..."
          className="flex-1 bg-[#111726] border border-slate-700/80 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition cursor-pointer shadow-sm"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
