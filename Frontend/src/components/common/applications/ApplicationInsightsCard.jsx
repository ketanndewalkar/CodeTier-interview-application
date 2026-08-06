import { Users, Briefcase, CheckCircle2, XCircle } from 'lucide-react';
import { applicationInsightsData } from '../../data/applicationsData';

const iconMap = {
  Users,
  Briefcase,
  CheckCircle2,
  XCircle,
};

export default function ApplicationInsightsCard() {
  return (
    <div className="bg-[#110e17] border border-white/12 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Title */}
      <h3 className="font-heading text-base font-bold text-white tracking-tight">
        Application Insights
      </h3>

      {/* Metrics List */}
      <div className="space-y-3">
        {applicationInsightsData.map((item) => {
          const IconComponent = iconMap[item.iconName] || Users;
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0 shadow-sm`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="space-y-0">
                <div className="text-base font-bold font-mono tabular-nums text-white leading-tight">
                  {item.value}
                </div>
                <div className="text-[11px] text-purple-200/60 font-medium">{item.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
