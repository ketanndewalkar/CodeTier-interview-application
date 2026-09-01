import { Calendar, Clock, Video, CheckCircle2, ChevronRight } from 'lucide-react';
import { useInterviews } from './hooks/useInterviews';
import { useNavigate } from 'react-router-dom';

function InterviewCard({ interview }) {
  const navigate = useNavigate();
  const dateStr = interview.startTime
    ? new Date(interview.startTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Pending Scheduling';
  const now = new Date();
  const canJoin = interview.startTime && now >= new Date(interview.startTime) && interview.status === 'READY';
  const timeStr = interview.startTime
    ? new Date(interview.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : 'TBD';

  const jobTitle = interview.jobOpeningId?.title || 'Job Interview';
  const company = interview.organizationId?.name || 'CodeTier';
  const status = interview.status || 'SCHEDULED';
  const duration = interview.duration || 60; // fallback to 60 mins

  return (
    <div className="bg-[#120d20]/70 backdrop-blur-xl rounded-[23px] p-5 sm:p-6 text-white border border-white/15 hover:border-[#a855f7]/50 transition-all duration-300 shadow-xl group">
      <div className="flex flex-col md:flex-row gap-5 md:items-center justify-between">

        {/* Left Side: Job & Date */}
        <div className="flex gap-5 items-start">
          {/* Calendar Box */}
          <div className="w-14 h-14 rounded-2xl bg-[#1d172e] border border-white/10 flex flex-col items-center justify-center shrink-0">
            <span className="text-xs text-purple-300/80 font-medium">{interview.startTime ? new Date(interview.startTime).toLocaleDateString('en-GB', { month: 'short' }) : 'TBD'}</span>
            <span className="text-lg font-bold text-white leading-none">{interview.startTime ? new Date(interview.startTime).getDate() : '-'}</span>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-heading text-lg font-bold text-white tracking-tight">{jobTitle}</h3>
            <div className="flex items-center gap-2 text-sm text-purple-200/70 font-medium">
              <span>{company}</span>
              {interview.organizationId?.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-white fill-[#a855f7]" />}
            </div>

            <div className="flex items-center gap-3 pt-1 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-purple-300 bg-purple-900/30 px-2 py-1 rounded-md border border-purple-800/30">
                <Clock className="w-3 h-3" />
                <span>{timeStr}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300 bg-emerald-900/30 px-2 py-1 rounded-md border border-emerald-800/30">
                <span>{duration} Mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Status & Action */}
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-semibold tracking-wider text-purple-200 uppercase">
            {status}
          </span>

          <button
            disabled={canJoin}
            onClick={() => navigate(`/interview/${interview._id}`)}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]`}
          >
            <Video className="w-4 h-4" />
            <span>Join Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function InterviewsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-[#120d20]/50 rounded-[23px] border border-white/5" />
      ))}
    </div>
  );
}

export default function InterviewsPage() {
  const { interviews, isLoading, isError, refetch } = useInterviews();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">Your Interviews</h1>
            <p className="text-purple-200/60 text-sm mt-1">Manage and join your scheduled technical interviews.</p>
          </div>

          <div className="flex items-center gap-3 bg-[#181322] border border-white/10 px-4 py-2 rounded-xl text-sm font-medium">
            <span className="text-purple-200/60">Upcoming:</span>
            <span className="text-white font-bold">{interviews?.filter(i => i.status !== 'COMPLETED').length || 0}</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <InterviewsSkeleton />
        ) : isError ? (
          <div className="py-12 text-center text-white/50 bg-[#110e17] border border-white/12 rounded-2xl shadow-xl space-y-3">
            <p>Failed to load interviews.</p>
            <button onClick={refetch} className="text-[#c084fc] text-sm underline cursor-pointer">Retry</button>
          </div>
        ) : interviews.length === 0 ? (
          <div className="py-20 text-center bg-[#110e17] border border-white/12 rounded-2xl shadow-xl flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-purple-900/20 rounded-full flex items-center justify-center mb-4 border border-purple-800/30">
              <Calendar className="w-8 h-8 text-purple-400/80" />
            </div>
            <h3 className="text-white font-semibold text-lg">No Interviews Scheduled</h3>
            <p className="text-purple-200/50 text-sm mt-1 max-w-sm">
              You don't have any upcoming interviews at the moment. Keep applying to find your next role!
            </p>
          </div>
        ) : (
          interviews.map(interview => (
            <InterviewCard key={interview._id} interview={interview} />
          ))
        )}
      </div>
    </div>
  );
}
