import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const EXP_LABELS = {
  FRESHER:    'Fresher',
  JUNIOR:     'Junior',
  MID_LEVEL:  'Mid-Level',
  SENIOR:     'Senior',
  LEAD:       'Lead',
  PRINCIPAL:  'Principal',
};

const STATUS_STYLE = {
  OPEN:   'text-[#6ee7b7] bg-[#10b981]/15 border border-[#10b981]/30',
  CLOSED: 'text-[#fca5a5] bg-[#ef4444]/15 border border-[#ef4444]/30',
  PAUSED: 'text-[#fde68a] bg-[#d97706]/15 border border-[#d97706]/30',
};

function RowSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="space-y-2 animate-pulse py-3 border-b border-white/5 last:border-0">
      <div className="flex justify-between">
        <div className="h-3 w-36 bg-white/5 rounded-full" />
        <div className="h-5 w-14 bg-white/5 rounded-full" />
      </div>
      <div className="h-2.5 w-24 bg-white/5 rounded-full" />
    </div>
  ));
}

/**
 * @param {{ jobs: Job[], isLoading: boolean }} props
 */
export default function JobMatches({ jobs = [], isLoading }) {
  const navigate = useNavigate();
  const displayJobs = jobs.slice(0, 5);

  return (
    <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
          Open Positions
        </h3>
        <button
          onClick={() => navigate('/dashboard/jobs')}
          className="flex items-center gap-1 text-xs font-medium text-purple-200/80 hover:text-white px-3.5 py-1.5 rounded-xl bg-[#181322] border border-white/10 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 text-purple-200/50" />
        </button>
      </div>

      {/* Column Headers */}
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-purple-200/50 pb-2 border-b border-white/10">
        <span>Job Position</span>
        <span>Status</span>
      </div>

      {/* Rows */}
      <div className="space-y-1 pt-1">
        {isLoading ? (
          <RowSkeleton />
        ) : displayJobs.length === 0 ? (
          <p className="text-center text-purple-200/40 text-sm py-6">No open positions right now.</p>
        ) : (
          displayJobs.map((job) => (
            <div
              key={job._id}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] rounded-lg px-1 transition-colors cursor-pointer"
              onClick={() => navigate('/dashboard/jobs')}
            >
              <div className="space-y-0.5 min-w-0 pr-3">
                <div className="text-xs font-semibold text-white truncate">{job.title}</div>
                <div className="text-[11px] text-purple-200/50 font-mono">
                  {EXP_LABELS[job.experience] ?? job.experience}
                  {job.requiredSkills?.length > 0 && ` · ${job.requiredSkills.slice(0, 2).join(', ')}`}
                </div>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[job.status] ?? ''}`}
              >
                {job.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
