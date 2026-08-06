import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  ArrowLeft,
  Calendar,
  FileText,
  Eye,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  User,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useOrganizationApplications, useUpdateApplicationStatus } from '../../../pages/organization/hooks/useOrganization';

export default function OrgApplicationsView() {
  const { applications: apiApps, isLoading } = useOrganizationApplications();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();

  const currentList = (apiApps ?? []).map(item => ({
    id: item._id,
    rawId: item._id,
    candidate: {
      name: item.candidateId?.name || 'Candidate',
      email: item.candidateId?.email || 'N/A',
      phone: item.candidateId?.phone || 'N/A',
      location: item.currentLocation || 'India',
      experience: item.yearsOfExperience != null ? `${item.yearsOfExperience} Years` : '2+ Years',
      initials: (item.candidateId?.name || 'Candidate').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    },
    jobRole: item.jobOpeningId?.title || 'Software Engineer',
    appliedDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent',
    status: item.applicationStatus || 'APPLIED',
    schedulingStatus: item.schedulingStatus,
    matchScore: '85%',
    experienceYears: item.yearsOfExperience || 3,
    expectedSalary: item.expectedSalary ? `₹ ${Number(item.expectedSalary).toLocaleString()}` : 'Negotiable',
    noticePeriod: item.noticePeriod != null ? `${item.noticePeriod} Days` : '30 Days',
    resumeUrl: item.resumeUrl || item.resume,
    resumeName: (item.resumeUrl || item.resume) ? (item.resumeUrl || item.resume).substring((item.resumeUrl || item.resume).lastIndexOf('/') + 1).split('?')[0] : 'resume.pdf',
    resumeSize: '0.9 MB',
    coverLetter: item.coverLetter || 'No cover letter submitted.',
    portfolioLinks: item.portfolioLinks || [],
    timeline: [
      {
        title: 'Application Received',
        desc: 'Successfully received application in system',
        time: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'Recent'
      },
      ...(item.applicationStatus !== 'APPLIED' ? [{
        title: `Status Changed to ${item.applicationStatus}`,
        desc: `Application transitioned to ${item.applicationStatus}`,
        time: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-GB') : 'Recent'
      }] : [])
    ],
  }));

  const allCount = currentList.length;
  const appliedCount = currentList.filter(app => app.status === 'APPLIED').length;
  const shortlistedCount = currentList.filter(app => app.status === 'SHORTLISTED').length;
  const interviewCount = currentList.filter(app => ['INTERVIEW', 'INTERVIEWING', 'SHORTLISTED'].includes(app.status)).length;
  const rejectedCount = currentList.filter(app => app.status === 'REJECTED').length;

  const [selectedAppId, setSelectedAppId] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [activeDetailTab, setActiveDetailTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  // Filtered applications based on top status tabs and search
  const filteredApps = currentList.filter((app) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'APPLIED' && app.status === 'APPLIED') ||
      (activeTab === 'SHORTLISTED' && app.status === 'SHORTLISTED') ||
      (activeTab === 'INTERVIEW' && ['INTERVIEW', 'INTERVIEWING', 'SHORTLISTED'].includes(app.status)) ||
      (activeTab === 'REJECTED' && app.status === 'REJECTED');

    const matchesSearch =
      app.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidate.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const selectedApp = currentList.find((a) => a.id === selectedAppId) || filteredApps[0] || currentList[0];


  const handleStatusChange = (newStatus) => {
    if (!selectedApp) return;
    updateStatus(
      { id: selectedApp.rawId, status: newStatus },
      {
        onSuccess: () => toast.success(`Status updated to ${newStatus}`),
        onError: () => toast.error('Failed to update status'),
      }
    );
  };

  const handleSchedulingChange = (newStatus) => {
    toast.error('Scheduling status is managed automatically by the interview scheduler.');
  };

  const handleOpenResume = () => {
    if (!selectedApp || !selectedApp.resumeUrl) {
      toast.error('Resume URL not found');
      return;
    }
    const url = selectedApp.resumeUrl.startsWith('http')
      ? selectedApp.resumeUrl
      : `http://localhost:8080${selectedApp.resumeUrl.startsWith('/') ? '' : '/'}${selectedApp.resumeUrl}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };



  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Applications</h1>
          <p className="text-xs text-white/50 mt-0.5">Review and manage all applications.</p>
        </div>


      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 border-b border-white/5">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'ALL'
              ? 'bg-[#6C4F91] text-white shadow-md shadow-[#6C4F91]/20'
              : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
            }`}
        >
          <span>All</span>
          <span className="px-1.5 py-0.2 bg-white/20 text-white rounded text-[10px] font-bold">{allCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('APPLIED')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'APPLIED'
              ? 'bg-[#6C4F91] text-white shadow-md shadow-[#6C4F91]/20'
              : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
            }`}
        >
          <span>Applied</span>
          <span className="px-1.5 py-0.2 bg-white/10 text-white/70 rounded text-[10px] font-bold">{appliedCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('SHORTLISTED')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'SHORTLISTED'
              ? 'bg-[#6C4F91] text-white shadow-md shadow-[#6C4F91]/20'
              : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
            }`}
        >
          <span>Shortlisted</span>
          <span className="px-1.5 py-0.2 bg-white/10 text-white/70 rounded text-[10px] font-bold">{shortlistedCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('INTERVIEW')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'INTERVIEW'
              ? 'bg-[#6C4F91] text-white shadow-md shadow-[#6C4F91]/20'
              : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
            }`}
        >
          <span>Interview</span>
          <span className="px-1.5 py-0.2 bg-white/10 text-white/70 rounded text-[10px] font-bold">{interviewCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'REJECTED'
              ? 'bg-[#6C4F91] text-white shadow-md shadow-[#6C4F91]/20'
              : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
            }`}
        >
          <span>Rejected</span>
          <span className="px-1.5 py-0.2 bg-white/10 text-white/70 rounded text-[10px] font-bold">{rejectedCount}</span>
        </button>
      </div>

      {/* Main Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: List of Applications (4 cols or full on mobile) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Controls: Search, Filters & Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate, job..."
                className="w-full h-9 pl-9 pr-3 bg-[#130f1c] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#6C4F91] transition-all"
              />
            </div>

            <button
              onClick={() => toast('Filter options toggled')}
              className="px-3 h-9 rounded-xl bg-[#130f1c] border border-white/10 text-xs text-white/80 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-white/60" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-white/50 px-1 pt-1">
            <div className="flex items-center gap-1">
              <span>Sort by:</span>
              <button
                onClick={() => setSortBy(sortBy === 'Newest' ? 'Oldest' : 'Newest')}
                className="text-white/80 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>{sortBy}</span>
                <ChevronDown className="w-3 h-3 text-white/50" />
              </button>
            </div>

            <button
              onClick={() => toast('Display options')}
              className="p-1 rounded text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Cards List Container */}
          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-0.5 custom-scrollbar">
            {filteredApps.map((app) => {
              const isSelected = selectedApp?.id === app.id;

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer group relative ${isSelected
                      ? 'bg-[#181126] border-[#6C4F91] ring-1 ring-[#6C4F91]/50 shadow-lg'
                      : 'bg-[#120e1a] border-white/10 hover:border-white/20 hover:bg-[#161122]'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full ${app.candidate.color || 'bg-purple-800'
                          } text-white font-bold text-xs flex items-center justify-center shrink-0 border border-white/10`}
                      >
                        {app.candidate.avatar}
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-xs font-bold text-white group-hover:text-[#c084fc] transition-colors">
                          {app.candidate.name}
                        </h3>
                        <p className="text-[11px] text-white/60 font-medium mt-0.5">
                          {app.jobRole}
                        </p>
                        <p className="text-[10px] text-white/40 mt-1">
                          Applied on {app.appliedOn}
                        </p>
                      </div>
                    </div>

                    {/* Status badges right */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${app.statusBg}`}
                      >
                        {app.status}
                      </span>

                      {app.schedulingStatus === 'INTERVIEW SCHEDULED' && (
                        <span className="text-[9px] font-semibold text-[#c084fc]">
                          Interview Scheduled
                        </span>
                      )}

                      <ChevronRight className={`w-3.5 h-3.5 mt-1 transition-transform ${isSelected ? 'text-[#c084fc] translate-x-0.5' : 'text-white/20 group-hover:text-white/50'}`} />
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredApps.length === 0 && (
              <div className="p-8 text-center bg-[#120e1a] border border-white/10 rounded-2xl">
                <p className="text-xs text-white/50">No applications match your search criteria.</p>
              </div>
            )}
          </div>

          {/* Left List Pagination Footer */}
          <div className="p-3 bg-[#120e1a] border border-white/10 rounded-xl flex items-center justify-center gap-1.5 text-xs text-white/60">
            <button className="p-1 rounded hover:bg-white/5 text-white/40 transition-colors cursor-pointer disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-6 h-6 rounded bg-[#7c3aed] text-white font-bold text-[11px] flex items-center justify-center">
              1
            </button>
            <button className="w-6 h-6 rounded hover:bg-white/5 text-white/60 font-medium text-[11px] flex items-center justify-center cursor-pointer">
              2
            </button>
            <button className="w-6 h-6 rounded hover:bg-white/5 text-white/60 font-medium text-[11px] flex items-center justify-center cursor-pointer">
              3
            </button>
            <span className="text-white/30 text-[10px]">...</span>
            <button className="w-6 h-6 rounded hover:bg-white/5 text-white/60 font-medium text-[11px] flex items-center justify-center cursor-pointer">
              21
            </button>
            <button className="p-1 rounded hover:bg-white/5 text-white/60 transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Application Information Panel (8 cols) */}
        {selectedApp ? (
          <div className="lg:col-span-8 bg-[#120e1a] border border-white/10 rounded-2xl p-5 space-y-5 shadow-2xl">
            {/* Navigation back header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <button
                onClick={() => toast('Navigated back to list view')}
                className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#c084fc]" />
                <span>Back to Applications</span>
              </button>
            </div>

            {/* Candidate Header Summary */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#6C4F91] text-white font-bold text-lg flex items-center justify-center shrink-0 border-2 border-white/10 shadow-lg">
                {selectedApp.candidate.avatar}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {selectedApp.candidate.name}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${selectedApp.statusBg}`}
                  >
                    {selectedApp.status}
                  </span>
                </div>

                <p className="text-xs font-medium text-white/70">
                  Applied for <span className="text-white font-semibold">{selectedApp.jobRole}</span>
                </p>

                <div className="flex items-center gap-2 text-[11px] text-white/40 flex-wrap">
                  <span>Applied on {selectedApp.appliedOn}</span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    Application ID: <span className="font-mono text-white/60">{selectedApp.applicationId}</span>
                    <ExternalLink className="w-3 h-3 text-white/30 cursor-pointer hover:text-white" />
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-Tabs: Overview, Documents */}
            <div className="flex items-center gap-6 border-b border-white/10 text-xs font-semibold">
              <button
                onClick={() => setActiveDetailTab('Overview')}
                className={`pb-2.5 relative transition-colors cursor-pointer ${activeDetailTab === 'Overview'
                    ? 'text-white border-b-2 border-[#7c3aed]'
                    : 'text-white/50 hover:text-white'
                  }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveDetailTab('Documents')}
                className={`pb-2.5 relative transition-colors cursor-pointer ${activeDetailTab === 'Documents'
                    ? 'text-white border-b-2 border-[#7c3aed]'
                    : 'text-white/50 hover:text-white'
                  }`}
              >
                Documents
              </button>
            </div>

            {/* Overview Tab Content */}
            {activeDetailTab === 'Overview' && (
              <div className="space-y-4">
                {/* Row 1: Application Status & Job Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Application Status Card */}
                  <div className="p-4 rounded-xl bg-[#171224] border border-white/10 space-y-3.5">
                    <h3 className="text-xs font-bold text-white tracking-wide">Application Status</h3>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 font-medium">Application Status</span>
                        <select
                          value={selectedApp.status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="bg-[#231a38] text-emerald-400 border border-[#6C4F91]/40 rounded-lg px-2.5 py-1 font-bold text-[10px] tracking-wider focus:outline-none cursor-pointer uppercase"
                        >
                          <option value="APPLIED">APPLIED</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="INTERVIEW">INTERVIEW</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-white/50 font-medium">Scheduling Status</span>
                        <select
                          value={selectedApp.schedulingStatus}
                          onChange={(e) => handleSchedulingChange(e.target.value)}
                          className="bg-[#231a38] text-purple-300 border border-[#6C4F91]/40 rounded-lg px-2.5 py-1 font-bold text-[10px] tracking-wider focus:outline-none cursor-pointer uppercase"
                        >
                          <option value="NOT SCHEDULED">NOT SCHEDULED</option>
                          <option value="INTERVIEW SCHEDULED">INTERVIEW SCHEDULED</option>
                          <option value="INTERVIEW IN PROGRESS">INTERVIEW IN PROGRESS</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-white/50 font-medium">Interview</span>
                        <button
                          onClick={() => toast(`Opening live interview session for ${selectedApp.candidate.name}`)}
                          className="text-[#c084fc] hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Interview</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Job Details Card */}
                  <div className="p-4 rounded-xl bg-[#171224] border border-white/10 space-y-3.5">
                    <h3 className="text-xs font-bold text-white tracking-wide">Job Details</h3>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 font-medium">Job Title</span>
                        <span className="text-white font-semibold">{selectedApp.jobRole}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-white/50 font-medium">Department</span>
                        <span className="text-white font-semibold">{selectedApp.department || 'Engineering'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-white/50 font-medium">Experience Level</span>
                        <span className="text-white font-semibold">{selectedApp.experience || 'Junior'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-white/50 font-medium">Job Type</span>
                        <span className="text-white font-semibold">{selectedApp.jobType || 'Full Time'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Candidate Information, Resume & Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Candidate Information Box */}
                  <div className="p-4 rounded-xl bg-[#171224] border border-white/10 space-y-3">
                    <h3 className="text-xs font-bold text-white tracking-wide">Candidate Information</h3>

                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-white/50 font-medium">Email</span>
                        <span className="text-white font-semibold truncate">{selectedApp.candidate.email}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-white/50 font-medium">Phone</span>
                        <span className="text-white font-semibold">{selectedApp.candidate.phone}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-white/50 font-medium">Current Location</span>
                        <span className="text-white font-semibold">{selectedApp.candidate.location}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-white/50 font-medium">Years of Experience</span>
                        <span className="text-white font-semibold">{selectedApp.experienceYears} Years</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-white/50 font-medium">Notice Period</span>
                        <span className="text-white font-semibold">{selectedApp.noticePeriod}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-white/50 font-medium">Expected Salary</span>
                        <span className="text-white font-semibold">{selectedApp.expectedSalary}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-white/50 font-medium">Portfolio Links</span>
                        <span className="text-white font-semibold truncate">
                          {selectedApp.portfolioLinks.length > 0 ? selectedApp.portfolioLinks.join(', ') : 'N/A'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                        <span className="text-white/50 font-medium">Cover Letter</span>
                        <span className="text-white font-medium italic truncate">{selectedApp.coverLetter}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-white/50 font-medium">Message</span>
                        <span className="text-white font-medium">N/A</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column inside Row 2: Resume & Quick Actions */}
                  <div className="space-y-4">
                    {/* Resume Card */}
                    <div className="p-4 rounded-xl bg-[#171224] border border-white/10 space-y-3">
                      <h3 className="text-xs font-bold text-white tracking-wide">Resume</h3>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#201830] border border-white/5">
                        <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">
                            {selectedApp.resumeName}
                          </p>
                          <p className="text-[10px] text-white/40 mt-0.5">
                            PDF • {selectedApp.resumeSize}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleOpenResume}
                        className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-white/70" />
                        <span>View Resume</span>
                        <ExternalLink className="w-3 h-3 text-white/50" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab Content */}
            {activeDetailTab === 'Documents' && (
              <div className="p-6 text-center space-y-3 bg-[#171224] rounded-xl border border-white/10">
                <FileText className="w-8 h-8 text-[#c084fc] mx-auto" />
                <h3 className="text-sm font-bold text-white">Attached Application Documents</h3>
                <p className="text-xs text-white/50 max-w-md mx-auto">
                  Candidate uploaded 1 primary resume file and 0 additional portfolio attachments.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={handleOpenResume}
                    className="px-4 py-2 bg-[#6C4F91] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {selectedApp.resumeName}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 bg-[#120e1a] border border-white/10 rounded-2xl p-12 text-center text-white/50 text-xs">
            Select an application from the left list to view details.
          </div>
        )}
      </div>
    </div>
  );
}
