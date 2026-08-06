import React from 'react';
import { Send, X, Loader2 } from 'lucide-react';

export default function SubmitActions({ onSubmit, onCancel, isSubmitting = false, disabled = false }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-white/10">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <X className="w-4 h-4 text-zinc-400" />
        <span>Cancel</span>
      </button>

      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting || disabled}
        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6C4F91] hover:bg-[#7C3AED] active:bg-[#5B3E81] text-white font-semibold text-xs sm:text-sm transition-all shadow-md border border-purple-500/30 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span>Submit Application</span>
            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>
    </div>
  );
}
