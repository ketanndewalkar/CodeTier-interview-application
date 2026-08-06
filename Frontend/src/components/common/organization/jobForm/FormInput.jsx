import React from 'react';

export default function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  required = false,
  helpText
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/80 block">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-10 px-3.5 bg-[#181424] border ${
          error ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 focus:border-[#6C4F91]'
        } rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none transition-all`}
      />
      {helpText && !error && <p className="text-[11px] text-white/40">{helpText}</p>}
      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
