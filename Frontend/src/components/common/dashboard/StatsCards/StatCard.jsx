import { Briefcase, ShoppingBag, Ticket, UserCheck, TrendingUp } from 'lucide-react';

const iconMap = {
  Briefcase,
  ShoppingBag,
  Ticket,
  UserCheck,
};

export default function StatCard({ title, value, badge, badgeType, iconName }) {
  const IconComponent = iconMap[iconName] || Briefcase;

  return (
    <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 flex items-start justify-between shadow-xl relative overflow-hidden group hover:border-[#7C3AED]/40 transition-all">
      <div className="space-y-3">
        <div className="text-xs font-semibold text-purple-200/60 uppercase tracking-wider">{title}</div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl sm:text-4xl font-bold text-white font-mono tabular-nums tracking-tight">{value}</span>
          {badge && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                badgeType === 'active'
                  ? 'text-[#c084fc] bg-[#7C3AED]/20 border-[#7C3AED]/30'
                  : 'text-[#d8b4fe] bg-[#7C3AED]/15 border-[#7C3AED]/25'
              }`}
            >
              {badge}
              {badgeType === 'trend' && <TrendingUp className="w-3 h-3 inline" />}
            </span>
          )}
        </div>
      </div>

      <div className="w-12 h-12 rounded-xl bg-[#221634] border border-[#7C3AED]/30 flex items-center justify-center shrink-0 shadow-inner">
        <IconComponent className="w-5 h-5 text-[#eedcff]" />
      </div>
    </div>
  );
}
