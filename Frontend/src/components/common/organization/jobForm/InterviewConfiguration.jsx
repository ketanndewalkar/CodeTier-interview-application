import React from 'react';
import EnvironmentSelector from './EnvironmentSelector';

const DURATION_OPTIONS = [
  { value: '30 minutes', label: '30 minutes' },
  { value: '45 minutes', label: '45 minutes' },
  { value: '60 minutes', label: '60 minutes' },
  { value: '90 minutes', label: '90 minutes' }
];

const BUFFER_OPTIONS = [
  { value: '0 minutes', label: '0 minutes' },
  { value: '5 minutes', label: '5 minutes' },
  { value: '10 minutes', label: '10 minutes' },
  { value: '15 minutes', label: '15 minutes' }
];

export default function InterviewConfiguration({ value, onChange, errors = {} }) {
  const handleDurationChange = (e) => {
    onChange({
      ...value,
      duration: e.target.value
    });
  };

  const handleBufferChange = (e) => {
    onChange({
      ...value,
      bufferTime: e.target.value
    });
  };

  const handleEnvironmentChange = (envId) => {
    onChange({
      ...value,
      environmentId: envId
    });
  };

  return (
    <div className="space-y-4 p-4 rounded-xl bg-[#120e1a]/80 border border-white/10">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#c084fc]">
          Section 5: Interview Configuration
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Duration Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/80 block">
            Interview Duration <span className="text-rose-400">*</span>
          </label>
          <select
            value={value.duration}
            onChange={handleDurationChange}
            className={`w-full h-10 px-3.5 bg-[#181424] border ${
              errors.duration ? 'border-rose-500/80' : 'border-white/10 focus:border-[#6C4F91]'
            } rounded-xl text-xs text-white focus:outline-none transition-all cursor-pointer`}
          >
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#181424] text-white">
                {opt.label}
              </option>
            ))}
          </select>
          {errors.duration && <p className="text-[11px] text-rose-400 font-medium">{errors.duration}</p>}
        </div>

        {/* Buffer Time Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/80 block">
            Buffer Time <span className="text-rose-400">*</span>
          </label>
          <select
            value={value.bufferTime}
            onChange={handleBufferChange}
            className={`w-full h-10 px-3.5 bg-[#181424] border ${
              errors.bufferTime ? 'border-rose-500/80' : 'border-white/10 focus:border-[#6C4F91]'
            } rounded-xl text-xs text-white focus:outline-none transition-all cursor-pointer`}
          >
            {BUFFER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#181424] text-white">
                {opt.label}
              </option>
            ))}
          </select>
          {errors.bufferTime && <p className="text-[11px] text-rose-400 font-medium">{errors.bufferTime}</p>}
        </div>
      </div>

      {/* Environment Selector */}
      <EnvironmentSelector
        value={value.environmentId}
        onChange={handleEnvironmentChange}
        error={errors.environmentId}
        required
      />
    </div>
  );
}
