import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  PanelLeftClose, 
  PanelLeftOpen,
  ChevronRight,
  Settings,
  LogOut
} from 'lucide-react';
import CodeTierLogo from '../CodeTierLogo';
import { useUserStore } from '../../../store/userStore';

export default function InterviewerSidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const userName = user?.name || 'Interviewer';
  const userRole = user?.role ? (user.role === 'INTERVIEWER' ? 'Interviewer' : user.role) : 'Senior Engineer';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'interviews', label: 'Interviews', icon: Video },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-[#09080d] border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-40 select-none transition-all duration-300 justify-between`}
    >
      <div>
        {/* Brand Header */}
        <div
          className={`h-20 ${
            isCollapsed ? 'px-3 justify-center gap-2' : 'px-6 justify-between'
          } flex items-center border-b border-white/5 shrink-0`}
        >
          <CodeTierLogo className={isCollapsed ? "h-7 w-auto max-w-[40px]" : "h-9 w-auto max-w-[140px]"} />

          <button

            onClick={() => setIsCollapsed && setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-white/70" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-white/40" />
            )}
          </button>
        </div>

        {/* Menu Sections */}
        <div className="p-3 space-y-6 overflow-y-auto">
          <div>
            {!isCollapsed && (
              <div className="px-4 mb-3 text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold">
                INTERVIEWER HUB
              </div>
            )}
            <div className="space-y-1.5">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3.5 py-2.5'
                    } rounded-xl text-[11px] font-semibold tracking-wide transition-all duration-200 cursor-pointer backdrop-blur-xl ${
                      isActive
                        ? 'bg-white/10 text-white border border-white/25 shadow-sm'
                        : 'text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/10 border border-transparent hover:border-white/15'
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        isActive ? 'text-[#c084fc]' : 'text-white/60 group-hover:text-white'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Card at Bottom */}
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
                <span className="text-[10px] text-white/50 truncate">{userRole}</span>
              </div>
            )}
          </div>
          {!isCollapsed && <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />}
        </div>

        <button
          onClick={() => logout()}
          className="w-full py-2 px-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-400 text-[11px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm animate-fade-in"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}


