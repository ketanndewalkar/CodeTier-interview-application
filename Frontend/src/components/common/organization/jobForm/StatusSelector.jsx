import React from 'react';

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'DRAFT - Saved as draft, not visible to applicants', badgeBg: 'bg-zinc-800 text-zinc-300' },
  { value: 'OPEN', label: 'OPEN - Active and accepting applications', badgeBg: 'bg-emerald-950 text-emerald-400' },
  { value: 'PAUSED', label: 'PAUSED - Temporarily paused applications', badgeBg: 'bg-amber-950 text-amber-400' },
  { value: 'CLOSED', label: 'CLOSED - Hiring complete / listing closed', badgeBg: 'bg-rose-950 text-rose-400' }
];

export default function StatusSelector({ value = 'DRAFT', onChange, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/80 block">
        Initial Job Status
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-10 px-3.5 bg-[#181424] border ${
          error ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 focus:border-[#6C4F91]'
        } rounded-xl text-xs text-white focus:outline-none transition-all cursor-pointer`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#181424] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
