import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function JobsHeader({ activeTab, setActiveTab, showFilters, setShowFilters }) {
  const tabs = [
    { id: 'all', label: 'All Jobs' },
    { id: 'saved', label: 'Saved Jobs' },
    { id: 'applied', label: 'Applied Jobs' },
  ];

  return (
    <div className="space-y-4 mb-5">
      {/* Title and Subtitle */}
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Jobs
        </h1>
        <p className="text-sm sm:text-base text-purple-200/70 font-normal mt-1.5">
          Explore jobs that match your skills and preferences.
        </p>
      </div>

      {/* Tabs and Filters Toggle Row */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1 pt-2">
        <div className="flex items-center gap-6 relative">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  isActive ? 'text-white font-semibold' : 'text-white/60 hover:text-white/80'
                }`}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-[#a855f7] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            showFilters
              ? 'bg-[#1e142e] border-[#6C4F91] text-white'
              : 'bg-[#110e17] border-white/10 text-white/80 hover:border-white/20 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-white/70" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
}
