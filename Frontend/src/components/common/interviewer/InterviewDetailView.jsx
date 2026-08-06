import React, { useState } from 'react';
import {
  ArrowLeft,
  Video,
  Calendar,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Briefcase,
  Building,
  Tag,
  Check,
  Paperclip,
  Share2,
  XCircle,
  Download,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Link2,
  MapPin,
  DollarSign,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function InterviewDetailView({ interview, onBack }) {
  const [noteText, setNoteText] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(true);


  if (!interview) return null;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) {
      toast.error('Please enter a note before saving');
      return;
    }
    toast.success('Interview note saved successfully');
    setNoteText('');
  };

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

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Back Button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#c084fc] hover:text-[#d8b4fe] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Interviews</span>
        </button>
      </div>

      {/* Main Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Interview with {interview.candidate.name}
            </h1>
            {getStatusBadge(interview.status)}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-white/60 mt-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#c084fc]" />
              <span>{interview.jobRole}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-white/40" />
              <span>{interview.candidate.company}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-white/40" />
              <span>Application ID: {interview.applicationId}</span>
            </div>
          </div>
        </div>

        {/* Top Header Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => toast.success(`Launching video call room for ${interview.id}...`)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#6C4F91] hover:bg-[#5b3f7f] text-white text-[11px] font-bold transition-all shadow-lg shadow-[#6C4F91]/20 cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Join Interview</span>
          </button>

          <button
            onClick={() => toast('Opening rescheduling calendar')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#13111a] border border-white/10 hover:border-white/20 text-white/90 hover:text-white text-[11px] font-semibold transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-white/60" />
            <span>Reschedule</span>
          </button>

          <button
            onClick={() => toast('More interview settings')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#13111a] border border-white/10 hover:border-white/20 text-white/90 hover:text-white text-[11px] font-semibold transition-all cursor-pointer"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Main Two Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Interview Information */}
          <div className="bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white tracking-tight">Interview Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              {/* Row 1 */}
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/50">
                  <Tag className="w-3.5 h-3.5 text-white/40" />
                  <span>Interview ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{interview.id}</span>
                  <button
                    onClick={() => handleCopy(interview.id, 'Interview ID')}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    {copiedField === 'Interview ID' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/50">
                  <Tag className="w-3.5 h-3.5 text-white/40" />
                  <span>Status</span>
                </div>
                <div>{getStatusBadge(interview.status)}</div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/50">
                  <Calendar className="w-3.5 h-3.5 text-white/40" />
                  <span>Interview Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{interview.dateFull}</span>
                  <button
                    onClick={() => handleCopy(interview.dateFull, 'Interview Date')}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/50">
                  <Briefcase className="w-3.5 h-3.5 text-white/40" />
                  <span>Interview Type</span>
                </div>
                <span className="font-semibold text-white">{interview.interviewType}</span>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/50">
                  <Clock className="w-3.5 h-3.5 text-white/40" />
                  <span>Start Time</span>
                </div>
                <span className="font-mono font-semibold text-white">{interview.time}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/50">
                  <UserCheck className="w-3.5 h-3.5 text-white/40" />
                  <span>Match Score (You)</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">{interview.matchScore}</span>
              </div>

              {/* Row 4 */}
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/50">
                  <Clock className="w-3.5 h-3.5 text-white/40" />
                  <span>End Time</span>
                </div>
                <span className="font-mono font-semibold text-white">{interview.endTime}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/50">
                  <Calendar className="w-3.5 h-3.5 text-white/40" />
                  <span>Created At</span>
                </div>
                <span className="text-white/80">{interview.createdAt}</span>
              </div>

              {/* Row 5 */}
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/50">
                  <Clock className="w-3.5 h-3.5 text-white/40" />
                  <span>Duration</span>
                </div>
                <span className="font-semibold text-white">{interview.durationFull}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/50">
                  <Calendar className="w-3.5 h-3.5 text-white/40" />
                  <span>Last Updated</span>
                </div>
                <span className="text-white/80">{interview.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Interview Details & Agenda */}
          <div className="bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white tracking-tight">Interview Details</h2>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/60">Description / Agenda</label>
              <div className="p-4 rounded-xl bg-[#171422] border border-white/5 text-xs text-white/90 leading-relaxed font-sans">
                {interview.agenda}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs">
              <div>
                <span className="text-white/50 block mb-1">Interview Mode</span>
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Video className="w-4 h-4 text-[#c084fc]" />
                  <span>{interview.mode}</span>
                </div>
              </div>

              <div>
                <span className="text-white/50 block mb-1">Preparation Material</span>
                <button
                  onClick={() => toast.success('Downloading shared preparation resources...')}
                  className="flex items-center gap-1.5 text-[#c084fc] hover:text-[#d8b4fe] font-semibold transition-colors cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>View Shared Resources ({interview.resourcesCount})</span>
                </button>
              </div>

              <div>
                <span className="text-white/50 block mb-1">Platform</span>
                <span className="text-white font-semibold">{interview.platform}</span>
              </div>

              <div>
                <span className="text-white/50 block mb-1">Meeting Link</span>
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[#c084fc] hover:text-[#d8b4fe] font-mono font-medium truncate hover:underline transition-all"
                >
                  <span className="truncate">{interview.meetingLink}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Participants */}
          <div className="bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white tracking-tight">Participants</h2>

            <div className="space-y-4">
              {/* Candidate */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#171422] border border-white/5 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3b1d60] border border-[#7c3aed]/40 text-purple-200 font-bold text-xs flex items-center justify-center shrink-0">
                    {interview.candidate.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{interview.candidate.name}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase">
                        Candidate
                      </span>
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      {interview.candidate.email} • {interview.candidate.phone}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toast(`Opening candidate profile for ${interview.candidate.name}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#221e30] border border-white/10 hover:border-white/20 text-white text-[11px] font-semibold transition-all cursor-pointer"
                >
                  <span>View Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Interviewer */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#171422] border border-white/5 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5b21b6] border border-purple-400/40 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {interview.interviewer.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{interview.interviewer.name}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">
                        Interviewer
                      </span>
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5">
                      {interview.interviewer.email} • {interview.interviewer.phone}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toast('Viewing your interviewer profile')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#221e30] border border-white/10 hover:border-white/20 text-white text-[11px] font-semibold transition-all cursor-pointer"
                >
                  <span>View Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Notes */}
          <div className="bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight">Notes</h2>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add your notes about this interview..."
              rows={4}
              className="w-full bg-[#171422] border border-white/10 rounded-xl p-4 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#6C4F91] transition-colors resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-[#6C4F91] hover:bg-[#5b3f7f] text-white text-[11px] font-bold transition-all shadow-md shadow-[#6C4F91]/20 cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Candidate Details Sidebar Card */}
          <div className="bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">Candidate Details</h3>
              <button
                onClick={() => setShowApplicationDetails(!showApplicationDetails)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                title="Toggle Application Details"
              >
                {showApplicationDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#3b1d60] border border-[#7c3aed]/40 text-purple-200 font-bold text-sm flex items-center justify-center shrink-0">
                {interview.candidate.initials}
              </div>
              <div className="truncate">
                <div className="font-bold text-white text-sm truncate">{interview.candidate.name}</div>
                <div className="text-xs text-white/50 truncate">{interview.candidate.email}</div>
                <div className="text-xs text-white/50 font-mono mt-0.5">{interview.candidate.phone}</div>
              </div>
            </div>

            {/* Location & Experience badging */}
            <div className="flex items-center gap-3 text-[11px] text-white/60 pt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#c084fc]" />
                <span>{interview.application?.currentLocation || interview.candidate.location || 'India'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-white/40" />
                <span>{interview.candidate.experience}</span>
              </div>
            </div>

            {/* Expandable Application & Portfolio Details */}
            {showApplicationDetails && (
              <div className="space-y-4 pt-3 border-t border-white/8 text-xs animate-fade-in">
                {/* Resume Download Button */}
                {interview.application?.resumeUrl && (
                  <a
                    href={interview.application.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 font-bold text-xs transition-all shadow-md cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#c084fc]" />
                    <span>View Candidate Resume</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}

                {/* Application Stats Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px]">
                  <div>
                    <span className="text-white/40 block">Expected Salary</span>
                    <span className="font-semibold text-emerald-400">{interview.application?.expectedSalary || 'Negotiable'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Notice Period</span>
                    <span className="font-semibold text-white">{interview.application?.noticePeriod || 'Immediate'}</span>
                  </div>
                </div>

                {/* Portfolio Links */}
                {(interview.application?.portfolioLinks || []).length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-white/70 block uppercase tracking-wider">Portfolio & Platform URLs</span>
                    <div className="space-y-1.5">
                      {interview.application.portfolioLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg bg-[#181524] border border-white/5 hover:border-purple-500/40 text-white/80 hover:text-white transition-all group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="px-1.5 py-0.5 rounded bg-purple-950 text-[#c084fc] font-bold text-[9px] uppercase border border-purple-500/20">
                              {link.platform}
                            </span>
                            <span className="truncate text-xs group-hover:underline">{link.url}</span>
                          </div>
                          <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-purple-300 shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover Letter / Notes */}
                {interview.application?.coverLetter && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-white/70 block uppercase tracking-wider">Cover Letter</span>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/80 leading-relaxed max-h-28 overflow-y-auto font-sans italic">
                      "{interview.application.coverLetter}"
                    </div>
                  </div>
                )}

                {/* Required Skills */}
                {(interview.application?.requiredSkills || []).length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-white/70 block uppercase tracking-wider">Target Job Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {interview.application.requiredSkills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-purple-200 text-[10px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => toast(`Opening candidate profile for ${interview.candidate.name}`)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#181524] border border-white/10 hover:border-white/20 text-white text-[11px] font-semibold transition-all cursor-pointer"
            >
              <span>View Full Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>


          {/* Job Details Sidebar Card */}
          <div className="bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">Job Details</h3>
            <div className="space-y-3 text-[11px]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#c084fc]" />
                <span className="font-bold text-white text-xs">{interview.jobRole}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Building className="w-4 h-4 text-white/40" />
                <span>{interview.candidate.company}</span>
              </div>
              <div className="text-white/60">
                Experience: <span className="text-white font-semibold">{interview.candidate.experience}</span>
              </div>
              <div className="text-white/60">
                Job ID: <span className="font-mono text-white font-semibold">{interview.jobId}</span>
              </div>
            </div>

            <button
              onClick={() => toast(`Viewing job description for ${interview.jobRole}`)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#181524] border border-white/10 hover:border-white/20 text-white text-[11px] font-semibold transition-all cursor-pointer"
            >
              <span>View Job</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interview Summary Sidebar Card */}
          <div className="bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">Interview Summary</h3>

            <div className="space-y-3 text-[11px]">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-white/60">Match Score (You)</span>
                <span className="font-mono font-bold text-emerald-400">{interview.matchScore}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-white/60">Interview Type</span>
                <span className="font-semibold text-white">{interview.interviewType}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-white/60">Duration</span>
                <span className="font-semibold text-white">{interview.durationFull}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-white/60">Status</span>
                <div>{getStatusBadge(interview.status)}</div>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-white/60">Scheduling Status</span>
                <span className="px-2.5 py-1 rounded-md bg-[#3b1d60] text-[#c084fc] font-bold text-[9px] tracking-wider uppercase">
                  {interview.schedulingStatus}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-white/60">Application Status</span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold text-[9px] tracking-wider uppercase">
                  {interview.applicationStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Interview Timeline Card */}
          <div className="bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">Interview Timeline</h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-900/50">
              {interview.timeline.map((step, idx) => {
                const isLast = idx === interview.timeline.length - 1;
                return (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full ${
                        isLast
                          ? 'bg-[#c084fc] ring-4 ring-[#7c3aed]/30'
                          : 'bg-[#6C4F91]'
                      }`}
                    />
                    <div className="text-[11px] font-bold text-white">{step.title}</div>
                    <div className="text-[10px] text-white/50 font-mono mt-0.5">{step.date}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-[#110e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">Actions</h3>

            <div className="space-y-2">
              <button
                onClick={() => toast('Opening reschedule options')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#171422] border border-white/5 hover:border-white/15 text-left transition-all cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/20 text-[#c084fc] group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Reschedule Interview</div>
                  <div className="text-[9px] text-white/50">Change the date or time</div>
                </div>
              </button>

              <button
                onClick={() => toast.error('Cancelling interview request initiated')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#171422] border border-white/5 hover:border-rose-500/30 text-left transition-all cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/20 text-rose-400 group-hover:scale-105 transition-transform">
                  <XCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white group-hover:text-rose-300">Cancel Interview</div>
                  <div className="text-[9px] text-white/50">Cancel this interview</div>
                </div>
              </button>

              <button
                onClick={() => handleCopy(interview.meetingLink, 'Meeting Link')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#171422] border border-white/5 hover:border-white/15 text-left transition-all cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/20 text-[#c084fc] group-hover:scale-105 transition-transform">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Share Interview Link</div>
                  <div className="text-[9px] text-white/50">Copy and share the meeting link</div>
                </div>
              </button>

              <button
                onClick={() => toast.success('Calendar invite (.ics) downloaded')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#171422] border border-white/5 hover:border-white/15 text-left transition-all cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/20 text-[#c084fc] group-hover:scale-105 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Download Calendar Invite</div>
                  <div className="text-[9px] text-white/50">Save to your calendar</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
