import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { filterOptions } from '../../data/jobsData';

export default function JobFilters({ onClearAll }) {
  const [openFilter, setOpenFilter] = useState(null);

  const toggleDropdown = (id) => {
    setOpenFilter(openFilter === id ? null : id);
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-6">
      {filterOptions.map((filter) => (
        <div key={filter.id} className="relative">
          <button
            onClick={() => toggleDropdown(filter.id)}
            className="flex items-center gap-2 bg-[#110e17] border border-white/10 hover:border-white/20 rounded-xl px-3.5 py-2 text-xs font-medium text-white/80 transition-colors cursor-pointer"
          >
            <span>{filter.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>
      ))}

      <button
        onClick={onClearAll}
        className="text-xs font-semibold text-[#c084fc] hover:text-[#d8b4fe] transition-colors px-2 py-1 cursor-pointer"
      >
        Clear All
      </button>
    </div>
  );
}
