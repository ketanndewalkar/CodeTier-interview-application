import React, { useState } from 'react';
import {
  Plus,
  Filter,
  ChevronDown,
  MapPin,
  MoreVertical,
  ExternalLink,
  Edit3,
  Code2,
  Server,
  Cloud,
  PenTool,
  BarChart2,
  ShieldCheck,
  FileText,
  Lock,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { useOrganizationJobs, useChangeJobStatus, useDeleteJob, useJobApplications } from '../../../pages/organization/hooks/useOrganization';

export default function OrgJobsView({ onCreateJobClick, onEditJobClick }) {
  const { jobs: apiJobs, isLoading, refetch } = useOrganizationJobs();
  const { mutate: changeStatus } = useChangeJobStatus();
  const { mutate: deleteJob } = useDeleteJob();

  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('Newest');
  const [expandedJobId, setExpandedJobId] = useState(null);

  const jobsList = (apiJobs ?? []).map(j => {
    let statusBg = 'bg-white/5 text-white/60 border border-white/10';
    if (j.status === 'OPEN') statusBg = 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10';
    else if (j.status === 'CLOSED') statusBg = 'bg-rose-950/40 text-rose-400 border border-rose-500/10';
    else if (j.status === 'PAUSED') statusBg = 'bg-amber-950/40 text-amber-400 border border-amber-500/10';

    return {
      id: j._id,
      raw: j,
      title: j.title,
      department: j.department || 'Engineering',
      departmentBg: 'bg-purple-950/40 text-purple-300 border border-purple-500/10',
      type: j.availabilityType || 'Full-time',
      location: j.location || 'Remote',
      status: j.status || 'OPEN',
      statusBg,
      applicantsCount: j.applicationsCount || 0,
      newAppsCount: '0',
      publishedDate: j.createdAt ? new Date(j.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recent',
      createdOn: j.createdAt ? new Date(j.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent',
      deadline: j.applicationDeadline ? new Date(j.applicationDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No deadline',
      skills: j.requiredSkills || [],
      iconType: 'code',
      iconBg: 'bg-[#2a1d3f] border border-[#7c3aed]/30 text-[#c084fc]',
      level: j.experienceLevel || 'Mid-Senior',
      actionText: 'Edit'
    };
  });



  // Status counts for tabs
  const totalCount = jobsList.length;
  const draftCount = jobsList.filter(j => j.status === 'DRAFT').length;
  const pausedCount = jobsList.filter(j => j.status === 'PAUSED').length;
  const openCount = jobsList.filter(j => j.status === 'OPEN').length;
  const closedCount = jobsList.filter(j => j.status === 'CLOSED').length;


  const renderIcon = (type) => {
    switch (type) {
      case 'code':
        return <Code2 className="w-4 h-4" />;
      case 'server':
        return <Server className="w-4 h-4" />;
      case 'cloud':
        return <Cloud className="w-4 h-4" />;
      case 'pen':
        return <PenTool className="w-4 h-4" />;
      case 'chart':
        return <BarChart2 className="w-4 h-4" />;
      case 'shield':
        return <ShieldCheck className="w-4 h-4" />;
      case 'file':
        return <FileText className="w-4 h-4" />;
      case 'lock':
        return <Lock className="w-4 h-4" />;
      default:
        return <Code2 className="w-4 h-4" />;
    }
  };

  const filteredJobs = jobsList.filter((j) => {
    if (selectedStatus === 'ALL') return true;
    return j.status === selectedStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Jobs</h1>
          <p className="text-xs text-white/50 mt-1">Manage all your job openings and their status.</p>
        </div>

        <button
          onClick={onCreateJobClick}
          className="px-4 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#7c3aed]/25 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create Job Opening</span>
        </button>
      </div>

      {/* Filter Tabs & Options Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 lg:pb-0">
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedStatus === 'ALL'
                ? 'bg-[#6C4F91] text-white shadow-md shadow-[#6C4F91]/20'
                : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
            }`}
          >
            <span>All Jobs</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                selectedStatus === 'ALL' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatus('DRAFT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedStatus === 'DRAFT'
                ? 'bg-[#6C4F91] text-white shadow-md shadow-[#6C4F91]/20'
                : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
            }`}
          >
            <span>Draft</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                selectedStatus === 'DRAFT' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              {draftCount}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatus('PAUSED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedStatus === 'PAUSED'
                ? 'bg-[#6C4F91] text-white shadow-md shadow-[#6C4F91]/20'
                : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
            }`}
          >
            <span className="w-2 h-2 rounded-sm bg-amber-400"></span>
            <span>Paused</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                selectedStatus === 'PAUSED' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              {pausedCount}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatus('OPEN')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedStatus === 'OPEN'
                ? 'bg-[#6C4F91] text-white shadow-md shadow-[#6C4F91]/20'
                : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
            }`}
          >
            <span className="w-2 h-2 rounded-sm bg-emerald-400"></span>
            <span>Open</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                selectedStatus === 'OPEN' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              {openCount}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatus('CLOSED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedStatus === 'CLOSED'
                ? 'bg-[#6C4F91] text-white shadow-md shadow-[#6C4F91]/20'
                : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
            }`}
          >
            <span className="w-2 h-2 rounded-sm bg-rose-400"></span>
            <span>Closed</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                selectedStatus === 'CLOSED' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              {closedCount}
            </span>
          </button>
        </div>

        {/* Right Action Controls: Filters & Sort */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          <button
            onClick={() => toast('Filter options opened')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-white/60" />
            <span>Filters</span>
          </button>

          <div className="relative">
            <button
              onClick={() => toast('Sort options toggled')}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Sort: {sortBy}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Jobs Table Container */}
      <div className="bg-[#110e17] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-[11px] font-medium tracking-wide">
                <th className="py-4 px-5 w-10"></th>
                <th className="py-4 px-5">Job Title</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Created On</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredJobs.map((job) => (
                <React.Fragment key={job.id}>
                  <tr className="group hover:bg-white/[0.02] transition-colors">
                    {/* Toggle Chevron Column */}
                    <td className="py-4 px-5 align-middle text-center">
                      <button
                        onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                        className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        {expandedJobId === job.id ? (
                          <ChevronUp className="w-4 h-4 text-[#c084fc]" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Job Title Column */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${job.iconBg}`}
                        >
                          {renderIcon(job.iconType)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-[#c084fc] transition-colors">
                            {job.title}
                          </div>
                          <div className="text-[11px] text-white/40 mt-0.5">{job.level}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department Column */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase ${job.departmentBg}`}
                      >
                        {job.department}
                      </span>
                    </td>

                    {/* Location Column */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-white/70 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                    </td>

                    {/* Status Badge Column */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${job.statusBg}`}
                      >
                        {job.status}
                      </span>
                    </td>

                    {/* Created On Column */}
                    <td className="py-4 px-4 text-white/70 font-medium text-xs">
                      {job.createdOn}
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            if (job.actionText === 'Edit' && onEditJobClick) {
                              onEditJobClick(job.raw);
                            } else {
                              toast(`Action clicked for ${job.title}: ${job.actionText}`);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          {job.actionText === 'Edit' ? (
                            <Edit3 className="w-3 h-3 text-white/70" />
                          ) : (
                            <ExternalLink className="w-3 h-3 text-white/70" />
                          )}
                          <span>{job.actionText}</span>
                        </button>

                        <button
                          onClick={() => toast(`More options for ${job.title}`)}
                          className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedJobId === job.id && (
                    <tr className="bg-black/20">
                      <td colSpan={7} className="py-4 px-5 border-t border-white/5">
                        <JobApplicationsSubTable jobId={job.id} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>
            Showing <span className="text-white font-medium">1 to 8</span> of{' '}
            <span className="text-white font-medium">24</span> jobs
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-[#7c3aed] text-white font-bold text-xs flex items-center justify-center shadow-sm">
              1
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-white/5 text-white/60 hover:text-white font-medium text-xs flex items-center justify-center transition-colors cursor-pointer">
              2
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-white/5 text-white/60 hover:text-white font-medium text-xs flex items-center justify-center transition-colors cursor-pointer">
              3
            </button>
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobApplicationsSubTable({ jobId }) {
  const { applications, isLoading, isError } = useJobApplications(jobId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-white/50 text-xs py-4 px-4 justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-[#c084fc]" />
        <span>Loading applications for this job…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-rose-400 text-xs py-4 px-4 text-center">
        Failed to load applications for this job.
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-white/40 text-xs py-6 px-4 text-center">
        No applications received for this job opening yet.
      </div>
    );
  }

  return (
    <div className="bg-[#181424]/40 border border-white/5 rounded-xl p-4 space-y-3">
      <h4 className="text-xs font-bold text-white/80">Received Applications ({applications.length})</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-[10px] font-bold uppercase">
              <th className="py-2 px-2">Applicant</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Applied On</th>
              <th className="py-2 px-2">Exp</th>
              <th className="py-2 px-2 text-right">Resume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {applications.map((app) => {
              const name = app.candidateId?.name || 'Candidate';
              const email = app.candidateId?.email || '';
              const date = app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
              return (
                <tr key={app._id} className="hover:bg-white/[0.01]">
                  <td className="py-2 px-2">
                    <div className="font-bold text-white">{name}</div>
                    <div className="text-[10px] text-white/40">{email}</div>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      app.applicationStatus === 'SHORTLISTED' ? 'bg-[#2a1d3f] text-[#c084fc]' :
                      app.applicationStatus === 'REJECTED' ? 'bg-rose-950/80 text-rose-400' :
                      'bg-blue-950/80 text-blue-400'
                    }`}>
                      {app.applicationStatus}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-white/60 font-mono text-[10px]">{date}</td>
                  <td className="py-2 px-2 text-white/60">{app.yearsOfExperience ?? '—'} Yrs</td>
                  <td className="py-2 px-2 text-right">
                    {app.resumeUrl ? (
                      <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-[#c084fc] hover:underline font-semibold text-xs">
                        View
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

