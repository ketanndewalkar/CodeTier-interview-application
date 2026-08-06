import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  Award, 
  Plus, 
  MoreVertical, 
  ArrowRight, 
  ChevronRight,
  Clock,
  Building,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserStore } from '../../../store/userStore';
import {
  useOrganizationJobs,
  useOrganizationApplications,
  useOrganizationInterviews,
} from '../../../pages/organization/hooks/useOrganization';

export default function OrgDashboardOverview({ onCreateJobClick, onNavigateTab }) {
  const user = useUserStore((state) => state.user);
  const orgName = user?.name || 'Your Organization';

  const { jobs: apiJobs, isLoading: jobsLoading } = useOrganizationJobs();
  const { applications: apiApps, isLoading: appsLoading } = useOrganizationApplications();
  const { interviews: apiInterviews, isLoading: interviewsLoading } = useOrganizationInterviews();

  const jobs = apiJobs ?? [];
  const applications = apiApps ?? [];
  const interviews = apiInterviews ?? [];

  // Stats derived from real data
  const activeJobsCount = jobs.filter(j => j.status === 'OPEN').length;
  const shortlistedCount = applications.filter(a => a.applicationStatus === 'SHORTLISTED').length;
  const hiredCount = applications.filter(a => a.applicationStatus === 'HIRED').length;

  // Active jobs list for the recent jobs section
  const activeJobs = jobs.slice(0, 5).map(j => ({
    id: j._id,
    title: j.title,
    department: j.interviewMode || 'Engineering',
    type: j.availabilityType || 'Full-time',
    location: j.location || 'Remote',
    status: j.status || 'OPEN',
    applicantsCount: j.applicationsCount || 0,
    publishedDate: j.createdAt ? new Date(j.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recent',
    deadline: j.applicationDeadline ? new Date(j.applicationDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No deadline',
    skills: j.requiredSkills || [],
  }));

  // Recent applications list
  const recentApps = applications.slice(0, 5).map(a => ({
    id: a._id,
    name: a.candidateId?.name || 'Candidate',
    role: a.jobOpeningId?.title || 'Software Engineer',
    status: a.applicationStatus || 'APPLIED',
    appliedDate: a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recent',
  }));

  const [trendTimeframe, setTrendTimeframe] = useState('Last 6 months');

  const isLoading = jobsLoading || appsLoading || interviewsLoading;


  return (
    <div className="space-y-6">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Welcome back, {orgName}!</span>
          </h1>

          <p className="text-xs text-white/50 mt-1">
            Here's what's happening with your hiring pipeline.
          </p>
        </div>

        <button
          onClick={onCreateJobClick}
          className="px-4 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#7c3aed]/25 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create Job Opening</span>
        </button>
      </div>

      {/* 4 Top Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Jobs */}
        <div className="p-5 rounded-2xl bg-[#110e17] border border-white/10 shadow-xl flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-white/60">Active Jobs</span>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {jobsLoading ? <Loader2 className="w-5 h-5 animate-spin text-white/40" /> : activeJobsCount}
            </div>
            <div className="text-[11px] text-white/50">Open positions</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#2a1d3f] border border-[#7c3aed]/30 flex items-center justify-center text-[#c084fc] shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Applications */}
        <div className="p-5 rounded-2xl bg-[#110e17] border border-white/10 shadow-xl flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-white/60">Total Applications</span>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {appsLoading ? <Loader2 className="w-5 h-5 animate-spin text-white/40" /> : applications.length}
            </div>
            <div className="text-[11px] text-white/50">Received applications</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Interviews Scheduled */}
        <div className="p-5 rounded-2xl bg-[#110e17] border border-white/10 shadow-xl flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-white/60">Interviews Scheduled</span>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {interviewsLoading ? <Loader2 className="w-5 h-5 animate-spin text-white/40" /> : interviews.length}
            </div>
            <div className="text-[11px] text-white/50">Upcoming interviews</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Candidates Hired */}
        <div className="p-5 rounded-2xl bg-[#110e17] border border-white/10 shadow-xl flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-white/60">Candidates Hired</span>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {appsLoading ? <Loader2 className="w-5 h-5 animate-spin text-white/40" /> : hiredCount}
            </div>
            <div className="text-[11px] text-white/50">Successful hires</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#2e1065] border border-purple-500/30 flex items-center justify-center text-[#c084fc] shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Middle Row: Hiring Pipeline & Applications Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Funnel Card (col-span-5) */}
        <div className="lg:col-span-5 bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Hiring Pipeline</h2>
          </div>

          {/* Funnel Layout */}
          <div className="space-y-3 py-2">
            {/* Step 1: Applications */}
            <div className="relative">
              <div className="w-full bg-[#7c3aed] h-12 rounded-xl flex items-center justify-between px-4 text-white shadow-md">
                <span className="text-sm font-bold">{applications.length}</span>
              </div>
              <div className="flex items-center justify-between mt-1 px-1">
                <span className="text-xs font-semibold text-white/80">Applications</span>
                <span className="text-xs font-mono font-bold text-white">{applications.length} <span className="text-white/40 text-[10px]">100%</span></span>
              </div>
            </div>

            {/* Step 2: Shortlisted */}
            <div className="relative px-4">
              <div className="w-full bg-[#10b981] h-10 rounded-xl flex items-center justify-between px-4 text-white shadow-md">
                <span className="text-xs font-bold">{shortlistedCount}</span>
              </div>
              <div className="flex items-center justify-between mt-1 px-1">
                <span className="text-xs font-semibold text-white/80">Shortlisted</span>
                <span className="text-xs font-mono font-bold text-white">{shortlistedCount} <span className="text-white/40 text-[10px]">{applications.length ? `${((shortlistedCount / applications.length) * 100).toFixed(1)}%` : '0%'}</span></span>
              </div>
            </div>

            {/* Step 3: Interview Scheduled */}
            <div className="relative px-8">
              <div className="w-full bg-[#f59e0b] h-9 rounded-xl flex items-center justify-between px-4 text-white shadow-md">
                <span className="text-xs font-bold">{interviews.length}</span>
              </div>
              <div className="flex items-center justify-between mt-1 px-1">
                <span className="text-xs font-semibold text-white/80">Interview Scheduled</span>
                <span className="text-xs font-mono font-bold text-white">{interviews.length} <span className="text-white/40 text-[10px]">{applications.length ? `${((interviews.length / applications.length) * 100).toFixed(1)}%` : '0%'}</span></span>
              </div>
            </div>

            {/* Step 4: Hired */}
            <div className="relative px-12">
              <div className="w-full bg-[#3b82f6] h-8 rounded-xl flex items-center justify-between px-4 text-white shadow-md">
                <span className="text-xs font-bold">{hiredCount}</span>
              </div>
              <div className="flex items-center justify-between mt-1 px-1">
                <span className="text-xs font-semibold text-white/80">Hired</span>
                <span className="text-xs font-mono font-bold text-white">{hiredCount} <span className="text-white/40 text-[10px]">{applications.length ? `${((hiredCount / applications.length) * 100).toFixed(1)}%` : '0%'}</span></span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-medium text-white/50">Conversion Rate</span>
            <span className="text-sm font-bold font-mono text-[#c084fc]">{applications.length ? `${((hiredCount / applications.length) * 100).toFixed(1)}%` : '0%'}</span>
          </div>
        </div>

        {/* Right Applications Trend Card (col-span-7) */}
        <div className="lg:col-span-7 bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">Applications Trend</h2>
            <div className="relative">
              <select
                value={trendTimeframe}
                onChange={(e) => setTrendTimeframe(e.target.value)}
                className="bg-[#181524] border border-white/10 text-white text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#7c3aed] cursor-pointer"
              >
                <option value="Last 6 months">Last 6 months</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="This year">This year</option>
              </select>
            </div>
          </div>

          {/* Series Legend */}
          <div className="flex items-center gap-6 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]" />
              <span className="text-white/70">Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="text-white/70">Shortlisted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-white/70">Rejected</span>
            </div>
          </div>

          {/* Line Chart Area */}
          <div className="relative w-full h-52 pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="10" x2="500" y2="10" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="rgba(255,255,255,0.05)" />

              {/* Y Axis Labels */}
              <text x="0" y="15" fill="rgba(255,255,255,0.3)" fontSize="9">400</text>
              <text x="0" y="55" fill="rgba(255,255,255,0.3)" fontSize="9">300</text>
              <text x="0" y="95" fill="rgba(255,255,255,0.3)" fontSize="9">200</text>
              <text x="0" y="135" fill="rgba(255,255,255,0.3)" fontSize="9">0</text>

              {/* Line 1: Applications (Purple) */}
              <path
                d="M 30,100 Q 110,80 190,60 T 350,35 T 480,20"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="3"
              />
              <circle cx="30" cy="100" r="4" fill="#7c3aed" />
              <circle cx="120" cy="85" r="4" fill="#7c3aed" />
              <circle cx="210" cy="65" r="4" fill="#7c3aed" />
              <circle cx="300" cy="45" r="4" fill="#7c3aed" />
              <circle cx="390" cy="30" r="4" fill="#7c3aed" />
              <circle cx="480" cy="20" r="4" fill="#7c3aed" />

              {/* Line 2: Shortlisted (Green) */}
              <path
                d="M 30,125 Q 110,120 190,115 T 350,105 T 480,95"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              <circle cx="30" cy="125" r="3.5" fill="#10b981" />
              <circle cx="120" cy="120" r="3.5" fill="#10b981" />
              <circle cx="210" cy="115" r="3.5" fill="#10b981" />
              <circle cx="300" cy="110" r="3.5" fill="#10b981" />
              <circle cx="390" cy="102" r="3.5" fill="#10b981" />
              <circle cx="480" cy="95" r="3.5" fill="#10b981" />

              {/* Line 3: Rejected (Red) */}
              <path
                d="M 30,140 Q 110,138 190,135 T 350,130 T 480,125"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
              />
              <circle cx="30" cy="140" r="3.5" fill="#f43f5e" />
              <circle cx="120" cy="138" r="3.5" fill="#f43f5e" />
              <circle cx="210" cy="135" r="3.5" fill="#f43f5e" />
              <circle cx="300" cy="132" r="3.5" fill="#f43f5e" />
              <circle cx="390" cy="128" r="3.5" fill="#f43f5e" />
              <circle cx="480" cy="125" r="3.5" fill="#f43f5e" />
            </svg>

            {/* X Axis Month Labels */}
            <div className="flex justify-between px-6 text-[10px] font-mono text-white/40 pt-2">
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Recent Applications & Active Job Openings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Applications (col-span-7) */}
        <div className="lg:col-span-7 bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">Recent Applications</h2>
            <button
              onClick={() => onNavigateTab && onNavigateTab('applications')}
              className="text-xs font-semibold text-[#c084fc] hover:text-[#d8b4fe] transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">CANDIDATE</th>
                  <th className="pb-3 font-semibold">JOB ROLE</th>
                  <th className="pb-3 font-semibold">APPLIED ON</th>
                  <th className="pb-3 font-semibold">STATUS</th>
                  <th className="pb-3 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-white/40 text-xs">
                      {appsLoading ? 'Loading…' : 'No applications yet.'}
                    </td>
                  </tr>
                ) : recentApps.map((app) => (
                  <tr key={app.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#5b21b6] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {(app.name || '?').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#c084fc] transition-colors">
                            {app.name}
                          </div>
                          <div className="text-[10px] text-white/40">{app.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 font-medium text-white/80">{app.role}</td>
                    <td className="py-3.5 px-2 text-white/60 font-mono text-[11px]">
                      <div>{app.appliedDate}</div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase inline-block ${
                        app.status === 'SHORTLISTED' ? 'bg-[#2a1d3f] text-[#c084fc] border border-[#7c3aed]/40' :
                        app.status === 'REJECTED' ? 'bg-rose-950/80 text-rose-400 border border-rose-500/30' :
                        app.status === 'HIRED' ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30' :
                        'bg-blue-950/70 text-blue-400 border border-blue-500/30'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 pl-2 text-right">
                      <button
                        onClick={() => toast(`Managing application for ${app.name}`)}
                        className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigateTab && onNavigateTab('applications')}
              className="text-xs font-bold text-[#c084fc] hover:text-[#d8b4fe] inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View all applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Active Job Openings (col-span-5) */}
        <div className="lg:col-span-5 bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">Active Job Openings</h2>
            <button
              onClick={() => onNavigateTab && onNavigateTab('jobs')}
              className="text-xs font-semibold text-[#c084fc] hover:text-[#d8b4fe] transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {activeJobs.length === 0 ? (
              <div className="py-8 text-center text-white/40 text-xs">
                {jobsLoading ? 'Loading…' : 'No active jobs yet.'}
              </div>
            ) : activeJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl border border-[#7c3aed]/30 bg-[#2a1d3f] flex items-center justify-center shrink-0 text-[#c084fc]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-white text-xs group-hover:text-[#c084fc] transition-colors truncate">
                      {job.title}
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5">
                      {job.status} • {job.deadline !== 'No deadline' ? `Due ${job.deadline}` : 'No deadline'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <div className="text-xs font-bold text-white font-mono">{job.applicantsCount}</div>
                    <div className="text-[9px] text-white/40">Applicants</div>
                  </div>
                  <button
                    onClick={() => toast(`Managing job opening: ${job.title}`)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigateTab && onNavigateTab('jobs')}
              className="text-xs font-bold text-[#c084fc] hover:text-[#d8b4fe] inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View all jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Interviews */}
      <div className="bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">Upcoming Interviews</h2>
          <button
            onClick={() => onNavigateTab && onNavigateTab('interviews')}
            className="text-xs font-semibold text-[#c084fc] hover:text-[#d8b4fe] transition-colors cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="space-y-3">
          {interviews.length === 0 ? (
            <div className="py-8 text-center text-white/40 text-xs">
              {interviewsLoading ? 'Loading…' : 'No interviews scheduled yet.'}
            </div>
          ) : interviews.slice(0, 5).map((item) => {
            const candidateName =
              item.applicationId?.candidateId?.name ||
              item.candidateId?.name ||
              'Candidate';
            const jobTitle = item.applicationId?.jobOpeningId?.title || 'Interview';
            const interviewer = item.interviewerId?.name || 'Assigned';
            const startTime = item.startTime
              ? new Date(item.startTime).toLocaleString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })
              : 'TBD';
            const initials = candidateName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            return (
              <div
                key={item._id}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1.5 rounded-lg bg-[#2a1d3f] border border-[#7c3aed]/30 text-[#c084fc] font-mono font-bold text-[11px] shrink-0">
                    {item.interviewStatus || 'SCHEDULED'}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#5b21b6] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs group-hover:text-[#c084fc] transition-colors">
                      {candidateName}
                    </div>
                    <div className="text-[10px] text-white/50">{jobTitle}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-bold text-white/90">{interviewer}</div>
                    <div className="text-[10px] text-white/40 font-mono">{startTime}</div>
                  </div>
                  <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                    <button
                      onClick={() => toast(`Opening details for interview with ${candidateName}`)}
                      className="p-1 text-white/40 hover:text-white cursor-pointer ml-1"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
