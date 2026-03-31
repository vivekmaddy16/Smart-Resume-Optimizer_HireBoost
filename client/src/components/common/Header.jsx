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
      className="sticky top-0 z-50 backdrop-blur-xl bg-dark-950/80 border-b border-dark-700/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-bg border border-accent-400/20 flex items-center justify-center shadow-lg shadow-black/20 group-hover:shadow-accent-500/15 transition-shadow">
              <HiOutlineSparkles className="w-5 h-5 text-dark-50" />
            </div>
            <span className="font-display font-bold text-xl text-dark-50">
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
                      ? 'bg-accent-500/10 text-accent-100 border border-accent-400/25'
                      : 'text-dark-400 hover:text-dark-50 hover:bg-dark-800/60'
                  }`}
                >
                  <NavIcon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/analyze" className="btn-primary text-sm py-2 px-5">
              Start Analysis
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-dark-400 hover:text-dark-50 transition-colors"
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
            className="md:hidden py-4 border-t border-dark-700/50"
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
                      ? 'bg-accent-500/10 text-accent-100 border border-accent-400/20'
                      : 'text-dark-300 hover:text-dark-50 hover:bg-dark-800/60'
                  }`}
                >
                  <MobileIcon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
            <div className="pt-3 px-4">
              <Link to="/analyze" onClick={() => setMobileOpen(false)} className="btn-primary block text-center text-sm">
                Start Analysis
              </Link>
            </div>
          </MenuMotion>
        )}
      </div>
    </HeaderMotion>
  );
}
