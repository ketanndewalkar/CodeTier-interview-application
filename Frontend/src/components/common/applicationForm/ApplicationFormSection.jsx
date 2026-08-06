import React from 'react';

export default function ApplicationFormSection({ title, description, children, icon: Icon, stepNumber }) {
  return (
    <div className="border-b border-white/10 pb-7 mb-7 last:border-b-0 last:pb-0 last:mb-0 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          {stepNumber && (
            <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest">
              Step {stepNumber}
            </div>
          )}
          <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight flex items-center gap-2">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-zinc-400">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );
}
