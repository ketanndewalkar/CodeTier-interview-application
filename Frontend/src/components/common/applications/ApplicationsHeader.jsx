import { Filter } from 'lucide-react';

export default function ApplicationsHeader({
  activeFilter = 'All',
  setActiveFilter,
  counts = { all: 12, applied: 8, shortlisted: 2, interviewing: 1, rejected: 1 },
  onToggleFilters,
  showFilters,
}) {
  const filterTabs = [
    { id: 'All', label: 'All', count: counts.all },
    { id: 'Applied', label: 'Applied', count: counts.applied },
    { id: 'Shortlisted', label: 'Shortlisted', count: counts.shortlisted },
    { id: 'Interviewing', label: 'Interviewing', count: counts.interviewing },
    { id: 'Rejected', label: 'Rejected', count: counts.rejected },
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Applications
        </h1>
        <p className="text-sm sm:text-base text-purple-200/70 font-normal mt-1.5">
          Track and manage your job applications.
        </p>
      </div>

      {/* Filter Tabs & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Pills / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter && setActiveFilter(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#5B3E81] text-white shadow-lg border border-[#7C3AED]/40'
                    : 'bg-[#14101B] text-purple-200/70 hover:text-white border border-white/5 hover:border-white/10'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${
                    isActive
                      ? 'bg-[#3d275b] text-purple-200'
                      : 'bg-white/10 text-purple-200/60'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters Action Button */}
        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all shrink-0 cursor-pointer ${
            showFilters
              ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-md'
              : 'bg-[#14101B] border-white/10 text-purple-200/80 hover:text-white hover:border-white/20'
          }`}
        >
          <Filter className="w-4 h-4 text-purple-200/80" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
}
