import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plane, Globe, ChevronDown } from 'lucide-react';
import Button from './ui/Button';
import { NAV_LINKS } from '../constants/routes';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-out
        ${isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(10,22,40,0.1)] border-b border-gray-100/80'
          : 'bg-transparent'
        }
      `}
    >
      <div className="container-flyora">
        <div className="flex items-center justify-between h-20">
          {/* ─── Logo ──────────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group" id="flyora-logo">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flyora-teal to-flyora-teal-light flex items-center justify-center shadow-teal group-hover:shadow-[0_8px_25px_rgba(13,148,136,0.5)] transition-all duration-300">
                <Plane size={18} className="text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-flyora-blue rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`text-xl font-black tracking-tight transition-colors duration-300 ${isScrolled ? 'text-flyora-navy' : 'text-flyora-navy'}`}>
                fly<span className="text-flyora-teal">orago</span>
              </span>
              <span className="text-[9px] font-medium text-flyora-gray-500 tracking-widest uppercase">
                Ship Smarter
              </span>
            </div>
          </Link>

          {/* ─── Desktop Navigation ─────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1" id="desktop-nav">
            {NAV_LINKS.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-xl
                    transition-all duration-200 group
                    ${isActive
                      ? 'text-flyora-teal bg-flyora-teal/8'
                      : 'text-flyora-gray-600 hover:text-flyora-navy hover:bg-flyora-gray-50'
                    }
                  `}
                >
                  {link.label}
                  <span className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-flyora-teal rounded-full
                    transition-all duration-300
                    ${isActive ? 'w-4/5' : 'w-0 group-hover:w-2/3'}
                  `} />
                </Link>
              );
            })}
          </nav>

          {/* ─── Desktop CTA ────────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-sm font-medium text-flyora-gray-600 hover:text-flyora-navy transition-colors px-3 py-2 rounded-xl hover:bg-flyora-gray-50">
              <Globe size={15} />
              <span>EN</span>
              <ChevronDown size={13} />
            </button>
            <Link to="/login" className="text-sm font-semibold text-flyora-navy hover:text-flyora-teal transition-colors px-4 py-2 rounded-xl hover:bg-flyora-gray-50">
              Log In
            </Link>
            <Link to="/signup">
              <Button
                variant="teal"
                size="md"
                id="header-cta-btn"
                iconRight={<Plane size={14} className="-rotate-45" />}
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* ─── Mobile Menu Button ──────────────────────────────────────────── */}
          <button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-flyora-navy hover:bg-flyora-gray-50 transition-all"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            id="mobile-menu-toggle"
          >
            <span className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}>
              <X size={22} />
            </span>
            <span className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}>
              <Menu size={22} />
            </span>
          </button>
        </div>
      </div>

      {/* ─── Mobile Menu ──────────────────────────────────────────────────────── */}
      <div
        className={`
          lg:hidden overflow-hidden transition-all duration-400 ease-out
          ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
          bg-white/98 backdrop-blur-xl border-t border-gray-100
        `}
        id="mobile-menu"
      >
        <div className="container-flyora py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive 
                    ? 'text-flyora-teal bg-flyora-teal/5' 
                    : 'text-flyora-gray-700 hover:text-flyora-teal hover:bg-flyora-teal/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex flex-col gap-2 pt-3 pb-2 border-t border-flyora-gray-100 mt-2">
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-flyora-navy py-2 text-left px-4 hover:text-flyora-teal transition-colors">
              Log In
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button variant="teal" size="lg" fullWidth id="mobile-cta-btn">
                Get Started →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
