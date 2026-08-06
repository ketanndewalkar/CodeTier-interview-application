import { useState } from 'react';
import ApplicationForm from '../applicationForm/ApplicationForm';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Home,
  FileText,
  Code2,
  Building2,
  Calendar,
  Clock,
  TrendingUp,
  BookOpen,
  Trophy,
  Activity,
  Star,
  ChevronRight,
} from 'lucide-react';
import orgPlaceholder from '../../../assets/images/org-placeholder.png';

export default function JobDetails({ job, onBack }) {
  const [isSaved, setIsSaved] = useState(job?.isSaved || false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Format compensation for display
  const compensationLabel = (() => {
    const c = job?.compensation;
    if (!c || c.amount == null) return 'Competitive';
    const sym = c.currency === 'INR' ? '₹' : c.currency === 'USD' ? '$' : c.currency;
    const period = c.period === 'MONTHLY' ? '/mo' : c.period === 'ANNUALLY' ? '/yr' : ' lump sum';
    return `${sym}${c.amount.toLocaleString()}${period}`;
  })();

  const compensationTypeLabel = job?.compensation?.type || 'SALARY';

  const applyByDate = job?.applicationDeadline
    ? new Date(job.applicationDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';

  const appStartDate = job?.applicationStartDate
    ? new Date(job.applicationStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';

  return (
    <div className="space-y-6 pb-12 text-white">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-white/60">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Jobs</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-white/30" />
        <span className="text-white font-semibold">Job Details</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-[#0e0c15] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Logo Box */}
            <div className="w-20 h-20 rounded-2xl bg-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-xl border border-white/10 p-2.5 select-none">
              <img src={orgPlaceholder} alt="Organization Logo" className="w-full h-full object-contain" />
            </div>

            {/* Title, Badge & Company */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="bg-[#2e1d4d] border border-[#6C4F91]/80 text-[#c084fc] text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  OPEN
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                {job?.title || 'Full Stack Developer'}
              </h1>

              <div className="flex items-center gap-1.5 text-sm text-purple-200/90 font-medium">
                <span>{job?.company || 'BajuGali Influencer'}</span>
                <CheckCircle2 className="w-4 h-4 text-white fill-[#a855f7] inline-block shrink-0" />
              </div>

              <div className="flex items-center gap-2 text-sm text-purple-200/70 pt-1 font-normal">
                <Home className="w-4 h-4 text-purple-200/60 shrink-0" />
                <span>{job?.interviewMode || 'ONLINE'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-3 bg-[#181322] border border-white/10 hover:border-white/20 rounded-xl text-white/70 hover:text-white transition-colors cursor-pointer"
              title={isSaved ? 'Saved' : 'Save Job'}
            >
              <Bookmark
                className={`w-5 h-5 ${isSaved ? 'text-[#a855f7] fill-[#a855f7]' : ''}`}
              />
            </button>

            {job?.isApplied ? (
              <button
                disabled
                className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 px-7 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg cursor-default flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Applied</span>
              </button>
            ) : (
              <button
                onClick={() => setShowApplyModal(true)}
                className="bg-[#6C4F91] hover:bg-[#8B5CF6] active:bg-[#5B3E81] text-white px-7 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#6C4F91]/20 cursor-pointer"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-purple-200/60 uppercase mb-1">
              EXPERIENCE LEVEL
            </div>
            <div className="text-sm font-semibold text-white font-mono tabular-nums">
              {job?.experienceLevel || 'Junior Level'}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold tracking-wider text-purple-200/60 uppercase mb-1">
              EMPLOYMENT TYPE
            </div>
            <div className="text-sm font-semibold text-white">
              {job?.availabilityType?.replace('_', ' ') || 'FULL TIME'}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold tracking-wider text-purple-200/60 uppercase mb-1">
              DURATION
            </div>
            <div className="text-sm font-semibold text-white font-mono tabular-nums">
              {job?.duration || '2 Months'}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold tracking-wider text-purple-200/60 uppercase mb-1">
              {compensationTypeLabel}
            </div>
            <div className="text-sm font-semibold text-white font-mono tabular-nums">
              {compensationLabel}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold tracking-wider text-purple-200/60 uppercase mb-1">
              APPLY BY
            </div>
            <div className="text-sm font-semibold text-white font-mono tabular-nums">
              {applyByDate}
            </div>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex items-center gap-3 pt-2">
          <span className="border border-[#a855f7] bg-[#201235] text-[#c084fc] px-4 py-1.5 rounded-full text-xs font-semibold">
            {job?.availabilityType?.replace('_', ' ') || 'FULL TIME'}
          </span>
          <span className="border border-[#a855f7]/50 bg-[#201235]/60 text-[#c084fc]/80 px-4 py-1.5 rounded-full text-xs font-semibold">
            {job?.interviewMode || 'ONLINE'}
          </span>
        </div>
      </div>

      {/* Content Layout: Left 2/3 and Right 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Main Details Column */}
        <div className="lg:col-span-8 bg-[#0e0c15] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
          {/* Job Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#251a38] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#a855f7]" />
              </div>
              <h2 className="text-base font-bold text-[#c084fc]">Job Description</h2>
            </div>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal pl-11">
              {job?.description || 'No description provided.'}
            </p>
          </div>

          <div className="border-t border-white/10" />

          {/* Required Skills */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#251a38] flex items-center justify-center shrink-0">
                <Code2 className="w-4 h-4 text-[#a855f7]" />
              </div>
              <h2 className="text-base font-bold text-[#c084fc]">Required Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2.5 pl-11">
              {(job?.requiredSkills ?? []).map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-[#181322] border border-white/10 text-white/80 text-xs px-3.5 py-1.5 rounded-xl font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>


        </div>

        {/* Right Info Cards Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Important Dates */}
          <div className="bg-[#0e0c15] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#251a38] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-[#a855f7]" />
              </div>
              <h3 className="text-sm font-bold text-[#c084fc]">Important Dates</h3>
            </div>

              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <div className="text-white/50 mb-0.5">Application Start Date</div>
                  <div className="text-white font-medium">{appStartDate}</div>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <div className="text-white/50 mb-0.5">Application Deadline</div>
                  <div className="text-white font-medium">
                    {applyByDate}
                  </div>
                </div>
              </div>
          </div>

          {/* Interview Details */}
          <div className="bg-[#0e0c15] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#251a38] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#a855f7]" />
              </div>
              <h3 className="text-sm font-bold text-[#c084fc]">Interview Details</h3>
            </div>

              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <div className="text-white/50 mb-0.5">Interview Mode</div>
                  <div className="text-white font-medium">{job?.interviewMode || 'ONLINE'}</div>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <div className="text-white/50 mb-0.5">Interview Duration</div>
                  <div className="text-white font-medium">
                    {job?.interviewConfig?.duration ? `${job.interviewConfig.duration} Minutes` : 'N/A'}
                  </div>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <div className="text-white/50 mb-0.5">Buffer Time</div>
                  <div className="text-white font-medium">
                    {job?.interviewConfig?.bufferTime ? `${job.interviewConfig.bufferTime} Minutes` : 'N/A'}
                  </div>
                </div>
              </div>
          </div>

          {/* Job Status */}
          <div className="bg-[#0e0c15] border border-white/10 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#251a38] flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-[#a855f7]" />
              </div>
              <h3 className="text-sm font-bold text-[#c084fc]">Job Status</h3>
            </div>

            <div className="pt-1">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-3 py-1 rounded-md text-[10px] uppercase tracking-wider inline-block mb-2">
                OPEN
              </span>
              <p className="text-xs text-white/60">Applications are currently open.</p>
            </div>
          </div>
        </div>
      </div>



      {/* Application Form Modal */}
      {showApplyModal && (
        <ApplicationForm
          job={job}
          isModal={true}
          onCancel={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
          }}
        />
      )}
    </div>
  );
}
