import React from 'react';
import { Sparkles } from 'lucide-react';

export default function FormActions({ onCancel, isSubmitting = false }) {
  return (
    <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2.5 rounded-xl bg-[#6C4F91] hover:bg-[#5b3f7f] text-white text-xs font-bold transition-all shadow-lg shadow-[#6C4F91]/25 cursor-pointer flex items-center gap-2 disabled:opacity-50"
      >
        <Sparkles className="w-4 h-4" />
        <span>{isSubmitting ? 'Creating...' : 'Create Job Opening'}</span>
      </button>
    </div>
  );
}
