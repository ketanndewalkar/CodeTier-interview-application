import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { applicationStatusPieData } from '../../data/applicationsData';

export default function ApplicationStatusCard() {
  const total = applicationStatusPieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-[#110e17] border border-white/12 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Title */}
      <h3 className="font-heading text-base font-bold text-white tracking-tight">
        Application Status
      </h3>

      {/* Donut Chart with Center Text */}
      <div className="relative w-full h-[150px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={applicationStatusPieData}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={62}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {applicationStatusPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-bold font-mono tabular-nums text-white leading-none">
            {total}
          </span>
          <span className="text-[9px] uppercase font-mono tracking-wider text-purple-200/60 mt-0.5">
            Total
          </span>
        </div>
      </div>

      {/* Legend List */}
      <div className="space-y-2 pt-1">
        {applicationStatusPieData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-purple-200/80 font-medium text-[11px]">{item.name}</span>
            </div>
            <span className="text-white font-bold font-mono tabular-nums text-[11px]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
