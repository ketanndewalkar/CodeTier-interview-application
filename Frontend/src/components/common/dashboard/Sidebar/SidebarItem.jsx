import { LayoutDashboard, Briefcase, FileText, Calendar, Users } from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  Users,
};

export default function SidebarItem({ label, iconName, active, onClick, isCollapsed }) {
  const IconComponent = iconMap[iconName] || LayoutDashboard;

  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center ${
        isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'
      } rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer backdrop-blur-xl ${
        active
          ? 'bg-white/10 text-white border border-white/25 shadow-sm'
          : 'text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/10 border border-transparent hover:border-white/15'
      }`}
    >
      <IconComponent
        className={`w-5 h-5 shrink-0 transition-colors ${
          active ? 'text-[#c084fc]' : 'text-white/60 group-hover:text-white'
        }`}
      />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
