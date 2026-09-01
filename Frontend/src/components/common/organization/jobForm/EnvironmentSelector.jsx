import React, { useEffect } from 'react';
import { Code2, Layout, Terminal, Cpu, Check, Server, Loader2, AlertCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
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
  const { environments = [], isLoading, isError } = useEnvironments();

  // Auto-select React environment if no selection exists or if currently selected environment is not React
  useEffect(() => {
    if (!isLoading && environments.length > 0) {
      const reactEnv = environments.find((e) => e.language?.toUpperCase() === 'REACT');
      const currentSelectedEnv = environments.find((e) => e._id === value);

      if (reactEnv && (!value || (currentSelectedEnv && currentSelectedEnv.language?.toUpperCase() !== 'REACT'))) {
        onChange(reactEnv._id);
      }
    }
  }, [environments, isLoading, value, onChange]);

  const getIcon = (lang) => {
    return ICON_MAP[lang?.toUpperCase()] || Code2;
  };

  const handleSelect = (env) => {
    const isReact = env.language?.toUpperCase() === 'REACT';
    if (!isReact) {
      toast.error(`The ${env.name || env.language} environment is currently under development (In Progress). Only the React environment is currently available.`, {
        id: 'env-in-progress-toast',
      });
      return;
    }
    onChange(env._id);
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
            const isAvailable = env.language?.toUpperCase() === 'REACT';

            return (
              <div
                key={env._id}
                onClick={() => handleSelect(env)}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 relative overflow-hidden ${
                  !isAvailable
                    ? 'bg-[#14101d]/60 border-white/5 opacity-50 cursor-not-allowed select-none'
                    : isSelected
                    ? 'bg-[#271842] border-[#6C4F91] ring-1 ring-[#6C4F91] cursor-pointer'
                    : 'bg-[#181424] border-white/10 hover:border-white/20 hover:bg-[#1f1a30] cursor-pointer'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isSelected && isAvailable ? 'bg-[#6C4F91] text-white' : 'bg-white/5 text-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{env.name}</h4>
                    {isSelected && isAvailable && (
                      <div className="w-4 h-4 rounded-full bg-[#6C4F91] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                    {!isAvailable && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed mt-0.5 line-clamp-2">
                    {isAvailable
                      ? `Language: ${env.language} • Full sandbox, live preview & templates ready.`
                      : `Language: ${env.language} • Environment setup in progress (Coming Soon).`}
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

