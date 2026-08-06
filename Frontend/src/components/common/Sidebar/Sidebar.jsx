import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { sidebarItems } from './sidebarData';
import { useUserStore } from '../../../store/userStore';
import CodeTierLogo from '../../CodeTierLogo';

// Map sidebar item ids to their route paths under /dashboard
const tabPaths = {
  dashboard: '/dashboard',
  jobs: '/dashboard/jobs',
  applications: '/dashboard/applications',
  interviews: '/dashboard/interviews',
};

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const userName = user?.name || 'Candidate';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Derive active tab from current pathname
  const activeTab =
    Object.entries(tabPaths).find(([, path]) => pathname === path)?.[0] ??
    'dashboard';

  const handleSelect = (id) => {
    navigate(tabPaths[id] ?? '/dashboard');
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-[#09080d] border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-40 select-none transition-all duration-300`}
    >
      {/* Brand Header */}
      <div
        className={`h-20 ${
          isCollapsed ? 'px-3 justify-center' : 'px-6 justify-between'
        } flex items-center border-b border-white/5 shrink-0 overflow-hidden`}
      >
        <CodeTierLogo className={isCollapsed ? "h-7 w-auto max-w-[40px]" : "h-8 w-auto max-w-[140px]"} />
        <button
          onClick={() => setIsCollapsed && setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer shrink-0"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-white/70" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-white/40" />
          )}
        </button>
      </div>

      {/* Menu Sections */}
      <div className="p-3 flex-1 space-y-6 overflow-y-auto">
        <div>
          {!isCollapsed && (
            <div className="px-4 mb-3 text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold">
              MAIN
            </div>
          )}
          <div className="space-y-1.5">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.id}
                label={item.label}
                iconName={item.iconName}
                active={activeTab === item.id}
                isCollapsed={isCollapsed}
                onClick={() => handleSelect(item.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User Profile / Logout Footer */}
      <div className="p-3 border-t border-white/5 space-y-2 shrink-0">
        <div
          className={`flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'justify-between p-3'
          } rounded-xl bg-[#13111a] border border-white/10 hover:border-white/20 transition-all cursor-pointer`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#5b21b6] text-white font-bold text-xs flex items-center justify-center ring-2 ring-[#a855f7]/30 shrink-0">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left truncate">
                <span className="text-xs font-bold text-white leading-snug truncate">
                  {userName}
                </span>
                <span className="text-[10px] text-white/50 truncate">Candidate</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full py-2 px-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-400 text-[11px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
