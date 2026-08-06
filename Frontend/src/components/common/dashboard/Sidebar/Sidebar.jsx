import { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { sidebarItems } from './sidebarData';
import CodeTierLogo from '../../CodeTierLogo';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const [items, setItems] = useState(sidebarItems);

  const handleSelect = (id) => {
    if (setActiveTab) setActiveTab(id);
    setItems((prev) =>
      prev.map((item) => ({ ...item, active: item.id === id }))
    );
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
      <div className="p-3 flex-1 space-y-6 overflow-y-auto">
        <div>
          {!isCollapsed && (
            <div className="px-4 mb-3 text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold">
              MAIN
            </div>
          )}
          <div className="space-y-1.5">
            {items.map((item) => (
              <SidebarItem
                key={item.id}
                label={item.label}
                iconName={item.iconName}
                active={activeTab ? activeTab === item.id : item.active}
                isCollapsed={isCollapsed}
                onClick={() => handleSelect(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
