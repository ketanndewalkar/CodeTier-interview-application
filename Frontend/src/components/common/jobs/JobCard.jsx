import {
  CheckCircle2,
  Home,
  Calendar,
  Clock,
  IndianRupee,
  ChevronRight,
} from 'lucide-react';
import orgPlaceholder from '../../../assets/images/org-placeholder.png';

export default function JobCard({ job, onViewDetails, onApply }) {
  const applyByDate = job.applicationDeadline
    ? new Date(job.applicationDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';

  const startDate = job.applicationStartDate
    ? new Date(job.applicationStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Immediate';

  // Format compensation for display
  const compensationLabel = (() => {
    const c = job.compensation;
    if (!c || c.amount == null) return 'Competitive';
    const sym = c.currency === 'INR' ? '₹' : c.currency === 'USD' ? '$' : c.currency;
    const period = c.period === 'MONTHLY' ? '/mo' : c.period === 'ANNUALLY' ? '/yr' : ' lump sum';
    return `${sym}${c.amount.toLocaleString()}${period}`;
  })();

  const compensationTypeLabel = job.compensation?.type || 'SALARY';

  return (
    <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-white/30 via-white/10 to-purple-500/30 shadow-[0_8px_32px_0_rgba(120,60,180,0.15)] transition-all duration-300 group">
      {/* Background Ambient Fluid Glassmorphic Orbs */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-52 h-52 bg-pink-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-40 h-40 bg-amber-300/15 rounded-full blur-2xl pointer-events-none" />

      {/* Glass Panel */}
      <div className="relative bg-[#120d20]/70 backdrop-blur-xl rounded-[23px] p-5 sm:p-6 text-white border border-white/15 transition-all duration-300">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Logo Box */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-xl border border-white/10 p-2 select-none">
              <img src={orgPlaceholder} alt="Organization Logo" className="w-full h-full object-contain" />
            </div>

            {/* Job Title & Company */}
            <div className="space-y-1">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight">
                {job.title}
              </h2>

              <div className="flex items-center gap-1.5 text-sm text-purple-200/90 font-medium">
                <span>{job.orgId?.name || 'CodeTier'}</span>
                {job.orgId?.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-white fill-[#a855f7] inline-block shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-purple-200/70 pt-1 font-normal">
                <Home className="w-4 h-4 text-purple-200/60 shrink-0" />
                <span>{job.interviewMode || 'ONLINE'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Glass Divider 1 */}
        <div className="border-t border-white/15 my-5" />

        {/* Middle Metrics Grid (4 Columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {/* Experience */}
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-purple-200/60 uppercase flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-200/50" />
              <span>EXPERIENCE</span>
            </div>
            <div className="text-sm font-semibold text-white font-mono tabular-nums">
              {job.experience || 'Not Specified'}
            </div>
          </div>

          {/* Duration */}
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-purple-200/60 uppercase flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-200/50" />
              <span>STATUS</span>
            </div>
            <div className="text-sm font-semibold text-white font-mono tabular-nums">
              {job.status || 'OPEN'}
            </div>
          </div>

          {/* Compensation */}
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-purple-200/60 uppercase flex items-center gap-1.5 mb-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-purple-200/50" />
              <span>{compensationTypeLabel}</span>
            </div>
            <div className="text-sm font-semibold text-white font-mono tabular-nums">
              {compensationLabel}
            </div>
          </div>

          {/* Apply By */}
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-purple-200/60 uppercase flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-200/50" />
              <span>APPLY BY</span>
            </div>
            <div className="text-sm font-semibold text-white font-mono tabular-nums">
              {applyByDate}
            </div>
          </div>
        </div>

        {/* Glass Divider 2 */}
        <div className="border-t border-white/15 my-5" />

        {/* Glass Tags Row */}
        <div className="flex items-center gap-3 flex-wrap">
          {job.requiredSkills?.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="border border-[#c084fc]/60 bg-[#2d1b4e]/80 text-[#e9d5ff] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md shadow-sm">
              {skill}
            </span>
          ))}
          {job.availabilityType && (
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white/90 px-4 py-1.5 rounded-xl text-xs font-medium">
              {job.availabilityType.replace('_', ' ')}
            </span>
          )}
        </div>

        {/* Glass Divider 3 / Footer Bar */}
        <div className="border-t border-white/15 pt-4 mt-5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-white/70">
            <Calendar className="w-4 h-4 text-white/70" />
            <span>
              Start Date:{' '}
              <strong className="text-white font-semibold">{startDate}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {job.isApplied ? (
              <button
                disabled
                className="text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-2 rounded-xl font-semibold text-xs transition-all shadow-md cursor-default flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Applied</span>
              </button>
            ) : (
              <button
                onClick={() => onApply && onApply(job)}
                className="text-white bg-[#5B3E81] hover:bg-[#6d499c] border border-[#7C3AED]/50 px-3.5 py-2 rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer"
              >
                Apply Now
              </button>
            )}

            <button
              onClick={() => onViewDetails && onViewDetails(job)}
              className="text-[#d8b4fe] hover:text-white bg-[#6C4F91]/40 hover:bg-[#6C4F91] border border-[#a855f7]/50 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md cursor-pointer"
            >
              <span>Details</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
