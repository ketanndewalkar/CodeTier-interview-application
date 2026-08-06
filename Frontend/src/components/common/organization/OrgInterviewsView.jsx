import React from 'react';
import { Video, Calendar, Plus, Clock, User, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOrganizationInterviews } from '../../../pages/organization/hooks/useOrganization';

export default function OrgInterviewsView() {
  const { interviews: apiInterviews, isLoading, isError } = useOrganizationInterviews();

  const interviews = (apiInterviews ?? []).map((item) => ({
    id: item._id,
    candidateName:
      item.applicationId?.candidateId?.name ||
      item.candidateId?.name ||
      'Candidate',
    role: item.applicationId?.jobOpeningId?.title || 'Software Engineer',
    interviewer: item.interviewerId?.name || 'Assigned Interviewer',
    time: item.startTime
      ? new Date(item.startTime).toLocaleString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'TBD',
    status: item.interviewStatus || 'SCHEDULED',
    roomId: item.roomId,
  }));

  const todayCount = interviews.filter((i) => {
    if (!i.time || i.time === 'TBD') return false;
    const d = new Date(i.time);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Scheduled Interviews</h1>
          <p className="text-xs text-white/50 mt-1">
            Live video interview rooms, logs, and scheduled sessions.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#110e17] border border-white/10 rounded-2xl">
          <div className="text-xs text-white/50">Today's Sessions</div>
          <div className="text-xl font-bold text-white mt-1">
            {isLoading ? '—' : `${todayCount} Upcoming`}
          </div>
        </div>
        <div className="p-4 bg-[#110e17] border border-white/10 rounded-2xl">
          <div className="text-xs text-white/50">Total Sessions</div>
          <div className="text-xl font-bold text-[#c084fc] mt-1">
            {isLoading ? '—' : `${interviews.length} Sessions`}
          </div>
        </div>
        <div className="p-4 bg-[#110e17] border border-white/10 rounded-2xl">
          <div className="text-xs text-white/50">Status</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {isError ? 'Error' : isLoading ? 'Loading…' : 'Live'}
          </div>
        </div>
      </div>

      {/* Interview list */}
      <div className="bg-[#110e17] border border-white/10 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight">All Interviews</h3>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#c084fc] animate-spin" />
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 text-rose-400 text-sm py-6 justify-center">
            <AlertCircle className="w-4 h-4" />
            <span>Failed to load interviews.</span>
          </div>
        )}

        {!isLoading && !isError && interviews.length === 0 && (
          <div className="py-12 text-center">
            <Calendar className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No interviews scheduled yet.</p>
          </div>
        )}

        <div className="space-y-3">
          {interviews.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#5b21b6] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {item.candidateName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-[#c084fc] transition-colors">
                    {item.candidateName}
                  </div>
                  <div className="text-xs text-white/50">{item.role}</div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                <div className="text-left sm:text-right">
                  <div className="text-xs font-bold text-white">{item.status}</div>
                  <div className="text-[10px] text-white/40 font-mono">{item.time}</div>
                </div>

                <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-white/40" />
                    <span className="text-xs font-semibold text-white/80 hidden sm:inline">
                      {item.interviewer}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      item.roomId
                        ? toast.success(`Launching room ${item.roomId}`)
                        : toast('Interview room not ready yet')
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6C4F91] hover:bg-[#5b3f7f] text-white text-[11px] font-bold transition-all shadow-md shadow-[#6C4F91]/20 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Room</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
