import { useState, useEffect } from 'react';
import {
  X,
  Briefcase,
  Building2,
  CheckCircle2,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  Link2,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  AlertCircle,
  Edit3,
  Eye,
  BadgeCheck,
  Loader2,
  Calendar,
} from 'lucide-react';
import { useUpdateApplication } from '../../../pages/Candidate/hooks/useApplications';

const PLATFORM_OPTIONS = [
  'GITHUB',
  'LINKEDIN',
  'PORTFOLIO',
  'LEETCODE',
  'CODEFORCES',
  'CODECHEF',
  'HACKERRANK',
  'OTHER',
];

const STATUS_STYLES = {
  APPLIED:      { badge: 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300', dot: 'bg-emerald-400' },
  SHORTLISTED:  { badge: 'bg-purple-950/60 border-purple-800/50 text-purple-300',   dot: 'bg-purple-400' },
  INTERVIEWING: { badge: 'bg-indigo-950/60 border-indigo-800/50 text-indigo-300',   dot: 'bg-indigo-400' },
  REJECTED:     { badge: 'bg-rose-950/60 border-rose-800/50 text-rose-300',         dot: 'bg-rose-400' },
  HIRED:        { badge: 'bg-teal-950/60 border-teal-800/50 text-teal-300',         dot: 'bg-teal-400' },
};

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-white/8">
        <div className="p-1.5 rounded-md bg-purple-900/30 border border-purple-800/30 text-purple-300">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-xs font-semibold text-white/80 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-xs text-white/40 shrink-0 w-36">{label}</span>
      <span className="text-xs text-white/85 font-medium text-right">{value || '—'}</span>
    </div>
  );
}

function Badge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.APPLIED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export default function ApplicationDetailModal({ application, onClose }) {
  const isEditable = application?.applicationStatus === 'APPLIED';

  const [form, setForm] = useState({
    coverLetter: '',
    yearsOfExperience: '',
    expectedSalary: '',
    noticePeriod: '',
    currentLocation: '',
    message: '',
    portfolioLinks: [],
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const { mutate: updateApp, isPending } = useUpdateApplication();

  useEffect(() => {
    if (!application) return;
    setForm({
      coverLetter: application.coverLetter || '',
      yearsOfExperience: application.yearsOfExperience ?? '',
      expectedSalary: application.expectedSalary ?? '',
      noticePeriod: application.noticePeriod ?? '',
      currentLocation: application.currentLocation || '',
      message: application.message || '',
      portfolioLinks: (application.portfolioLinks || []).map((p) => ({ ...p })),
    });
    setSaveSuccess(false);
    setSaveError('');
  }, [application]);

  if (!application) return null;

  const jobTitle   = application.jobOpeningId?.title || 'Unknown Role';
  const company    = application.organizationId?.name || 'Unknown Company';
  const isVerified = application.organizationId?.isVerified;
  const status     = application.applicationStatus;
  const skills     = application.jobOpeningId?.requiredSkills || [];
  const logoText   = company.substring(0, 2).toUpperCase();
  const logoBg     = ['bg-rose-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600'][company.charCodeAt(0) % 5];

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addLink = () =>
    setForm((f) => ({ ...f, portfolioLinks: [...f.portfolioLinks, { platform: 'GITHUB', url: '' }] }));

  const removeLink = (i) =>
    setForm((f) => ({ ...f, portfolioLinks: f.portfolioLinks.filter((_, idx) => idx !== i) }));

  const updateLink = (i, key, val) =>
    setForm((f) => {
      const links = [...f.portfolioLinks];
      links[i] = { ...links[i], [key]: val };
      return { ...f, portfolioLinks: links };
    });

  const handleSave = () => {
    setSaveError('');
    setSaveSuccess(false);
    const payload = {
      coverLetter: form.coverLetter,
      message: form.message,
      currentLocation: form.currentLocation,
      yearsOfExperience: Number(form.yearsOfExperience) || 0,
      expectedSalary: form.expectedSalary !== '' ? Number(form.expectedSalary) : null,
      noticePeriod: Number(form.noticePeriod) || 0,
      portfolioLinks: form.portfolioLinks.filter((l) => l.url.trim()),
    };
    updateApp(
      { id: application._id, data: payload },
      {
        onSuccess: () => setSaveSuccess(true),
        onError: (err) => setSaveError(err?.response?.data?.message || 'Failed to save changes.'),
      }
    );
  };

  const inputCls =
    'w-full bg-[#0d0c10] border border-zinc-700/60 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-colors';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl scrollbar-thin"
        style={{ background: '#110e17' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 border-b border-white/8"
          style={{ background: '#110e17' }}
        >
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl ${logoBg} flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-lg`}>
              {logoText}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{jobTitle}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-purple-200/60">{company}</span>
                {isVerified && <BadgeCheck className="w-3.5 h-3.5 text-[#a855f7]" />}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Badge status={status} />
            {isEditable ? (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-violet-900/30 border border-violet-700/40 text-violet-300">
                <Edit3 className="w-3 h-3" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Editable</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800/60 border border-zinc-700/40 text-zinc-400">
                <Eye className="w-3 h-3" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Read-Only</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Body */}
        <div className="p-6 space-y-7">

          {/* Edit notice */}
          {isEditable && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-violet-950/40 border border-violet-700/30">
              <AlertCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <p className="text-xs text-violet-300/90 leading-relaxed">
                Your application is still <strong>under review</strong>. You can update the details below until the recruiter changes your status.
              </p>
            </div>
          )}

          {/* Job Details */}
          <Section icon={Briefcase} title="Job Details">
            <div className="divide-y divide-white/5">
              <InfoRow label="Position" value={jobTitle} />
              <InfoRow label="Company" value={company} />
              <InfoRow label="Applied On" value={fmtDate(application.createdAt)} />
              {application.jobOpeningId?.applicationDeadline && (
                <InfoRow label="Deadline" value={fmtDate(application.jobOpeningId.applicationDeadline)} />
              )}
              {application.jobOpeningId?.status && (
                <InfoRow label="Job Status" value={application.jobOpeningId.status} />
              )}
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-purple-950/50 border border-purple-800/30 text-purple-300">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </Section>

          {/* Resume */}
          {application.resumeUrl && (
            <Section icon={FileText} title="Resume">
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-xs font-medium text-white transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-purple-300" />
                View Resume
                <ExternalLink className="w-3 h-3 text-white/40" />
              </a>
              <p className="text-[11px] text-white/30 mt-1.5">Resume cannot be changed after submission.</p>
            </Section>
          )}

          {/* Application Details */}
          <Section icon={Building2} title="Application Details">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Years of Experience
                </label>
                {isEditable ? (
                  <input type="number" min={0} value={form.yearsOfExperience} onChange={(e) => setField('yearsOfExperience', e.target.value)} className={inputCls} placeholder="e.g. 2" />
                ) : (
                  <p className="text-xs text-white/85 font-medium py-2">{application.yearsOfExperience ?? '0'} yr(s)</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Expected Salary
                </label>
                {isEditable ? (
                  <input type="number" min={0} value={form.expectedSalary} onChange={(e) => setField('expectedSalary', e.target.value)} className={inputCls} placeholder="e.g. 600000" />
                ) : (
                  <p className="text-xs text-white/85 font-medium py-2">
                    {application.expectedSalary != null ? `₹ ${Number(application.expectedSalary).toLocaleString()}` : '—'}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Notice Period (days)
                </label>
                {isEditable ? (
                  <input type="number" min={0} value={form.noticePeriod} onChange={(e) => setField('noticePeriod', e.target.value)} className={inputCls} placeholder="e.g. 30" />
                ) : (
                  <p className="text-xs text-white/85 font-medium py-2">{application.noticePeriod ?? 0} days</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5 mt-2">
              <label className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Current Location
              </label>
              {isEditable ? (
                <input type="text" value={form.currentLocation} onChange={(e) => setField('currentLocation', e.target.value)} className={inputCls} placeholder="City, State" />
              ) : (
                <p className="text-xs text-white/85 font-medium py-2">{application.currentLocation || '—'}</p>
              )}
            </div>
          </Section>

          {/* Cover Letter */}
          <Section icon={FileText} title="Cover Letter">
            {isEditable ? (
              <textarea rows={5} value={form.coverLetter} onChange={(e) => setField('coverLetter', e.target.value)} className={`${inputCls} resize-none`} placeholder="Tell the recruiter why you're a great fit..." maxLength={3000} />
            ) : (
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/8 text-xs text-white/75 leading-relaxed whitespace-pre-wrap min-h-[80px]">
                {application.coverLetter || <span className="text-white/30 italic">No cover letter provided.</span>}
              </div>
            )}
          </Section>

          {/* Additional Message */}
          <Section icon={FileText} title="Additional Message">
            {isEditable ? (
              <textarea rows={3} value={form.message} onChange={(e) => setField('message', e.target.value)} className={`${inputCls} resize-none`} placeholder="Any additional notes for the recruiter..." maxLength={1000} />
            ) : (
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/8 text-xs text-white/75 leading-relaxed whitespace-pre-wrap min-h-[60px]">
                {application.message || <span className="text-white/30 italic">No message provided.</span>}
              </div>
            )}
          </Section>

          {/* Portfolio Links */}
          <Section icon={Link2} title="Portfolio Links">
            {isEditable ? (
              <div className="space-y-2">
                {form.portfolioLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      value={link.platform}
                      onChange={(e) => updateLink(i, 'platform', e.target.value)}
                      className="bg-[#0d0c10] border border-zinc-700/60 rounded-lg px-2 py-2 text-xs text-zinc-200 focus:outline-none focus:border-violet-500 [color-scheme:dark] w-32 shrink-0"
                    >
                      {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(i, 'url', e.target.value)}
                      placeholder="https://..."
                      className={`${inputCls} flex-1`}
                    />
                    <button type="button" onClick={() => removeLink(i)} className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addLink} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-xs transition-colors cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  Add link
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {(application.portfolioLinks || []).length === 0 ? (
                  <p className="text-xs text-white/30 italic">No portfolio links provided.</p>
                ) : (
                  application.portfolioLinks.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/8 hover:border-white/15 transition-colors group"
                    >
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/30 text-purple-300 shrink-0">
                        {link.platform}
                      </span>
                      <span className="text-xs text-white/60 group-hover:text-white/90 truncate transition-colors">{link.url}</span>
                      <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-white/60 shrink-0 ml-auto" />
                    </a>
                  ))
                )}
              </div>
            )}
          </Section>

          {/* Scheduling Status */}
          {application.schedulingStatus && application.schedulingStatus !== 'NOT_REQUIRED' && (
            <Section icon={Calendar} title="Scheduling Status">
              <span className="px-3 py-1 rounded-md text-[11px] font-semibold bg-indigo-950/50 border border-indigo-800/30 text-indigo-300">
                {application.schedulingStatus.replace(/_/g, ' ')}
              </span>
            </Section>
          )}

          {/* Save footer */}
          {isEditable && (
            <div className="pt-2 border-t border-white/8 space-y-3">
              {saveSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/50 border border-emerald-700/30 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Application updated successfully!
                </div>
              )}
              {saveError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/50 border border-rose-700/30 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {saveError}
                </div>
              )}
              <div className="flex items-center justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/10 text-xs font-medium text-white/60 hover:text-white hover:border-white/20 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed border border-violet-500 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {isPending ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
