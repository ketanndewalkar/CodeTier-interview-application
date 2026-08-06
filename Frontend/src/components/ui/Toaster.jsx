import toast from 'react-hot-toast';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
} from 'lucide-react';

export const Toaster = (message, status = 'info') => {
  const variants = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
      bg: 'bg-[#14101B]/95',
      text: 'text-emerald-200/90',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_8px_30px_rgb(16,185,129,0.15)]',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badgeText: 'Success',
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      bg: 'bg-[#14101B]/95',
      text: 'text-rose-200/90',
      border: 'border-rose-500/30',
      glow: 'shadow-[0_8px_30px_rgb(244,63,94,0.15)]',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      badgeText: 'Error',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      bg: 'bg-[#14101B]/95',
      text: 'text-amber-200/90',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_8px_30px_rgb(245,158,11,0.15)]',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      badgeText: 'Notice',
    },
    info: {
      icon: <Info className="w-5 h-5 text-[#c084fc] shrink-0" />,
      bg: 'bg-[#14101B]/95',
      text: 'text-purple-200/90',
      border: 'border-[#7C3AED]/40',
      glow: 'shadow-[0_8px_30px_rgb(124,58,237,0.2)]',
      badgeBg: 'bg-purple-500/10 text-[#c084fc] border-purple-500/20',
      badgeText: 'Info',
    },
  };

  const current = variants[status] || variants.info;

  toast.custom(
    (t) => (
      <div
        role="alert"
        aria-live="assertive"
        className={`
          pointer-events-auto
          w-[400px]
          max-w-[calc(100vw-2rem)]
          rounded-2xl
          border
          p-4
          backdrop-blur-xl
          transition-all
          duration-300
          flex items-center justify-between gap-3.5
          text-sm
          font-medium
          leading-relaxed
          ${current.bg}
          ${current.border}
          ${current.glow}
          ${t.visible ? 'animate-in fade-in slide-in-from-bottom-5 duration-300' : 'animate-out fade-out duration-200'}
        `}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 shrink-0 flex items-center justify-center">
            {current.icon}
          </div>

          <div className="space-y-0.5 min-w-0">
            <p className="text-white font-semibold text-xs sm:text-sm truncate leading-snug">
              {message}
            </p>
          </div>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className="p-1 rounded-lg text-purple-200/50 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          aria-label="Close Notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ),
    {
      duration: 4000,
      position: 'bottom-right',
    }
  );
};
