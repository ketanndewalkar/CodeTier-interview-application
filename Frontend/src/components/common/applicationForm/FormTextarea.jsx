import React from 'react';

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  error,
  helperText,
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={name} className="text-xs font-medium text-zinc-300 flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-[#c084fc] font-medium">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full bg-[#09080d] border rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 transition-colors resize-none ${
          error
            ? 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500'
            : 'border-white/10 focus:border-[#7C3AED] focus:ring-[#7C3AED]'
        }`}
      />

      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-[11px] text-zinc-500">{helperText}</p>
      )}
    </div>
  );
}
