import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserStore } from '../../store/userStore';

export default function UserProfile({ isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, roleRoute, logout } = useUserStore();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleNavigateDashboard = () => {
    setIsOpen(false);
    if (user?.role && roleRoute[user.role]) {
      navigate(roleRoute[user.role]);
    } else {
      navigate('/dashboard');
    }
  };

  // If user is not logged in: Render Log In and Get Started buttons
  if (!user) {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={() => navigate('/login')}
            className="w-full text-center text-xs font-bold text-white py-2.5 border border-white/20 rounded-xl uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors"
          >
            LOG IN
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="w-full text-center text-xs font-bold text-white bg-[#6c4f91] hover:bg-[#6c4f91]/90 py-2.5 rounded-xl uppercase tracking-wider shadow-lg shadow-[#6c4f91]/20 cursor-pointer transition-colors"
          >
            GET STARTED
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/login')}
          className="text-[10px] font-bold text-white hover:text-[#eedcff] px-3 sm:px-4 py-2 border border-white/20 hover:border-white/40 rounded-md transition-colors uppercase tracking-wider cursor-pointer"
        >
          LOG IN
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="text-[10px] font-bold text-white bg-[#6c4f91] hover:bg-[#6c4f91]/90 px-3 sm:px-4 py-2 rounded-md transition-all uppercase tracking-wider shadow-lg shadow-[#6c4f91]/20 cursor-pointer"
        >
          GET STARTED
        </button>
      </div>
    );
  }

  // Display Username & Role badge
  const usernameDisplay = user.username ? `@${user.username}` : user.name || 'User';
  const roleLabel = user.role || 'CANDIDATE';

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 w-full pt-1">
        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6c4f91] to-[#2a1d3f] border border-[#c084fc]/30 flex items-center justify-center text-white shrink-0">
            <User className="w-4 h-4 text-[#eedcff]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{usernameDisplay}</h4>
            <p className="text-[10px] text-white/50 truncate">{user.email}</p>
          </div>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-[#6c4f91]/30 text-[#c084fc] border border-[#6c4f91]/40 shrink-0">
            {roleLabel}
          </span>
        </div>

        <button
          onClick={handleNavigateDashboard}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-white bg-[#6c4f91] py-2.5 rounded-xl uppercase tracking-wider shadow-lg shadow-[#6c4f91]/20 cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-400 border border-rose-500/20 bg-rose-500/10 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer hover:bg-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    );
  }

  // Desktop User Profile Component with Dropdown Menu
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 p-1.5 pl-2.5 pr-3 rounded-xl border transition-all cursor-pointer select-none ${
          isOpen
            ? 'bg-[#271842] border-[#6c4f91] ring-1 ring-[#6c4f91]'
            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
        }`}
      >
        {/* User Default Avatar Icon */}
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6c4f91] to-[#382352] border border-[#c084fc]/40 flex items-center justify-center text-white shadow-inner shrink-0">
          <User className="w-3.5 h-3.5 text-[#eedcff]" />
        </div>

        {/* Username */}
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-white tracking-tight max-w-[110px] truncate leading-tight">
            {usernameDisplay}
          </span>
          <span className="text-[9px] font-semibold text-[#c084fc] tracking-wider uppercase leading-tight">
            {roleLabel}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#120e1a] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl p-3 z-50 animate-fade-in divide-y divide-white/10">
          {/* Header User Info */}
          <div className="pb-3 px-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c4f91] to-[#2a1d3f] border border-[#c084fc]/40 flex items-center justify-center text-white shadow-lg shrink-0">
              <User className="w-5 h-5 text-[#eedcff]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{user.name || usernameDisplay}</h4>
              <p className="text-[11px] text-white/50 truncate">{usernameDisplay}</p>
              <div className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#6c4f91]/30 text-[#c084fc] border border-[#6c4f91]/40">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{roleLabel}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="py-2 space-y-1">
            <button
              onClick={handleNavigateDashboard}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
            >
              <LayoutDashboard className="w-4 h-4 text-[#c084fc]" />
              <span>Go to Dashboard</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
