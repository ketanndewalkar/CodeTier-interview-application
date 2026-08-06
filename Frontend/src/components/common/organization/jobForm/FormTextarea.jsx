import React from 'react';

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  required = false,
  helpText
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/80 block">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`w-full p-3.5 bg-[#181424] border ${
          error ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 focus:border-[#6C4F91]'
        } rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none transition-all resize-y`}
      />
      {helpText && !error && <p className="text-[11px] text-white/40">{helpText}</p>}
      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
