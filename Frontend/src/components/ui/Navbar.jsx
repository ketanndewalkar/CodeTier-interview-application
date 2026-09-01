import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import UserProfile from './UserProfile';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show at top of page
      if (currentScrollY <= 30) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 8) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 8) {
        // Scrolling up -> reveal navbar
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWorkflowClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      const element = document.getElementById('interview-lifecycle');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollToWorkflow: true } });
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-xs font-semibold tracking-wider uppercase transition-colors ${isActive
      ? 'text-[#eedcff] font-bold'
      : 'text-white/80 hover:text-[#eedcff]'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${isActive
      ? 'text-[#eedcff] font-bold bg-white/5 rounded-xl'
      : 'text-white/80 hover:text-[#eedcff]'
    }`;

  return (
    <header
      className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-full max-w-7xl px-3 sm:px-6 lg:px-12 z-50 transition-all duration-300 ease-in-out ${isVisible || mobileMenuOpen
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-12 opacity-0 pointer-events-none'
        }`}
    >
      <div className="backdrop-blur-xl border border-white/10 rounded-2xl h-14 px-4 sm:px-6 flex items-center justify-between shadow-2xl bg-white/10">

        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 rounded-full">
          <img
            src="/logo.png"
            alt="CodeTier logo"
            className="h-20 w-20 object-contain"
          />
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>
            HOME
          </NavLink>

          <a
            href="#interview-lifecycle"
            onClick={handleWorkflowClick}
            className="text-xs font-semibold text-white/80 hover:text-[#eedcff] transition-colors tracking-wider uppercase"
          >
            WORKFLOW
          </a>

          <NavLink to="/about" className={navLinkClass}>
            ABOUT
          </NavLink>
        </nav>

        {/* Right Section: Action Buttons / User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop User Profile / Auth Buttons */}
          <div className="hidden sm:flex items-center">
            <UserProfile />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white hover:text-[#eedcff] p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-[#0c0911]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-3">
          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            HOME
          </NavLink>
          <a
            href="#interview-lifecycle"
            onClick={handleWorkflowClick}
            className="px-3 py-2 text-xs font-semibold text-white/80 hover:text-[#eedcff] transition-colors uppercase tracking-wider"
          >
            WORKFLOW
          </a>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            ABOUT
          </NavLink>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 sm:hidden">
            <UserProfile isMobile />
          </div>
        </div>
      )}
    </header>
  );
}
