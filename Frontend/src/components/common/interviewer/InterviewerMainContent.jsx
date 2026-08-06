import React from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Code, 
  Users, 
  Star, 
  MoreVertical,
  ChevronRight,
  Coffee
} from 'lucide-react';
import { useUserStore } from '../../../store/userStore';
import { useInterviewerInterviews } from '../../../pages/interviewer/hooks/useInterviewer';

export default function InterviewerMainContent({ onSelectInterview, onSelectFeedback, onActionClick }) {
  const user = useUserStore((state) => state.user);
  const firstName = user?.name ? user.name.split(' ')[0] : 'Interviewer';
  const { interviews: apiInterviews, isLoading } = useInterviewerInterviews();

  // Transform backend API interviews if available
  const transformedBackendInterviews = (apiInterviews || []).map((item) => {
    const candidateName = item.candidateId?.name || item.candidate?.name || 'Candidate';
    const company = item.organizationId?.name || item.candidate?.company || 'CodeTier';
    const initials = candidateName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const startDate = item.startTime ? new Date(item.startTime) : null;
    const formattedDate = startDate
      ? startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'TBD';

    const formattedTime = startDate
      ? startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : 'TBD';

    return {
      id: item._id || item.id,
      initials,
      avatarBg: 'bg-[#5b21b6]',
      candidateName,
      company,
      role: item.applicationId?.jobOpeningId?.title || item.jobRole || 'Software Engineer',
      date: formattedDate,
      time: formattedTime,
      type: 'Technical',
      typeIcon: Code,
      status: item.status || 'SCHEDULED',
      rating: item.scoringSnapshot?.totalScore || 4.5,
    };
  });

  const hasApiData = transformedBackendInterviews.length > 0;

  // Mock data for upcoming interviews fallback
  const mockUpcoming = [
    {
      id: 'up-1',
      initials: 'AS',
      avatarBg: 'bg-[#5b21b6]',
      candidateName: 'Anjali Sharma',
      company: 'Netron Solutions',
      role: 'UI/UX Designer',
      date: '21 Nov 2024',
      time: '10:00 AM IST',
      type: 'Technical',
      typeIcon: Code,
      status: 'UPCOMING',
    },
    {
      id: 'up-2',
      initials: 'PK',
      avatarBg: 'bg-[#7c3aed]',
      candidateName: 'Priya Kapoor',
      company: 'Innovision',
      role: 'Full Stack Developer',
      date: '21 Nov 2024',
      time: '02:00 PM IST',
      type: 'HR Round',
      typeIcon: Users,
      status: 'UPCOMING',
    },
    {
      id: 'up-3',
      initials: 'VK',
      avatarBg: 'bg-[#4c1d95]',
      candidateName: 'Vikram Kumar',
      company: 'CodeNext',
      role: 'Software Engineer',
      date: '22 Nov 2024',
      time: '11:00 AM IST',
      type: 'Technical',
      typeIcon: Code,
      status: 'UPCOMING',
    },
  ];

  // Mock data for completed interviews fallback
  const mockCompleted = [
    {
      id: 'comp-1',
      initials: 'SM',
      avatarBg: 'bg-[#4338ca]',
      candidateName: 'Sagar Mehta',
      company: 'TechCorp',
      role: 'Backend Developer',
      date: '19 Nov 2024',
      time: '11:30 AM IST',
      type: 'Technical',
      typeIcon: Code,
      rating: 4.5,
    },
    {
      id: 'comp-2',
      initials: 'RP',
      avatarBg: 'bg-[#6d28d9]',
      candidateName: 'Rahul Pandey',
      company: 'AppBuild Labs',
      role: 'Mobile Developer',
      date: '18 Nov 2024',
      time: '04:00 PM IST',
      type: 'Technical',
      typeIcon: Code,
      rating: 5.0,
    },
  ];

  const upcomingInterviews = apiInterviews
    ? transformedBackendInterviews.filter((i) => ['SCHEDULED', 'IN_PROGRESS', 'UPCOMING'].includes(i.status))
    : [];

  const completedInterviews = apiInterviews
    ? transformedBackendInterviews.filter((i) => i.status === 'COMPLETED')
    : [];

  // Filter to only include today's interviews
  const todayInterviews = (apiInterviews || []).filter(item => {
    if (!item.startTime) return false;
    const d = new Date(item.startTime);
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  });

  // Build today's schedule from API if available
  const todayScheduleFromApi = todayInterviews.map((item) => ({
    time: item.startTime ? new Date(item.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
    name: item.candidateId?.name || item.candidate?.name || 'Candidate',
    role: item.applicationId?.jobOpeningId?.title || item.jobRole || 'Software Engineer',
    status: item.status === 'SCHEDULED' ? 'Upcoming' : item.status,
    badgeColor: 'bg-[#2a1d3f] text-[#c084fc] border-[#7c3aed]/40',
    icon: null,
  }));

  // Today's schedule mock items fallback
  const mockSchedule = [
    {
      time: '10:00 AM',
      name: 'Anjali Sharma',
      role: 'UI/UX Designer',
      status: 'Upcoming',
      badgeColor: 'bg-[#2a1d3f] text-[#c084fc] border-[#7c3aed]/40',
      icon: null,
    },
    {
      time: '02:00 PM',
      name: 'Priya Kapoor',
      role: 'Full Stack Developer',
      status: 'Upcoming',
      badgeColor: 'bg-[#2a1d3f] text-[#c084fc] border-[#7c3aed]/40',
      icon: null,
    },
    {
      time: '04:30 PM',
      name: 'Interview Break',
      role: '30 mins break',
      status: null,
      icon: Coffee,
    },
    {
      time: '05:00 PM',
      name: 'Team Sync',
      role: 'Daily standup meeting',
      status: null,
      icon: Users,
    },
  ];

  const todaySchedule = hasApiData ? todayScheduleFromApi : mockSchedule;

  const totalCount = apiInterviews ? transformedBackendInterviews.length : 0;
  const completedCount = apiInterviews ? completedInterviews.length : 0;
  const upcomingCount = apiInterviews ? upcomingInterviews.length : 0;
  const cancelledCount = apiInterviews ? transformedBackendInterviews.filter((i) => i.status === 'CANCELLED').length : 0;


  return (
    <div className="flex-1 space-y-6">
      {/* Welcome Banner */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="text-xs text-purple-200/70 font-normal mt-1">
          Here's what's happening with your interviews today.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Interviews */}
        <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 flex items-start justify-between shadow-xl relative overflow-hidden group hover:border-[#7C3AED]/40 transition-all">
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-purple-200/60 uppercase tracking-wider block">Total Interviews</span>
            <div className="text-3xl font-bold text-white font-mono tabular-nums tracking-tight">{totalCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#221634] border border-[#7C3AED]/30 flex items-center justify-center shrink-0 shadow-inner text-[#eedcff]">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Completed */}
        <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 flex items-start justify-between shadow-xl relative overflow-hidden group hover:border-[#7C3AED]/40 transition-all">
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-purple-200/60 uppercase tracking-wider block">Completed</span>
            <div className="text-3xl font-bold text-white font-mono tabular-nums tracking-tight">{completedCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Upcoming */}
        <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 flex items-start justify-between shadow-xl relative overflow-hidden group hover:border-[#7C3AED]/40 transition-all">
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-purple-200/60 uppercase tracking-wider block">Upcoming</span>
            <div className="text-3xl font-bold text-white font-mono tabular-nums tracking-tight">{upcomingCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Cancelled */}
        <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 flex items-start justify-between shadow-xl relative overflow-hidden group hover:border-[#7C3AED]/40 transition-all">
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-purple-200/60 uppercase tracking-wider block">Cancelled</span>
            <div className="text-3xl font-bold text-white font-mono tabular-nums tracking-tight">{cancelledCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-inner text-rose-400">

            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two Column Layout for Tables + Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tables (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Upcoming Interviews Table Card */}
          <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#a855f7]" />
                <h2 className="text-sm font-bold text-white tracking-tight">Upcoming Interviews</h2>
              </div>
              <button className="text-[11px] font-semibold text-[#a855f7] hover:text-[#c084fc] transition-colors cursor-pointer">
                View all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    <th className="py-3 px-3">Candidate</th>
                    <th className="py-3 px-3">Job Role</th>
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {upcomingInterviews.map((item) => {
                    const TypeIcon = item.typeIcon;
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        {/* Candidate */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${item.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                              {item.initials}
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-[#a855f7] transition-colors">
                                {item.candidateName}
                              </div>
                              <div className="text-[10px] text-white/40">{item.company}</div>
                            </div>
                          </div>
                        </td>

                        {/* Job Role */}
                        <td className="py-3.5 px-3 font-medium text-white/80">
                          {item.role}
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-white">{item.date}</div>
                          <div className="text-[10px] text-white/50 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-white/40" />
                            <span>{item.time}</span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-3.5 px-3">
                          <div className="inline-flex items-center gap-1.5 text-white/70">
                            <TypeIcon className="w-3.5 h-3.5 text-[#a855f7]" />
                            <span>{item.type}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2a1d3f] border border-[#7c3aed]/40 text-[#c084fc] uppercase tracking-wider">
                            {item.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => onSelectInterview && onSelectInterview(item)}
                              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-semibold text-white transition-all cursor-pointer"
                            >
                              View Details
                            </button>
                            <button className="p-1.5 text-white/40 hover:text-white transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Completed Interviews Table Card */}
          <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white tracking-tight">Recent Completed Interviews</h2>
              </div>
              <button className="text-[11px] font-semibold text-[#a855f7] hover:text-[#c084fc] transition-colors cursor-pointer">
                View all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    <th className="py-3 px-3">Candidate</th>
                    <th className="py-3 px-3">Job Role</th>
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Feedback</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {completedInterviews.map((item) => {
                    const TypeIcon = item.typeIcon;
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        {/* Candidate */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${item.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                              {item.initials}
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                                {item.candidateName}
                              </div>
                              <div className="text-[10px] text-white/40">{item.company}</div>
                            </div>
                          </div>
                        </td>

                        {/* Job Role */}
                        <td className="py-3.5 px-3 font-medium text-white/80">
                          {item.role}
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-white">{item.date}</div>
                          <div className="text-[10px] text-white/50 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-white/40" />
                            <span>{item.time}</span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-3.5 px-3">
                          <div className="inline-flex items-center gap-1.5 text-white/70">
                            <TypeIcon className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{item.type}</span>
                          </div>
                        </td>

                        {/* Rating / Feedback */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5 text-emerald-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= Math.floor(item.rating)
                                      ? 'fill-emerald-400 text-emerald-400'
                                      : 'text-white/20'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-mono text-xs font-bold text-white">{item.rating.toFixed(1)}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => onSelectFeedback && onSelectFeedback(item)}
                              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-semibold text-white transition-all cursor-pointer"
                            >
                              View Feedback
                            </button>
                            <button className="p-1.5 text-white/40 hover:text-white transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Schedule Card (col-span-4) */}
        <div className="lg:col-span-4">
          <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white tracking-tight">Today's Schedule</h3>
              <button 
                onClick={() => onActionClick && onActionClick('view_calendar')}
                className="text-[11px] font-semibold text-[#a855f7] hover:text-[#c084fc] transition-colors cursor-pointer"
              >
                View calendar
              </button>
            </div>

            <div className="space-y-3.5">
              {todaySchedule.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div key={idx} className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors animate-fade-in">
                    <div className="flex items-start gap-3">
                      <span className="text-[11px] font-mono text-white/50 w-16 shrink-0 pt-0.5">
                        {item.time}
                      </span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white leading-tight">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-white/50 mt-0.5">
                          {item.role}
                        </div>
                      </div>
                    </div>

                    {item.status ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                        {item.status}
                      </span>
                    ) : ItemIcon ? (
                      <ItemIcon className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                    ) : null}
                  </div>
                );
              })}

              {todaySchedule.length === 0 && (
                <div className="p-4 text-center bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white/40">
                  No interviews scheduled for today.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
