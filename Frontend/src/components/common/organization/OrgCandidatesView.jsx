import React, { useState } from 'react';
import { Users, Search, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOrganizationApplications } from '../../../pages/organization/hooks/useOrganization';

export default function OrgCandidatesView() {
  const { applications: apiApps, isLoading, isError } = useOrganizationApplications();

  // Build unique candidates list from applications (deduplicate by candidateId)
  const seenIds = new Set();
  const candidates = [];

  (apiApps ?? []).forEach((app) => {
    const cid = app.candidateId?._id || app._id;
    if (!seenIds.has(cid)) {
      seenIds.add(cid);
      candidates.push({
        id: cid,
        name: app.candidateId?.name || 'Candidate',
        email: app.candidateId?.email || 'N/A',
        phone: app.candidateId?.phone || 'N/A',
        role: app.jobOpeningId?.title || 'Software Engineer',
        exp: app.yearsOfExperience != null ? `${app.yearsOfExperience} Years` : '—',
        status: app.applicationStatus || 'APPLIED',
        resumeUrl: app.resumeUrl,
      });
    }
  });

  const [search, setSearch] = useState('');

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s) => {
    switch (s) {
      case 'SHORTLISTED': return 'bg-[#2a1d3f] text-[#c084fc] border-[#7c3aed]/30';
      case 'HIRED': return 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30';
      case 'REJECTED': return 'bg-rose-950/70 text-rose-400 border-rose-500/30';
      default: return 'bg-blue-950/70 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Candidate Database</h1>
        <p className="text-xs text-white/50 mt-1">
          Cross-position talent profiles and resumes.
        </p>
      </div>

      <div className="bg-[#110e17] p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role or email…"
            className="w-full h-8 pl-9 pr-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#7c3aed]"
          />
        </div>
        <span className="text-xs text-white/40 shrink-0 ml-4">
          {isLoading ? '—' : `${filtered.length} candidates`}
        </span>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#c084fc] animate-spin" />
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-rose-400 text-sm py-10 justify-center">
          <AlertCircle className="w-4 h-4" />
          <span>Failed to load candidates.</span>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="py-16 text-center">
          <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No candidates found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-2xl bg-[#110e17] border border-white/10 hover:border-[#7c3aed]/40 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#5b21b6] text-white font-bold text-xs flex items-center justify-center">
                {c.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${statusColor(c.status)}`}
              >
                {c.status}
              </span>
            </div>

            <div>
              <div className="font-bold text-white text-sm">{c.name}</div>
              <div className="text-xs text-white/50">
                {c.role} • {c.exp}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">{c.email}</div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-white/5">
              {c.resumeUrl && (
                <a
                  href={c.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all text-center"
                >
                  Resume
                </a>
              )}
              <button
                onClick={() => toast(`Viewing full profile of ${c.name}`)}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all text-center cursor-pointer"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
