import { useState, useEffect } from 'react';
import { Search, Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function Navbar() {
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

  return (
    <header className="h-auto md:h-20 flex flex-col md:flex-row items-center justify-between gap-4 px-1 mb-6 mt-3">
      {/* Mobile Logo Brand + Search */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="md:hidden shrink-0">
          <img src="./logo.png" className="h-7 object-contain" />
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#13111a] border border-white/10 rounded-xl pl-10 pr-12 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#6C4F91] transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/50">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Today's Date & Time + Notifications */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Today's Date & Live Time Badge */}
        <div className="flex items-center gap-3 bg-[#13111a] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-white/90 shadow-sm">
          <div className="flex items-center gap-1.5 border-r border-white/10 pr-3">
            <CalendarIcon className="w-3.5 h-3.5 text-[#a855f7]" />
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
