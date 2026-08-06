import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function JobPagination({ currentPage = 1, totalPages = 13, onPageChange }) {
  const pages = [1, 2, 3, 4, 5, '...', 13];

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        className="w-8 h-8 rounded-xl bg-[#110e17] border border-white/10 hover:border-white/20 text-white/60 hover:text-white flex items-center justify-center text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span key={idx} className="w-8 h-8 flex items-center justify-center text-xs font-mono text-white/40">
              ...
            </span>
          );
        }

        const isActive = p === currentPage;
        return (
          <button
            key={idx}
            onClick={() => onPageChange && onPageChange(p)}
            className={`w-8 h-8 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30 border border-[#8B5CF6]'
                : 'bg-[#110e17] border border-white/10 text-white/70 hover:text-white hover:border-white/20'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        className="w-8 h-8 rounded-xl bg-[#110e17] border border-white/10 hover:border-white/20 text-white/60 hover:text-white flex items-center justify-center text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
