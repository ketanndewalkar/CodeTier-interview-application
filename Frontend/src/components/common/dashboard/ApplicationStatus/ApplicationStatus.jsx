import { ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  APPLIED:      '#7C3AED',
  SHORTLISTED:  '#10B981',
  HIRED:        '#3B82F6',
  REJECTED:     '#EF4444',
};

/**
 * Transforms the flat `applicationsByStatus` array from the API into the
 * shape the donut chart needs.
 */
function buildStatuses(apiBreakdown = []) {
  const total = apiBreakdown.reduce((s, { count }) => s + count, 0);
  if (total === 0) return { total: 0, statuses: [] };

  const statuses = apiBreakdown.map(({ status, count }) => ({
    name: status.charAt(0) + status.slice(1).toLowerCase(), // "APPLIED" → "Applied"
    value: count,
    percentage: total > 0 ? `${((count / total) * 100).toFixed(1)}%` : '0%',
    color: STATUS_COLORS[status] ?? '#6B7280',
  }));

  return { total, statuses };
}

// Skeleton shimmer for the donut area
function Skeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 pt-2 animate-pulse">
      <div className="w-44 h-44 rounded-full bg-white/5 shrink-0" />
      <div className="flex-1 w-full space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 bg-white/5 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export default function ApplicationStatus({ stats, isLoading }) {
  const { total, statuses } = buildStatuses(stats?.applicationsByStatus);

  return (
    <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
          Application Status
        </h3>
        <button className="flex items-center gap-1.5 bg-[#181322] border border-white/10 text-purple-200/80 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer">
          <span>All Time</span>
          <ChevronDown className="w-3.5 h-3.5 text-purple-200/50" />
        </button>
      </div>

      {isLoading ? (
        <Skeleton />
      ) : statuses.length === 0 ? (
        <p className="text-center text-purple-200/50 text-sm py-8">
          No applications yet.
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
          {/* Donut Chart */}
          <div className="relative w-44 h-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statuses}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {statuses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-3xl font-bold font-mono tabular-nums text-white leading-none">
                {total}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-purple-200/60 mt-1">
                Total
              </span>
            </div>
          </div>

          {/* Legend List */}
          <div className="flex-1 w-full space-y-3">
            {statuses.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-purple-200/80 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums">
                  <span className="text-white font-bold">{item.value}</span>
                  <span className="text-purple-200/50 text-[10px]">({item.percentage})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
