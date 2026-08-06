import React, { useState } from 'react';
import { Filter, Calendar, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, Video, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInterviewerInterviews } from '../../../pages/interviewer/hooks/useInterviewer';


export const MOCK_INTERVIEWS_DATA = [
  {
    id: 'INT12345',
    applicationId: 'APP12345',
    jobId: 'JOB12345',
    candidate: {
      name: 'Anjali Sharma',
      initials: 'AS',
      company: 'Netron Solutions',
      email: 'anjali.sharma@email.com',
      phone: '+91 98765 43210',
      experience: '2 - 4 Years',
    },
    jobRole: 'UI/UX Designer',
    date: '21 Nov 2024',
    dateFull: '21 Nov 2024 (Thursday)',
    time: '10:00 AM IST',
    endTime: '11:00 AM IST',
    duration: '60 min',
    durationFull: '60 minutes',
    status: 'SCHEDULED',
    matchScore: '85%',
    createdAt: '18 Nov 2024, 09:15 AM',
    lastUpdated: '18 Nov 2024, 09:15 AM',
    interviewType: 'Technical',
    agenda: 'UI/UX fundamentals, design thinking, wireframing, prototyping and portfolio review. Focus on problem solving approach and design system understanding.',
    mode: 'Online',
    platform: 'Interviewer Hub Platform',
    resourcesCount: 3,
    meetingLink: 'https://interviewerhub.com/meet/INT12345',
    interviewer: {
      name: 'Rohit Patil (You)',
      initials: 'RP',
      email: 'rohit.patil@netronsolutions.com',
      phone: '+91 90909 09090',
    },
    schedulingStatus: 'INTERVIEW SCHEDULED',
    applicationStatus: 'SHORTLISTED',
    timeline: [
      { title: 'Interview Scheduled', date: '18 Nov 2024, 09:15 AM' },
      { title: 'Reminder Sent', date: '19 Nov 2024, 10:00 AM' },
      { title: 'Upcoming Interview', date: '21 Nov 2024, 10:00 AM' },
    ]
  },
  {
    id: 'INT12346',
    applicationId: 'APP12346',
    jobId: 'JOB12346',
    candidate: {
      name: 'Priya Kapoor',
      initials: 'PK',
      company: 'Innovision',
      email: 'priya.kapoor@innovision.io',
      phone: '+91 98123 45678',
      experience: '4 - 6 Years',
    },
    jobRole: 'Full Stack Developer',
    date: '21 Nov 2024',
    dateFull: '21 Nov 2024 (Thursday)',
    time: '02:00 PM IST',
    endTime: '03:00 PM IST',
    duration: '60 min',
    durationFull: '60 minutes',
    status: 'SCHEDULED',
    matchScore: '78%',
    createdAt: '18 Nov 2024, 11:30 AM',
    lastUpdated: '18 Nov 2024, 11:30 AM',
    interviewType: 'Fullstack Architecture',
    agenda: 'Deep dive into React, Node.js microservices, PostgreSQL query optimization, and System Design principles.',
    mode: 'Online',
    platform: 'Interviewer Hub Platform',
    resourcesCount: 2,
    meetingLink: 'https://interviewerhub.com/meet/INT12346',
    interviewer: {
      name: 'Rohit Patil (You)',
      initials: 'RP',
      email: 'rohit.patil@netronsolutions.com',
      phone: '+91 90909 09090',
    },
    schedulingStatus: 'INTERVIEW SCHEDULED',
    applicationStatus: 'SHORTLISTED',
    timeline: [
      { title: 'Interview Scheduled', date: '18 Nov 2024, 11:30 AM' },
      { title: 'Reminder Sent', date: '19 Nov 2024, 02:00 PM' },
      { title: 'Upcoming Interview', date: '21 Nov 2024, 02:00 PM' },
    ]
  },
  {
    id: 'INT12347',
    applicationId: 'APP12347',
    jobId: 'JOB12347',
    candidate: {
      name: 'Vikram Kumar',
      initials: 'VK',
      company: 'CodeNext',
      email: 'vikram.k@codenext.com',
      phone: '+91 97654 32109',
      experience: '3 - 5 Years',
    },
    jobRole: 'Software Engineer',
    date: '22 Nov 2024',
    dateFull: '22 Nov 2024 (Friday)',
    time: '11:00 AM IST',
    endTime: '12:00 PM IST',
    duration: '60 min',
    durationFull: '60 minutes',
    status: 'IN PROGRESS',
    matchScore: '91%',
    createdAt: '19 Nov 2024, 08:00 AM',
    lastUpdated: '22 Nov 2024, 11:00 AM',
    interviewType: 'Live Coding & Data Structures',
    agenda: 'Hands-on live coding challenge covering binary trees, dynamic programming, and clean code principles.',
    mode: 'Online',
    platform: 'Interviewer Hub Platform',
    resourcesCount: 4,
    meetingLink: 'https://interviewerhub.com/meet/INT12347',
    interviewer: {
      name: 'Rohit Patil (You)',
      initials: 'RP',
      email: 'rohit.patil@netronsolutions.com',
      phone: '+91 90909 09090',
    },
    schedulingStatus: 'SESSION IN PROGRESS',
    applicationStatus: 'UNDER EVALUATION',
    timeline: [
      { title: 'Interview Scheduled', date: '19 Nov 2024, 08:00 AM' },
      { title: 'Candidate Joined', date: '22 Nov 2024, 10:58 AM' },
      { title: 'Session Live', date: '22 Nov 2024, 11:00 AM' },
    ]
  },
  {
    id: 'INT12348',
    applicationId: 'APP12348',
    jobId: 'JOB12348',
    candidate: {
      name: 'Sagar Mehta',
      initials: 'SM',
      company: 'TechCorp',
      email: 'sagar.mehta@techcorp.org',
      phone: '+91 98989 12345',
      experience: '5 - 8 Years',
    },
    jobRole: 'Backend Developer',
    date: '19 Nov 2024',
    dateFull: '19 Nov 2024 (Tuesday)',
    time: '11:30 AM IST',
    endTime: '12:30 PM IST',
    duration: '60 min',
    durationFull: '60 minutes',
    status: 'COMPLETED',
    matchScore: '88%',
    createdAt: '15 Nov 2024, 10:00 AM',
    lastUpdated: '19 Nov 2024, 01:00 PM',
    interviewType: 'System Design & APIs',
    agenda: 'Distributed caching strategies, Kafka messaging streams, DB indexing, and microservice resilience.',
    mode: 'Online',
    platform: 'Interviewer Hub Platform',
    resourcesCount: 5,
    meetingLink: 'https://interviewerhub.com/meet/INT12348',
    interviewer: {
      name: 'Rohit Patil (You)',
      initials: 'RP',
      email: 'rohit.patil@netronsolutions.com',
      phone: '+91 90909 09090',
    },
    schedulingStatus: 'EVALUATION SUBMITTED',
    applicationStatus: 'PASSED - ADVANCED',
    timeline: [
      { title: 'Interview Scheduled', date: '15 Nov 2024, 10:00 AM' },
      { title: 'Interview Completed', date: '19 Nov 2024, 12:30 PM' },
      { title: 'Feedback Submitted', date: '19 Nov 2024, 01:00 PM' },
    ]
  },
  {
    id: 'INT12349',
    applicationId: 'APP12349',
    jobId: 'JOB12349',
    candidate: {
      name: 'Nikita Tiwari',
      initials: 'NT',
      company: 'WebDreams',
      email: 'nikita.tiwari@webdreams.com',
      phone: '+91 91234 56789',
      experience: '3 - 4 Years',
    },
    jobRole: 'Frontend Developer',
    date: '20 Nov 2024',
    dateFull: '20 Nov 2024 (Wednesday)',
    time: '01:00 PM IST',
    endTime: '02:00 PM IST',
    duration: '60 min',
    durationFull: '60 minutes',
    status: 'COMPLETED',
    matchScore: '74%',
    createdAt: '16 Nov 2024, 02:15 PM',
    lastUpdated: '20 Nov 2024, 02:30 PM',
    interviewType: 'Frontend & Web Vitals',
    agenda: 'React 18 concurrent rendering, Tailwind CSS architecture, accessibility compliance (WCAG), performance audit.',
    mode: 'Online',
    platform: 'Interviewer Hub Platform',
    resourcesCount: 2,
    meetingLink: 'https://interviewerhub.com/meet/INT12349',
    interviewer: {
      name: 'Rohit Patil (You)',
      initials: 'RP',
      email: 'rohit.patil@netronsolutions.com',
      phone: '+91 90909 09090',
    },
    schedulingStatus: 'EVALUATION SUBMITTED',
    applicationStatus: 'ON HOLD',
    timeline: [
      { title: 'Interview Scheduled', date: '16 Nov 2024, 02:15 PM' },
      { title: 'Interview Completed', date: '20 Nov 2024, 02:00 PM' },
      { title: 'Feedback Submitted', date: '20 Nov 2024, 02:30 PM' },
    ]
  },
  {
    id: 'INT12350',
    applicationId: 'APP12350',
    jobId: 'JOB12350',
    candidate: {
      name: 'Amit Gupta',
      initials: 'AG',
      company: 'SoftDev Inc.',
      email: 'amit.gupta@softdev.com',
      phone: '+91 99887 76655',
      experience: '5 - 7 Years',
    },
    jobRole: 'DevOps Engineer',
    date: '18 Nov 2024',
    dateFull: '18 Nov 2024 (Monday)',
    time: '10:30 AM IST',
    endTime: '11:30 AM IST',
    duration: '60 min',
    durationFull: '60 minutes',
    status: 'CANCELLED',
    matchScore: '—',
    createdAt: '14 Nov 2024, 09:00 AM',
    lastUpdated: '17 Nov 2024, 04:00 PM',
    interviewType: 'CI/CD & Cloud Infrastructure',
    agenda: 'Kubernetes deployment pipelines, Terraform IaC, monitoring setup with Grafana and Prometheus.',
    mode: 'Online',
    platform: 'Interviewer Hub Platform',
    resourcesCount: 1,
    meetingLink: 'https://interviewerhub.com/meet/INT12350',
    interviewer: {
      name: 'Rohit Patil (You)',
      initials: 'RP',
      email: 'rohit.patil@netronsolutions.com',
      phone: '+91 90909 09090',
    },
    schedulingStatus: 'CANCELLED BY CANDIDATE',
    applicationStatus: 'WITHDRAWN',
    timeline: [
      { title: 'Interview Scheduled', date: '14 Nov 2024, 09:00 AM' },
      { title: 'Cancellation Requested', date: '17 Nov 2024, 04:00 PM' },
    ]
  }
];

export default function InterviewsListView({ onSelectInterview }) {

  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const { interviews: apiInterviews, isLoading } = useInterviewerInterviews();

  // Transform backend API interviews if available
  const transformedBackendInterviews = (apiInterviews || []).map((item) => {
    const app = typeof item.applicationId === 'object' && item.applicationId !== null ? item.applicationId : {};
    const candidateObj = item.candidateId || app.candidateId || {};
    const jobObj = app.jobOpeningId || {};
    const orgObj = item.organizationId || app.organizationId || {};

    const candidateName = candidateObj.name || item.candidate?.name || 'Candidate';
    const company = orgObj.name || item.candidate?.company || 'CodeTier';
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

    const portfolioLinks = app.portfolioLinks && app.portfolioLinks.length > 0
      ? app.portfolioLinks
      : (item.candidate?.portfolioLinks || [
          { platform: 'GITHUB', url: 'https://github.com' },
          { platform: 'LINKEDIN', url: 'https://linkedin.com' },
        ]);

    return {
      id: item._id || item.id,
      applicationId: app._id || item.applicationId || 'N/A',
      jobId: jobObj._id || item.jobId || 'N/A',
      candidate: {
        name: candidateName,
        initials: initials,
        company: company,
        email: candidateObj.email || item.candidate?.email || 'N/A',
        phone: candidateObj.phone || item.candidate?.phone || 'N/A',
        experience: app.yearsOfExperience != null ? `${app.yearsOfExperience} Years` : (item.candidate?.experience || '2 - 4 Years'),
        location: app.currentLocation || 'Mumbai, India',
      },
      application: {
        resumeUrl: app.resumeUrl,
        coverLetter: app.coverLetter,
        portfolioLinks: portfolioLinks,
        yearsOfExperience: app.yearsOfExperience,
        expectedSalary: app.expectedSalary ? `₹ ${Number(app.expectedSalary).toLocaleString()}` : 'Negotiable',
        noticePeriod: app.noticePeriod != null ? `${app.noticePeriod} Days` : '30 Days',
        currentLocation: app.currentLocation || 'Mumbai, India',
        message: app.message,
        requiredSkills: jobObj.requiredSkills || ['React', 'Node.js', 'System Design'],
      },
      jobRole: jobObj.title || item.jobRole || 'Software Engineer',
      date: formattedDate,
      dateFull: startDate ? startDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }) : formattedDate,
      time: formattedTime,
      endTime: item.endTime ? new Date(item.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBD',
      duration: item.duration ? `${item.duration} min` : '60 min',
      durationFull: item.duration ? `${item.duration} minutes` : '60 minutes',
      status: item.status || 'SCHEDULED',
      matchScore: item.matchScore || '85%',
      createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent',
      lastUpdated: item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Recent',
      interviewType: 'Technical Round',
      agenda: 'Technical evaluation, portfolio review, and live architecture discussion.',
      mode: 'Online',
      platform: 'CodeTier Platform',
      resourcesCount: 3,
      meetingLink: `/interview/${item._id || item.id}/join`,
      interviewer: {
        name: 'Interviewer',
        initials: 'IN',
        email: 'interviewer@codetier.com',
        phone: 'N/A',
      },
      schedulingStatus: item.status || 'SCHEDULED',
      applicationStatus: app.applicationStatus || 'SHORTLISTED',
      timeline: [
        { title: 'Interview Scheduled', date: formattedDate },
      ],
    };
  });


  const allInterviews = apiInterviews ? transformedBackendInterviews : [];


  const filterTabs = [
    { id: 'All', label: 'All', count: allInterviews.length },
    { id: 'SCHEDULED', label: 'Scheduled', count: allInterviews.filter((i) => ['SCHEDULED', 'UPCOMING'].includes(i.status)).length },
    { id: 'IN PROGRESS', label: 'In Progress', count: allInterviews.filter((i) => ['IN PROGRESS', 'IN_PROGRESS'].includes(i.status)).length },
    { id: 'COMPLETED', label: 'Completed', count: allInterviews.filter((i) => i.status === 'COMPLETED').length },
    { id: 'CANCELLED', label: 'Cancelled', count: allInterviews.filter((i) => i.status === 'CANCELLED').length },
  ];

  const filteredInterviews = allInterviews.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'SCHEDULED') return ['SCHEDULED', 'UPCOMING'].includes(item.status);
    if (activeFilter === 'IN PROGRESS') return ['IN PROGRESS', 'IN_PROGRESS'].includes(item.status);
    return item.status === activeFilter;
  });


  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className="px-3 py-1 rounded-full bg-[#3b1d60] border border-[#7c3aed]/50 text-[#c084fc] font-bold text-[10px] tracking-wider uppercase">
            SCHEDULED
          </span>
        );
      case 'IN PROGRESS':
        return (
          <span className="px-3 py-1 rounded-full bg-[#1e3a8a]/80 border border-blue-500/50 text-blue-300 font-bold text-[10px] tracking-wider uppercase">
            IN PROGRESS
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 rounded-full bg-[#14532d]/80 border border-emerald-500/50 text-emerald-300 font-bold text-[10px] tracking-wider uppercase">
            COMPLETED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full bg-[#7f1d1d]/80 border border-rose-500/50 text-rose-300 font-bold text-[10px] tracking-wider uppercase">
            CANCELLED
          </span>
        );
      default:
        return null;
    }
  };

  const getMatchScoreBadge = (scoreStr) => {
    if (scoreStr === '—' || !scoreStr) {
      return <span className="text-white/40 font-mono text-sm">—</span>;
    }
    const scoreVal = parseInt(scoreStr, 10);
    let colorClass = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    if (scoreVal < 80) {
      colorClass = 'text-amber-400 bg-amber-950/40 border-amber-500/30';
    }
    return (
      <span className={`px-2.5 py-0.5 rounded border text-xs font-bold font-mono ${colorClass}`}>
        {scoreStr}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Interviews</h1>
        <p className="text-xs text-white/50 mt-1">View and manage all your interviews.</p>
      </div>

      {/* Filter Tabs & Right Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#6C4F91] text-white shadow-md shadow-[#6C4F91]/20 border border-[#8b65b8]'
                    : 'bg-[#13111a] text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters Button */}
        <button
          onClick={() => toast('Filter preferences open')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#13111a] border border-white/10 text-white/80 hover:text-white hover:border-white/20 text-[11px] font-medium transition-all cursor-pointer shadow-sm"
        >
          <Filter className="w-3.5 h-3.5 text-white/60" />
          <span>Filters</span>
        </button>
      </div>

      {/* Interviews Table Container */}
      <div className="bg-[#0f0d15] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#14111d]/80 text-[11px] font-mono uppercase tracking-wider text-white/40 font-semibold">
                <th className="py-4 px-6">Candidate</th>
                <th className="py-4 px-6">Job Role</th>
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Match Score</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white/90">
              {filteredInterviews.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectInterview(item)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  {/* Candidate */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3b1d60] border border-[#7c3aed]/40 text-purple-200 font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
                        {item.candidate.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm group-hover:text-[#c084fc] transition-colors">
                          {item.candidate.name}
                        </span>
                        <span className="text-[11px] text-white/50">{item.candidate.company}</span>
                      </div>
                    </div>
                  </td>

                  {/* Job Role */}
                  <td className="py-4 px-6 font-medium text-white/90">{item.jobRole}</td>

                  {/* Date & Time */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white/90">{item.date}</span>
                      <div className="flex items-center gap-1 text-[11px] text-white/50 mt-0.5 font-mono">
                        <Calendar className="w-3 h-3 text-[#c084fc]" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-6 font-mono text-white/80">{item.duration}</td>

                  {/* Status */}
                  <td className="py-4 px-6">{getStatusBadge(item.status)}</td>

                  {/* Match Score */}
                  <td className="py-4 px-6">{getMatchScoreBadge(item.matchScore)}</td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectInterview(item)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#191524] border border-white/10 hover:border-white/20 text-white/90 hover:text-white text-[11px] font-semibold transition-all cursor-pointer shadow-sm"
                      >
                        <span>View Details</span>
                        <ChevronDown className="w-3 h-3 text-white/40" />
                      </button>

                      <button
                        onClick={() => toast(`Options for ${item.candidate.name}`)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-center gap-2 bg-[#120f1a]">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="p-2 rounded-lg bg-[#181524] border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                currentPage === p
                  ? 'bg-[#6C4F91] text-white border border-[#8b65b8]'
                  : 'bg-[#181524] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
            className="p-2 rounded-lg bg-[#181524] border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
