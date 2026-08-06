import React from 'react';
import { Calendar } from 'lucide-react';

export default function DatePicker({ label, name, value, onChange, min, error, required = false }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/80 block">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <div className="relative">
        <input
          type="date"
          name={name}
          value={value}
          min={min}
          onChange={onChange}
          className={`w-full h-10 px-3.5 pr-10 bg-[#181424] border ${
            error ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 focus:border-[#6C4F91]'
          } rounded-xl text-xs text-white focus:outline-none transition-all cursor-pointer [color-scheme:dark]`}
        />
        <Calendar className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
