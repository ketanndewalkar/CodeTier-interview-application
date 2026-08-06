import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSubmitAvailability } from '../../../pages/Candidate/hooks/useApplications';

export default function ApplicationsTable({ applications = [], onViewDetails }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowId, setExpandedRowId] = useState(null);

  // State to store submitted slots for each application
  const [submittedSlots, setSubmittedSlots] = useState({});

  // Local draft slots for the currently expanded application
  const [draftDate, setDraftDate] = useState('2024-11-21');
  const [draftTime, setDraftTime] = useState('10:00 AM - 11:00 AM');
  const [candidateSlots, setCandidateSlots] = useState({});

  const { mutate: submitAvailability, isPending } = useSubmitAvailability();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SHORTLISTED':
        return 'bg-purple-950/60 border border-purple-800/50 text-purple-300';
      case 'INTERVIEWING':
        return 'bg-indigo-950/60 border border-indigo-800/50 text-indigo-300';
      case 'APPLIED':
        return 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-300';
      case 'REJECTED':
        return 'bg-rose-950/60 border border-rose-800/50 text-rose-300';
      default:
        return 'bg-zinc-800 border border-zinc-700 text-zinc-300';
    }
  };

  const toggleRow = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleAddSlot = (appId) => {
    if (!draftDate || !draftTime) return;
    const newSlot = {
      id: Date.now().toString(),
      date: draftDate,
      time: draftTime,
    };
    setCandidateSlots((prev) => ({
      ...prev,
      [appId]: [...(prev[appId] || []), newSlot],
    }));
  };

  const handleRemoveSlot = (appId, slotId) => {
    setCandidateSlots((prev) => ({
      ...prev,
      [appId]: (prev[appId] || []).filter((s) => s.id !== slotId),
    }));
  };

  const parseSlots = (slots) => {
    return slots.map((s) => {
      const timeParts = s.time.split('-');
      const startTimeStr = timeParts[0]?.trim();
      const endTimeStr = timeParts[1]?.trim();

      const parseTime = (timeStr, baseDateStr) => {
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        let hours = 9;
        let minutes = 0;
        if (match) {
          hours = parseInt(match[1], 10);
          minutes = parseInt(match[2], 10);
          const ampm = match[3].toUpperCase();
          if (ampm === 'PM' && hours < 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
        }
        const d = new Date(baseDateStr);
        d.setHours(hours, minutes, 0, 0);
        return d;
      };

      const start = parseTime(startTimeStr || '09:00 AM', s.date);
      const end = parseTime(endTimeStr || '10:00 AM', s.date);

      return { start, end };
    });
  };

  const handleSubmitSlots = (appId) => {
    const slots = candidateSlots[appId] || [];
    if (slots.length === 0) {
      toast.error('Please add at least one availability slot.');
      return;
    }
    submitAvailability(
      { id: appId, timezone: 'Asia/Calcutta', slots: parseSlots(slots) },
      {
        onSuccess: () => {
          toast.success('Availability slots submitted successfully!');
          setSubmittedSlots((prev) => ({
            ...prev,
            [appId]: true,
          }));
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Failed to submit availability.');
        },
      }
    );
  };

  const availableTimeChips = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
  ];

  return (
    <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-purple-200/50 uppercase tracking-wider text-[10px] font-semibold">
              <th className="py-4 px-3 sm:px-4 text-center w-12 shrink-0">SR NO</th>
              <th className="py-4 px-4 sm:px-6 text-left min-w-[220px]">JOB & COMPANY</th>
              <th className="py-4 px-4 sm:px-6 text-left min-w-[130px]">STATUS</th>
              <th className="py-4 px-4 sm:px-6 text-left min-w-[120px]">APPLIED ON</th>
              <th className="py-4 px-4 sm:px-6 text-left min-w-[190px]">NEXT STEP</th>
              <th className="py-4 px-4 sm:px-6 text-right min-w-[150px]">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {applications.map((item, index) => {
              const appId = item._id;
              const isExpanded = expandedRowId === appId;
              const slots = candidateSlots[appId] || [];
              const status = item.applicationStatus;
              const schedulingStatus = item.schedulingStatus;
              const isSubmitted = submittedSlots[appId] || (schedulingStatus && schedulingStatus !== 'WAITING_FOR_AVAILABILITY');
              // Dropdown only opens for SHORTLISTED + awaiting availability
              const canExpand = status === 'SHORTLISTED' && schedulingStatus === 'WAITING_FOR_AVAILABILITY';
              const isShortlisted = canExpand; // alias kept for template reuse
              
              const jobTitle = item.jobOpeningId?.title || 'Unknown Role';
              const company = item.organizationId?.name || 'CodeTier';
              const isVerified = item.organizationId?.isVerified;
              
              const appliedOn = new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
              
              const nextStepTitle = status === 'APPLIED' ? 'Under Review' : 
                                     status === 'SHORTLISTED' ? 'Interview Scheduling' : 
                                     status === 'INTERVIEWING' ? 'Interview Process' : 
                                     status === 'REJECTED' ? 'Closed' : 'Reviewing';

              // Generate simple logo
              const logoText = company.substring(0, 2).toUpperCase();
              const logoColors = ['bg-rose-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600'];
              const logoBg = logoColors[company.charCodeAt(0) % logoColors.length];

              return (
                <tr key={appId} className="contents group">
                  {/* Main Row */}
                  <tr
                    onClick={() => canExpand && toggleRow(appId)}
                    className={`transition-colors ${
                      canExpand ? 'hover:bg-white/[0.04] cursor-pointer' : 'cursor-default'
                    } ${isExpanded ? 'bg-white/[0.02]' : ''}`}
                  >
                    {/* Sr No */}
                    <td className="py-5 px-3 sm:px-4 text-center font-mono text-purple-200/60 font-medium text-xs align-middle">
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    {/* Job & Company */}
                    <td className="py-5 px-4 sm:px-6 align-middle">
                      <div className="flex items-center gap-3.5">
                        {/* Logo */}
                        <div
                          className={`w-9 h-9 rounded-xl ${logoBg} flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md`}
                        >
                          {logoText}
                        </div>

                        {/* Job Title & Company Name */}
                        <div className="space-y-0.5">
                          <div className="font-semibold text-white text-xs sm:text-sm leading-snug whitespace-nowrap">
                            {jobTitle}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-purple-200/70 font-medium whitespace-nowrap">
                            <span>{company}</span>
                            {isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-white fill-[#a855f7] inline-block shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-5 px-4 sm:px-6 text-left align-middle">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap ${getStatusBadge(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    {/* Applied On */}
                    <td className="py-5 px-4 sm:px-6 text-left align-middle">
                      <span className="tabular-nums text-white/90 text-xs whitespace-nowrap font-medium">
                        {appliedOn}
                      </span>
                    </td>

                    {/* Next Step */}
                    <td className="py-5 px-4 sm:px-6 text-left align-middle">
                      <div className="space-y-1">
                        <div className="text-xs text-white/90 font-medium flex items-center gap-2 whitespace-nowrap">
                          <span>{nextStepTitle}</span>
                          {isShortlisted && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                              Slot Action
                            </span>
                          )}
                        </div>
                        {item.nextStepDate && (
                          <div className="flex items-center gap-1.5 text-[11px] tabular-nums text-purple-200/60 font-normal whitespace-nowrap">
                            <CalendarIcon className="w-3.5 h-3.5 text-purple-200/50 shrink-0" />
                            <span>{item.nextStepDate}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-4 sm:px-6 text-right align-middle">
                      <div
                        className="inline-flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onViewDetails && onViewDetails(item)}
                          className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-[#181322] hover:bg-[#251d33] hover:border-white/20 text-xs font-medium text-white transition-all cursor-pointer shadow-sm whitespace-nowrap"
                        >
                          View Details
                        </button>
                        {canExpand && (
                          <button
                            onClick={() => toggleRow(appId)}
                            className="p-1.5 text-purple-200/70 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10 border border-white/5 flex items-center justify-center gap-1 shrink-0"
                            title="Submit interview availability slots"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-purple-300" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Dropdown Content Row */}
                  {isExpanded && canExpand && (
                    <tr className="bg-[#121118] border-y border-zinc-800">
                      <td colSpan={6} className="p-5 sm:p-6">
                        <div className="space-y-6">
                          {/* Top Header inside dropdown */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                                <CalendarIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-zinc-100 flex items-center gap-2">
                                  <span>Interview Availability & Slot Request</span>
                                  {isShortlisted && (
                                    <span className="text-[10px] font-medium bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                                      Action Required
                                    </span>
                                  )}
                                </h4>
                                <p className="text-xs text-zinc-400 mt-0.5 font-normal">
                                  {isShortlisted
                                    ? `Select your preferred interview times for ${company}.`
                                    : `Application overview and interview slot tracking.`}
                                </p>
                              </div>
                            </div>

                            {/* Status Tag */}
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                              <span className="font-medium text-zinc-400">Status:</span>
                              <span
                                className={`px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${getStatusBadge(
                                  status
                                )}`}
                              >
                                {status}
                              </span>
                            </div>
                          </div>

                          {/* Calendar & Slot Picker Section */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            {/* Left side: Add New Slot Form (7/12) */}
                            <div className="md:col-span-7 bg-[#17161f] border border-zinc-800/80 rounded-lg p-4 sm:p-5 space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-zinc-200">
                                  Select Date & Time Slot
                                </label>
                              </div>

                              {/* Date Input with Calendar */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] text-zinc-400 font-medium block">
                                  Preferred Interview Date
                                </label>
                                <input
                                  type="date"
                                  value={draftDate}
                                  onChange={(e) => setDraftDate(e.target.value)}
                                  className="w-full bg-[#0d0c10] border border-zinc-700/60 rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors [color-scheme:dark]"
                                />
                              </div>

                              {/* Time Slots Quick Chips */}
                              <div className="space-y-2">
                                <label className="text-[11px] text-zinc-400 font-medium block">
                                  Time Slots
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {availableTimeChips.map((chip) => {
                                    const isSelected = draftTime === chip;
                                    return (
                                      <button
                                        key={chip}
                                        type="button"
                                        onClick={() => setDraftTime(chip)}
                                        className={`px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer border font-medium flex items-center gap-1.5 ${
                                          isSelected
                                            ? 'bg-violet-600 border-violet-500 text-white shadow-sm scale-[1.01]'
                                            : 'bg-[#0d0c10] border-zinc-700/60 text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-800/60'
                                        }`}
                                      >
                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                        <span>{chip}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Custom Time Slot Input fallback */}
                              <div className="space-y-1.5 pt-1">
                                <label className="text-[11px] text-zinc-400 font-medium block">
                                  Custom Time Slot
                                </label>
                                <div className="flex items-center gap-2">
                                  <div className="relative flex-1">
                                    <Clock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                      type="text"
                                      value={draftTime}
                                      onChange={(e) => setDraftTime(e.target.value)}
                                      placeholder="e.g. 10:00 AM - 11:00 AM"
                                      className="w-full bg-[#0d0c10] border border-zinc-700/60 rounded-md pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleAddSlot(appId)}
                                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Slot</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Right side: Selected Slots List & Submit (5/12) */}
                            <div className="md:col-span-5 bg-[#17161f] border border-zinc-800/90 rounded-lg p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg shadow-black/20">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                                  <span className="text-xs font-semibold text-zinc-100">
                                    Selected Slots ({slots.length})
                                  </span>
                                  {isSubmitted && (
                                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                                      <Check className="w-3.5 h-3.5" /> Submitted
                                    </span>
                                  )}
                                </div>

                                {slots.length === 0 ? (
                                  <div className="text-center py-6 text-zinc-500 text-xs font-normal">
                                    No interview slots added yet. Choose a date & time on the left.
                                  </div>
                                ) : (
                                  <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1 scrollbar-thin">
                                    {slots.map((s, i) => (
                                      <div
                                        key={s.id}
                                        className="flex items-center justify-between p-2.5 rounded-md bg-[#0d0c10] border border-zinc-800 text-xs"
                                      >
                                        <div className="space-y-0.5">
                                          <div className="text-zinc-200 font-medium flex items-center gap-1.5">
                                            <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>
                                              Slot {i + 1}: {s.date}
                                            </span>
                                          </div>
                                          <div className="text-[11px] text-zinc-400 pl-5 font-normal">
                                            {s.time}
                                          </div>
                                        </div>
                                        {!isSubmitted && (
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveSlot(appId, s.id)}
                                            className="text-zinc-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                                            title="Remove slot"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Submit Slots Action */}
                              <div className="pt-2">
                                {isSubmitted ? (
                                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-center space-y-1">
                                    <div className="text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5">
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>Slots Confirmed</span>
                                    </div>
                                    <p className="text-[11px] text-emerald-400/80 font-normal">
                                      The recruiting team will send a calendar invitation soon.
                                    </p>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={slots.length === 0}
                                    onClick={() => handleSubmitSlots(appId)}
                                    className={`w-full py-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                                      slots.length > 0
                                        ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-md cursor-pointer border border-violet-500'
                                        : 'bg-zinc-800/60 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                                    }`}
                                  >
                                    <Check className="w-4 h-4" />
                                    <span>Submit Available Slots</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/5">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="p-1.5 rounded-lg text-purple-200/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => setCurrentPage(1)}
          className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
            currentPage === 1
              ? 'bg-[#7C3AED] text-white shadow-md'
              : 'text-purple-200/60 hover:text-white hover:bg-white/5'
          }`}
        >
          1
        </button>

        <button
          onClick={() => setCurrentPage(2)}
          className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
            currentPage === 2
              ? 'bg-[#7C3AED] text-white shadow-md'
              : 'text-purple-200/60 hover:text-white hover:bg-white/5'
          }`}
        >
          2
        </button>

        <button
          onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
          className="p-1.5 rounded-lg text-purple-200/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


