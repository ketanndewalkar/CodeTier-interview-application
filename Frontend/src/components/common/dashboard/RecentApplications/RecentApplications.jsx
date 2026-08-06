import { ChevronRight, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_STYLE = {
  SHORTLISTED:  'bg-[#6C4F91]/25 text-[#d8b4fe] border border-[#6C4F91]/40',
  INTERVIEWING: 'bg-[#3b1d60]/40 text-[#c084fc] border border-[#6C4F91]/30',
  APPLIED:      'bg-white/10 text-white/80 border border-white/15',
  REJECTED:     'bg-[#ef4444]/20 text-[#fca5a5] border border-[#ef4444]/30',
  HIRED:        'bg-[#10b981]/20 text-[#6ee7b7] border border-[#10b981]/30',
};

function RowSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 shrink-0" />
          <div className="h-3 w-24 bg-white/5 rounded-full" />
        </div>
      </td>
      <td className="py-4 pr-4"><div className="h-3 w-32 bg-white/5 rounded-full" /></td>
      <td className="py-4 px-2"><div className="h-5 w-20 bg-white/5 rounded-full mx-auto" /></td>
      <td className="py-4 pr-2"><div className="h-3 w-20 bg-white/5 rounded-full" /></td>
      <td />
    </tr>
  ));
}

/** Generates a stable colour from any string (used as logo background fallback) */
function stringToHex(str = '') {
  const colours = ['#6C4F91', '#2563EB', '#0D9488', '#DC2626', '#7C3AED', '#D97706'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colours[Math.abs(hash) % colours.length];
}

export default function RecentApplications({ applications = [], isLoading }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
          Recent Applications
        </h3>
        <button
          onClick={() => navigate('/dashboard/applications')}
          className="flex items-center gap-1 bg-[#181322] border border-white/10 text-purple-200/80 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 text-purple-200/50" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-purple-200/50 uppercase font-mono tracking-wider text-[10px]">
              <th className="pb-3.5 font-semibold">Job</th>
              <th className="pb-3.5 font-semibold">Skills</th>
              <th className="pb-3.5 font-semibold text-center">Status</th>
              <th className="pb-3.5 font-semibold">Applied On</th>
              <th className="pb-3.5 font-semibold w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <RowSkeleton />
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-purple-200/40 text-sm">
                  No applications yet. Start applying!
                </td>
              </tr>
            ) : (
              applications.map((item) => {
                const job = item.jobOpeningId; // populated
                const title = job?.title ?? 'Unknown Position';
                const skills = (job?.requiredSkills ?? []).slice(0, 2).join(' • ');
                const initials = title.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
                const appliedOn = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })
                  : '—';
                const status = item.applicationStatus ?? 'APPLIED';

                return (
                  <tr key={item._id} className="hover:bg-white/[0.03] transition-colors">
                    {/* Job Title */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md"
                          style={{ backgroundColor: stringToHex(title) }}
                        >
                          {initials}
                        </div>
                        <span className="font-semibold text-white whitespace-nowrap">{title}</span>
                      </div>
                    </td>

                    {/* Skills */}
                    <td className="py-4 pr-4">
                      <span className="text-[11px] text-purple-200/60 font-mono">{skills || '—'}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-2 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider ${STATUS_STYLE[status] ?? STATUS_STYLE.APPLIED}`}
                      >
                        {status}
                      </span>
                    </td>

                    {/* Applied On */}
                    <td className="py-4 pr-2 font-mono tabular-nums text-purple-200/80 whitespace-nowrap">
                      {appliedOn}
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-right">
                      <button className="text-purple-200/50 hover:text-white transition-colors p-1 cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
