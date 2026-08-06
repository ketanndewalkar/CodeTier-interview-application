import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

const STATUS_COLORS = {
  APPLIED:     '#8B5CF6',
  SHORTLISTED: '#10B981',
  REJECTED:    '#EF4444',
  HIRED:       '#3B82F6',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#181322] border border-white/10 rounded-xl p-3 text-xs shadow-2xl">
        <p className="text-white/60 font-mono mb-1">{label}</p>
        <p className="font-semibold" style={{ color: payload[0]?.payload?.fill ?? '#a855f7' }}>
          Count: {payload[0]?.value}
        </p>
      </div>
    );
  }
  return null;
};

function ChartSkeleton() {
  return (
    <div className="w-full h-56 animate-pulse flex items-end gap-4 px-4 pt-4">
      {[60, 90, 40, 70].map((h, i) => (
        <div key={i} className="flex-1 bg-white/5 rounded-t-lg" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

export default function ApplicationOverview({ stats, isLoading }) {
  // Build chart data from real API breakdown
  const chartData = (stats?.applicationsByStatus ?? []).map(({ status, count }) => ({
    status: status.charAt(0) + status.slice(1).toLowerCase(),
    count,
    fill: STATUS_COLORS[status] ?? '#6B7280',
  }));

  const summaryStats = [
    { label: 'Total',       count: stats?.totalApplications   ?? '—' },
    { label: 'Shortlisted', count: stats?.shortlisted         ?? '—' },
    { label: 'Interviews',  count: stats?.scheduledInterviews ?? '—' },
    { label: 'Hired',       count: stats?.hired               ?? '—' },
  ];

  return (
    <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
          Applications Overview
        </h3>
        <span className="text-xs text-purple-200/50 font-mono">All Time</span>
      </div>

      {/* Bar Chart — real data */}
      {isLoading ? (
        <ChartSkeleton />
      ) : chartData.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-purple-200/40 text-sm">
          No applications yet.
        </div>
      ) : (
        <div className="w-full h-56 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
              <XAxis
                dataKey="status"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#e9d5ff', opacity: 0.6, fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#e9d5ff', opacity: 0.6, fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-white/10">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-8 w-12 bg-white/5 rounded-lg" />
                <div className="h-3 w-24 bg-white/5 rounded-full" />
              </div>
            ))
          : summaryStats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">{stat.count}</div>
                <div className="text-xs text-purple-200/60 font-medium">{stat.label}</div>
              </div>
            ))}
      </div>
    </div>
  );
}
