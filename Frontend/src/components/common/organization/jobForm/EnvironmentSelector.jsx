import React from 'react';
import { Code2, Layout, Terminal, Cpu, Database, Check, Server, Loader2, AlertCircle } from 'lucide-react';
import { useEnvironments } from '../../../../pages/organization/hooks/useOrganization';

const ICON_MAP = {
  REACT: Layout,
  NODE: Server,
  PYTHON: Terminal,
  JAVA: Cpu,
  CPP: Code2,
  C: Code2,
};

export default function EnvironmentSelector({ value, onChange, error, required = false }) {
  const { environments, isLoading, isError } = useEnvironments();

  const getIcon = (lang) => {
    return ICON_MAP[lang?.toUpperCase()] || Code2;
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-white/80 block">
        Interview Environment {required && <span className="text-rose-400">*</span>}
      </label>

      {isLoading && (
        <div className="flex items-center gap-2 text-white/50 text-xs py-4">
          <Loader2 className="w-4 h-4 animate-spin text-[#c084fc]" />
          <span>Loading coding environments…</span>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-rose-400 text-xs py-4">
          <AlertCircle className="w-4 h-4" />
          <span>Failed to load coding environments.</span>
        </div>
      )}

      {!isLoading && !isError && environments.length === 0 && (
        <div className="text-white/40 text-xs py-4">
          No coding environments available.
        </div>
      )}

      {!isLoading && !isError && environments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {environments.map((env) => {
            const Icon = getIcon(env.language);
            const isSelected = value === env._id;

            return (
              <div
                key={env._id}
                onClick={() => onChange(env._id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#271842] border-[#6C4F91] ring-1 ring-[#6C4F91]'
                    : 'bg-[#181424] border-white/10 hover:border-white/20 hover:bg-[#1f1a30]'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isSelected ? 'bg-[#6C4F91] text-white' : 'bg-white/5 text-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{env.name}</h4>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#6C4F91] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed mt-0.5 line-clamp-2">
                    Language: {env.language} • Templates &amp; test suites included.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
