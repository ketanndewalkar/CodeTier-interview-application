import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';

const STATUS_COLORS = {
  SCHEDULED:   '#8B5CF6',
  COMPLETED:   '#10B981',
  CANCELLED:   '#EF4444',
  RESCHEDULED: '#F59E0B',
  IN_PROGRESS: '#3B82F6',
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

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-36 bg-white/5 rounded-xl" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <div className="h-3 w-20 bg-white/5 rounded-full" />
          <div className="h-3 w-6 bg-white/5 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function InterviewOverview({ stats, isLoading }) {
  // Build chart data from real API breakdown
  const chartData = (stats?.interviewsByStatus ?? []).map(({ status, count }) => ({
    status: status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' '),
    count,
    fill: STATUS_COLORS[status] ?? '#6B7280',
  }));

  const legend = (stats?.interviewsByStatus ?? []).map(({ status, count }) => ({
    name: status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' '),
    count,
    color: STATUS_COLORS[status] ?? '#6B7280',
  }));

  return (
    <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
          Interviews Overview
        </h3>
        <span className="text-xs text-purple-200/50 font-mono">All Time</span>
      </div>

      {isLoading ? (
        <Skeleton />
      ) : chartData.length === 0 ? (
        <p className="text-center text-purple-200/40 text-sm py-6">No interviews scheduled yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Bar Chart — real data */}
          <div className="md:col-span-8 h-36 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 6, right: 0, left: -25, bottom: 0 }} barGap={4}>
                <XAxis
                  dataKey="status"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#e9d5ff', opacity: 0.6, fontSize: 10 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#e9d5ff', opacity: 0.6, fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="count" radius={[5, 5, 0, 0]} maxBarSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend — live counts */}
          <div className="md:col-span-4 space-y-3 pl-2">
            {legend.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-purple-200/80 font-medium capitalize">{item.name}</span>
                </div>
                <span className="text-white font-bold font-mono tabular-nums">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
