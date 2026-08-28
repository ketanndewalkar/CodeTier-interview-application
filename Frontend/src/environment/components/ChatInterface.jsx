import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, MoreVertical, Send } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Interviewer',
      time: '10:40 AM',
      text: 'Can you see my screen?',
      isMe: false,
    },
    {
      id: 2,
      sender: 'Candidate',
      time: '10:41 AM',
      text: 'Yes, clearly.',
      isMe: true,
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Generate formatted time
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    const newMessage = {
      id: Date.now(),
      sender: 'Candidate',
      time: formattedTime,
      text: inputValue.trim(),
      isMe: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0e0d15] border-t border-neutral-800/80">
      {/* Chat Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-indigo-400" />
          <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-widest">
            Chat
          </span>
        </div>
        <button className="text-neutral-400 hover:text-neutral-200 transition-colors p-1 rounded hover:bg-neutral-900 cursor-pointer">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            {/* Meta info header */}
            <div className="flex items-baseline gap-2 mb-1">
              {!msg.isMe && (
                <>
                  <span className="text-[11px] font-medium text-indigo-300">{msg.sender}</span>
                  <span className="text-[9px] text-neutral-500">{msg.time}</span>
                </>
              )}
              {msg.isMe && (
                <>
                  <span className="text-[9px] text-neutral-500">{msg.time}</span>
                  <span className="text-[11px] font-medium text-orange-400">{msg.sender}</span>
                </>
              )}
            </div>

            {/* Bubble */}
            <div 
              className={`max-w-[85%] rounded-lg px-3.5 py-2 text-[13px] leading-relaxed shadow-sm break-words
                ${msg.isMe 
                  ? 'bg-[#3b1223] text-neutral-100 rounded-tr-none border border-[#521931]/30' 
                  : 'bg-[#181824] text-neutral-200 rounded-tl-none border border-[#252538]/30'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel */}
      <form 
        onSubmit={handleSendMessage}
        className="p-3 border-t border-neutral-800/80 bg-[#0a0a0f]"
      >
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..." 
            className="w-full bg-[#14131b] border border-neutral-800/80 hover:border-neutral-700 focus:border-indigo-500 text-neutral-200 text-[13px] rounded-lg pl-3.5 pr-10 py-2.5 outline-none transition-all placeholder-neutral-500"
          />
          <button 
            type="submit"
            className="absolute right-2 text-indigo-400 hover:text-indigo-300 transition-colors p-1.5 rounded-md hover:bg-neutral-800/50 cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
