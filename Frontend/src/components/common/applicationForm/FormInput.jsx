import React from 'react';

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  icon: Icon,
  prefix,
  min,
  max,
  step,
  disabled = false,
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={name} className="text-xs font-medium text-zinc-300 flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-[#c084fc] font-medium">*</span>}
          </label>
        </div>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3.5 text-xs font-semibold text-zinc-400 select-none pointer-events-none">
            {prefix}
          </div>
        )}
        {Icon && !prefix && (
          <div className="absolute left-3.5 text-zinc-500 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`h-11 w-full bg-[#09080d] border rounded-xl px-3.5 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 transition-colors ${
            prefix ? 'pl-8' : Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500'
              : 'border-white/10 focus:border-[#7C3AED] focus:ring-[#7C3AED]'
          }`}
        />
      </div>

      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-[11px] text-zinc-500">{helperText}</p>
      )}
    </div>
  );
}
