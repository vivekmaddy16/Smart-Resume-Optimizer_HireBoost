import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const HeaderMotion = motion.header;
  const MenuMotion = motion.div;

  const links = [
    { to: '/', label: 'Home', icon: HiOutlineSparkles },
    { to: '/analyze', label: 'Analyze', icon: HiOutlineDocumentText },
    { to: '/multi-target', label: 'Multi-Target', icon: HiOutlineChartBar },
  ];

  return (
    <HeaderMotion
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-warm-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="HireBoost" className="w-9 h-9 group-hover:scale-105 transition-transform" />
            <span className="font-display font-bold text-xl text-charcoal-800">
              Hire<span className="gradient-text">Boost</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon }) => {
              const NavIcon = icon;
              const active = location.pathname === to;

              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-charcoal-500 hover:text-charcoal-800 hover:bg-charcoal-50'
                  }`}
                >
                  <NavIcon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/analyze" className="btn-amber text-sm py-2 px-5">
              Start Analysis
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-charcoal-500 hover:text-charcoal-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <MenuMotion
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-warm-border"
          >
            {links.map(({ to, label, icon }) => {
              const MobileIcon = icon;
              const active = location.pathname === to;

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-charcoal-500 hover:text-charcoal-800 hover:bg-charcoal-50'
                  }`}
                >
                  <MobileIcon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
            <div className="pt-3 px-4">
              <Link to="/analyze" onClick={() => setMobileOpen(false)} className="btn-amber block text-center text-sm">
                Start Analysis
              </Link>
            </div>
          </MenuMotion>
        )}
      </div>
    </HeaderMotion>
  );
}
