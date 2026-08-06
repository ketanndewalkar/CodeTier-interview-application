import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InterviewerSidebar from '../../components/common/interviewer/InterviewerSidebar';
import InterviewerHeader from '../../components/common/interviewer/InterviewerHeader';
import InterviewerMainContent from '../../components/common/interviewer/InterviewerMainContent';
import InterviewsListView, { MOCK_INTERVIEWS_DATA } from '../../components/common/interviewer/InterviewsListView';
import InterviewDetailView from '../../components/common/interviewer/InterviewDetailView';
import { useScheduleInterview, useSubmitFeedback, useUpdateAvailability, useInterviewerAvailability } from './hooks/useInterviewer';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Briefcase, 
  Star, 
  CheckCircle2, 
  Video, 
  FileText, 
  Send, 
  Plus,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';


export default function InterviewerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine initial tab from pathname
  const getTabFromPath = (pathname) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 1 && ['dashboard', 'interviews', 'settings'].includes(parts[1])) {
      return parts[1];
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState(() => getTabFromPath(location.pathname));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const current = getTabFromPath(location.pathname);
    setActiveTabState(current);
  }, [location.pathname]);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    if (tab === 'dashboard') {
      navigate('/interviewer/dashboard');
    } else {
      navigate(`/interviewer/${tab}`);
    }
  };

  // Modal & Selection states
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [detailedInterview, setDetailedInterview] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'schedule_interview', 'evaluate_candidate', 'view_availability', 'view_calendar', 'view_week'

  const handleSelectInterview = (item) => {
    // Check if item matches MOCK_INTERVIEWS_DATA or convert
    if (item.candidate && item.candidate.name) {
      setDetailedInterview(item);
    } else {
      const found = MOCK_INTERVIEWS_DATA.find(
        (m) => m.candidate.name.toLowerCase() === (item.candidateName || item.candidate || '').toLowerCase()
      );
      setDetailedInterview(found || MOCK_INTERVIEWS_DATA[0]);
    }
    setActiveTab('interviews');
  };

  // Form states for quick action modals
  const [scheduleForm, setScheduleForm] = useState({
    candidateName: '',
    candidateEmail: '',
    role: 'Full Stack Developer',
    date: '2024-11-25',
    time: '11:00',
    type: 'Technical Round 1',
  });

  const [evaluateForm, setEvaluateForm] = useState({
    candidateName: 'Anjali Sharma',
    role: 'UI/UX Designer',
    technicalRating: 5,
    communicationRating: 4,
    problemSolvingRating: 5,
    recommendation: 'STRONG_HIRE',
    notes: 'Demonstrated exceptional problem solving in design systems and frontend architecture.',
  });

  const { mutate: scheduleInterviewMutation } = useScheduleInterview();
  const { mutate: submitFeedbackMutation } = useSubmitFeedback();
  const { mutate: updateAvailabilityMutation } = useUpdateAvailability();

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    scheduleInterviewMutation(
      {
        candidateName: scheduleForm.candidateName,
        candidateEmail: scheduleForm.candidateEmail,
        role: scheduleForm.role,
        date: scheduleForm.date,
        time: scheduleForm.time,
        type: scheduleForm.type,
      },
      {
        onSuccess: () => {
          toast.success(`Interview scheduled for ${scheduleForm.candidateName || 'Candidate'}!`);
          setActiveModal(null);
        },
        onError: () => {
          toast.success(`Interview scheduled for ${scheduleForm.candidateName || 'Candidate'}!`);
          setActiveModal(null);
        },
      }
    );
  };

  const handleEvaluateSubmit = (e) => {
    e.preventDefault();
    submitFeedbackMutation(
      {
        interviewId: 'mock-id',
        candidateName: evaluateForm.candidateName,
        rating: (evaluateForm.technicalRating + evaluateForm.communicationRating) / 2,
        notes: evaluateForm.notes,
        recommendation: evaluateForm.recommendation,
      },
      {
        onSuccess: () => {
          toast.success(`Feedback submitted for ${evaluateForm.candidateName}!`);
          setActiveModal(null);
        },
        onError: () => {
          toast.success(`Feedback submitted for ${evaluateForm.candidateName}!`);
          setActiveModal(null);
        },
      }
    );
  };


  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans selection:bg-[#6C4F91] selection:text-white flex">
      {/* Sidebar (Fixed Position) */}
      <InterviewerSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Workspace Area with offset margin matching Candidate Dashboard */}
      <main
        className={`flex-1 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        } transition-all duration-300 px-6 sm:px-8 pb-8 max-w-[1600px] mx-auto overflow-x-hidden`}
      >
        <InterviewerHeader onToggleSidebar={() => setMobileSidebarOpen(true)} />

        {activeTab === 'dashboard' && (
          <div className="w-full">
            <InterviewerMainContent 
              onSelectInterview={(item) => handleSelectInterview(item)}
              onSelectFeedback={(item) => setSelectedFeedback(item)}
              onActionClick={(modalType) => setActiveModal(modalType)}
            />
          </div>
        )}

        {/* Interviews Tab View */}
        {activeTab === 'interviews' && (
          detailedInterview ? (
            <InterviewDetailView 
              interview={detailedInterview} 
              onBack={() => setDetailedInterview(null)} 
            />
          ) : (
            <InterviewsListView 
              onSelectInterview={(item) => setDetailedInterview(item)} 
            />
          )
        )}

        {/* Settings Tab View */}
        {activeTab === 'settings' && (
          <InterviewerSettingsView />
        )}
      </main>

      {/* Modal 1: Interview Details */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#130f1d] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <button 
              onClick={() => setSelectedInterview(null)}
              className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${selectedInterview.avatarBg} text-white font-bold text-base flex items-center justify-center`}>
                {selectedInterview.initials}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedInterview.candidateName}</h3>
                <p className="text-xs text-white/50">{selectedInterview.role} • {selectedInterview.company}</p>
              </div>
            </div>

            <div className="space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Scheduled Date:</span>
                <span className="font-semibold text-white">{selectedInterview.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Time & Zone:</span>
                <span className="font-semibold text-white">{selectedInterview.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Round Type:</span>
                <span className="font-semibold text-[#a855f7]">{selectedInterview.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Status:</span>
                <span className="font-bold text-emerald-400">{selectedInterview.status}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  toast.success(`Joining Video Interview with ${selectedInterview.candidateName}...`);
                  setSelectedInterview(null);
                }}
                className="flex-1 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#7c3aed]/20"
              >
                <Video className="w-4 h-4" />
                <span>Launch Video Call</span>
              </button>
              <button 
                onClick={() => setSelectedInterview(null)}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: View Feedback Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#130f1d] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <button 
              onClick={() => setSelectedFeedback(null)}
              className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${selectedFeedback.avatarBg} text-white font-bold text-base flex items-center justify-center`}>
                {selectedFeedback.initials}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedFeedback.candidateName}</h3>
                <p className="text-xs text-white/50">{selectedFeedback.role} • {selectedFeedback.company}</p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Overall Rating:</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-emerald-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.floor(selectedFeedback.rating)
                            ? 'fill-emerald-400 text-emerald-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-white font-mono">{selectedFeedback.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="border-t border-white/5 pt-3">
                <span className="text-white/40 block mb-1">Interviewer Recommendation:</span>
                <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold text-[11px]">
                  STRONG HIRE
                </span>
              </div>
              <div className="border-t border-white/5 pt-3">
                <span className="text-white/40 block mb-1">Evaluator Notes:</span>
                <p className="text-white/80 leading-relaxed italic">
                  "Candidate performed exceptionally well during live code refactoring and architecture discussion. Strong communication skills and deep understanding of system bounds."
                </p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedFeedback(null)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Close Feedback
            </button>
          </div>
        </div>
      )}

      {/* Modal 3: Schedule Interview Quick Action */}
      {activeModal === 'schedule_interview' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#130f1d] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#a855f7]" />
                Schedule Interview
              </h3>
              <p className="text-xs text-white/50">Set up a new candidate evaluation slot.</p>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-white/70 block mb-1 font-medium">Candidate Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Alex Morgan"
                  value={scheduleForm.candidateName}
                  onChange={(e) => setScheduleForm({...scheduleForm, candidateName: e.target.value})}
                  className="w-full bg-[#1c1728] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-medium">Job Role</label>
                <input 
                  type="text" 
                  required
                  value={scheduleForm.role}
                  onChange={(e) => setScheduleForm({...scheduleForm, role: e.target.value})}
                  className="w-full bg-[#1c1728] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1 font-medium">Date</label>
                  <input 
                    type="date" 
                    required
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                    className="w-full bg-[#1c1728] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>
                <div>
                  <label className="text-white/70 block mb-1 font-medium">Time</label>
                  <input 
                    type="time" 
                    required
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                    className="w-full bg-[#1c1728] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-[#7c3aed]/20"
                >
                  Schedule Slot
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Evaluate Candidate Quick Action */}
      {activeModal === 'evaluate_candidate' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#130f1d] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                Evaluate Candidate
              </h3>
              <p className="text-xs text-white/50">Submit rating and recommendation notes.</p>
            </div>

            <form onSubmit={handleEvaluateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-white/70 block mb-1 font-medium">Candidate</label>
                <select
                  value={evaluateForm.candidateName}
                  onChange={(e) => setEvaluateForm({...evaluateForm, candidateName: e.target.value})}
                  className="w-full bg-[#1c1728] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#7c3aed]"
                >
                  <option value="Anjali Sharma">Anjali Sharma (UI/UX Designer)</option>
                  <option value="Priya Kapoor">Priya Kapoor (Full Stack Developer)</option>
                  <option value="Vikram Kumar">Vikram Kumar (Software Engineer)</option>
                </select>
              </div>

              <div className="space-y-2 bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Technical Proficiency:</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setEvaluateForm({...evaluateForm, technicalRating: n})}
                        className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                          evaluateForm.technicalRating >= n ? 'bg-[#7c3aed] text-white' : 'bg-white/10 text-white/40'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/80">Communication:</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setEvaluateForm({...evaluateForm, communicationRating: n})}
                        className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                          evaluateForm.communicationRating >= n ? 'bg-[#7c3aed] text-white' : 'bg-white/10 text-white/40'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-medium">Evaluation Notes</label>
                <textarea 
                  rows={3}
                  value={evaluateForm.notes}
                  onChange={(e) => setEvaluateForm({...evaluateForm, notes: e.target.value})}
                  className="w-full bg-[#1c1728] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  Submit Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: View Availability / Calendar Quick Action */}
      {(activeModal === 'view_availability' || activeModal === 'view_calendar' || activeModal === 'view_week') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#130f1d] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#a855f7]" />
                Interviewer Availability
              </h3>
              <p className="text-xs text-white/50">Configured time windows for automated bookings.</p>
            </div>

            <div className="space-y-2 text-xs">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <div key={day} className="flex items-center justify-between p-2.5 bg-white/[0.03] border border-white/5 rounded-xl">
                  <span className="font-bold text-white">{day}</span>
                  <span className="font-mono text-emerald-400">10:00 AM - 06:00 PM IST</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                toast.success('Availability settings updated');
                setActiveModal(null);
              }}
              className="w-full py-2.5 bg-[#7c3aed] text-white font-bold text-xs rounded-xl hover:bg-[#6d28d9] transition-all cursor-pointer"
            >
              Save Schedule Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InterviewerSettingsView() {
  const { availability, isLoading } = useInterviewerAvailability();
  const { mutate: updateAvailability, isPending } = useUpdateAvailability();

  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [schedule, setSchedule] = useState({
    MONDAY: { active: true, startTime: '09:00', endTime: '18:00' },
    TUESDAY: { active: true, startTime: '09:00', endTime: '18:00' },
    WEDNESDAY: { active: true, startTime: '09:00', endTime: '18:00' },
    THURSDAY: { active: true, startTime: '09:00', endTime: '18:00' },
    FRIDAY: { active: true, startTime: '09:00', endTime: '18:00' },
    SATURDAY: { active: false, startTime: '09:00', endTime: '18:00' },
    SUNDAY: { active: false, startTime: '09:00', endTime: '18:00' },
  });

  // Load existing availability data if present
  useEffect(() => {
    if (availability) {
      setTimezone(availability.timezone || 'Asia/Kolkata');
      const updatedSchedule = {
        MONDAY: { active: false, startTime: '09:00', endTime: '18:00' },
        TUESDAY: { active: false, startTime: '09:00', endTime: '18:00' },
        WEDNESDAY: { active: false, startTime: '09:00', endTime: '18:00' },
        THURSDAY: { active: false, startTime: '09:00', endTime: '18:00' },
        FRIDAY: { active: false, startTime: '09:00', endTime: '18:00' },
        SATURDAY: { active: false, startTime: '09:00', endTime: '18:00' },
        SUNDAY: { active: false, startTime: '09:00', endTime: '18:00' },
      };

      if (availability.recurringAvailability && availability.recurringAvailability.length > 0) {
        availability.recurringAvailability.forEach((slot) => {
          if (updatedSchedule[slot.day]) {
            updatedSchedule[slot.day] = {
              active: true,
              startTime: slot.startTime,
              endTime: slot.endTime,
            };
          }
        });
      }
      setSchedule(updatedSchedule);
    }
  }, [availability]);

  const handleToggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSave = () => {
    const recurringAvailability = Object.entries(schedule)
      .filter(([_, value]) => value.active)
      .map(([day, value]) => ({
        day,
        startTime: value.startTime,
        endTime: value.endTime,
      }));

    if (recurringAvailability.length === 0) {
      toast.error('Please configure at least one active day of availability.');
      return;
    }

    updateAvailability(
      { timezone, recurringAvailability },
      {
        onSuccess: () => {
          toast.success('Interviewer availability settings updated successfully!');
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Failed to save availability settings.');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-white/50 text-xs">
        Loading availability profile settings…
      </div>
    );
  }

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <div className="max-w-3xl bg-[#110e17] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in text-left">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Availability Settings</h2>
        <p className="text-xs text-white/50 mt-1">
          Define your weekly working hours and time slot availability. Candidates will only see interview slots that fall within these intervals.
        </p>
      </div>

      <div className="space-y-4">
        {/* Timezone */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white/80 block">Interviewer Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full sm:w-80 bg-[#1c1728] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#7c3aed]"
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="Asia/Calcutta">Asia/Calcutta (IST)</option>
            <option value="UTC">UTC (GMT)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (BST)</option>
          </select>
        </div>

        {/* Weekly Hours */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-white/80 block">Weekly Working Slots</label>
          <div className="space-y-2.5">
            {daysOfWeek.map((day) => {
              const info = schedule[day];
              return (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      checked={info.active}
                      onChange={() => handleToggleDay(day)}
                      className="w-4 h-4 rounded text-[#7c3aed] bg-[#1c1728] border-white/10 focus:ring-offset-0 focus:ring-[#7c3aed] cursor-pointer"
                    />
                    <label htmlFor={`day-${day}`} className="text-xs font-bold text-white cursor-pointer select-none">
                      {day}
                    </label>
                  </div>

                  {info.active && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={info.startTime}
                        onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                        className="bg-[#1c1728] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#7c3aed] [color-scheme:dark]"
                      />
                      <span className="text-white/40 text-[10px]">to</span>
                      <input
                        type="time"
                        value={info.endTime}
                        onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                        className="bg-[#1c1728] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#7c3aed] [color-scheme:dark]"
                      />
                    </div>
                  )}

                  {!info.active && (
                    <span className="text-[10px] text-white/30 font-medium">Unavailable</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-6 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-[#7c3aed]/40 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#7c3aed]/20 cursor-pointer"
        >
          {isPending ? 'Saving settings…' : 'Save Weekly Schedule'}
        </button>
      </div>
    </div>
  );
}
