import { FileText, Bookmark, Calendar } from 'lucide-react';

export default function JobActivityPanel() {
  const activities = [
    { label: 'Applied Jobs', count: 450, icon: FileText, color: 'text-[#8B5CF6]' },
    { label: 'Saved Jobs', count: 28, icon: Bookmark, color: 'text-[#a855f7]' },
    { label: 'Interviews Scheduled', count: 35, icon: Calendar, color: 'text-[#c084fc]' },
  ];

  return (
    <div className="bg-[#110e17] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
      <h3 className="text-sm font-semibold text-white">Job Activity</h3>

      <div className="space-y-3">
        {activities.map((act, idx) => {
          const IconComponent = act.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#181322] border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#251a38] flex items-center justify-center shrink-0">
                  <IconComponent className={`w-4 h-4 ${act.color}`} />
                </div>
                <span className="text-xs text-white/70 font-medium">{act.label}</span>
              </div>
              <span className="text-sm font-bold font-mono text-white">{act.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
