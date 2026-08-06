import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Video, 
  Users, 
  PanelLeftClose,
  PanelLeftOpen,
  LogOut
} from 'lucide-react';
import CodeTierLogo from '../CodeTierLogo';
import { useUserStore } from '../../../store/userStore';

export default function OrgSidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const orgName = user?.name || 'Organization Portal';
  const initials = orgName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'interviews', label: 'Interviews', icon: Video },
    { id: 'candidates', label: 'Candidates', icon: Users },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-[#0d0a14] border-r border-white/10 flex flex-col justify-between transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding Header */}
      <div
        className={`h-20 ${
          isCollapsed ? 'px-3 justify-center' : 'px-6 justify-between'
        } flex items-center border-b border-white/5 shrink-0 overflow-hidden`}
      >
        <CodeTierLogo className={isCollapsed ? "h-7 w-auto max-w-[40px]" : "h-8 w-auto max-w-[140px]"} />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer shrink-0"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-white/70" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-white/40" />
          )}
        </button>
      </div>

      {/* Main Nav Section */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-white/40 uppercase">
              MAIN
            </div>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'
                  } rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/25 border border-purple-400/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/50'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile / Organization Footer */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {!isCollapsed ? (
          <>
            <div
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 transition-all"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-[#5b21b6] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div className="truncate text-left">
                  <div className="text-xs font-bold text-white truncate">
                    {orgName}
                  </div>
                  <div className="text-[10px] text-white/50 truncate">Plan: Enterprise</div>
                </div>
              </div>
            </div>


            <button
              onClick={() => logout()}
              className="w-full py-2 px-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-400 text-[11px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div
              className="w-9 h-9 rounded-lg bg-[#5b21b6] text-white font-bold text-xs flex items-center justify-center"
              title={`${orgName} - Enterprise Plan`}
            >
              {initials}
            </div>

            <button
              onClick={() => logout()}
              className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-400 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
