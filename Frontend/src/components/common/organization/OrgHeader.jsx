import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrgHeader({ onSearch, onCreateJobClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching organization records for: "${searchQuery}"`);
      if (onSearch) onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0d0a14]/90 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between gap-4">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search candidates, jobs, applications..."
          className="w-full h-9 pl-9 pr-14 bg-white/[0.04] border border-white/10 focus:border-[#7c3aed] rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#7c3aed] transition-all"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-white/50 pointer-events-none">
          <span>⌘</span>
          <span>K</span>
        </div>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Live Date & Time Badge */}
        <div className="flex items-center gap-3 bg-[#13111a] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-white/90 shadow-sm">
          <div className="flex items-center gap-1.5 border-r border-white/10 pr-3">
            <Calendar className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>{formatDate(currentDateTime)}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-white/80">
            <Clock className="w-3.5 h-3.5 text-[#c084fc]" />
            <span>{formatTime(currentDateTime)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
