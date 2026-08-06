import React from 'react';

const EXPERIENCE_OPTIONS = [
  { value: 'ENTRY_LEVEL', label: 'Entry Level (0-1 years)' },
  { value: 'JUNIOR', label: 'Junior (1-3 years)' },
  { value: 'MID_LEVEL', label: 'Mid Level (3-5 years)' },
  { value: 'SENIOR', label: 'Senior (5-8 years)' },
  { value: 'EXPERT', label: 'Expert (8+ years)' },
];

export default function ExperienceSelector({ value, onChange, error, required = false }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/80 block">
        Experience Requirement {required && <span className="text-rose-400">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-10 px-3.5 bg-[#181424] border ${
          error ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 focus:border-[#6C4F91]'
        } rounded-xl text-xs text-white focus:outline-none transition-all cursor-pointer`}
      >
        {EXPERIENCE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#181424] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
