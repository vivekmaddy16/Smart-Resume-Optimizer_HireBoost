import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLightningBolt,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineStar,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isSubscribed } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const HeaderMotion = motion.header;
  const MenuMotion = motion.div;

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const links = [
    { to: '/', label: 'Home', icon: HiOutlineSparkles },
    { to: '/analyze', label: 'Analyze', icon: HiOutlineDocumentText },
    { to: '/multi-target', label: 'Multi-Target', icon: HiOutlineChartBar },
    { to: '/pricing', label: 'Pricing', icon: HiOutlineStar },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

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
            {user ? (
              /* User is logged in — show avatar & dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-charcoal-50 transition-colors"
                  id="user-menu-btn"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-primary-500 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-charcoal-800 leading-tight">{user.name}</div>
                    <div className="text-[10px] text-charcoal-400 leading-tight">
                      {isSubscribed ? '⚡ Pro Plan' : 'Free Plan'}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 warm-card p-2 shadow-warm-lg z-50"
                    >
                      {/* User info */}
                      <div className="px-3 py-2.5 border-b border-warm-border mb-1">
                        <div className="text-sm font-semibold text-charcoal-800">{user.name}</div>
                        <div className="text-xs text-charcoal-400 truncate">{user.email}</div>
                      </div>

                      {/* Plan badge */}
                      {isSubscribed ? (
                        <div className="mx-2 my-2 px-3 py-2 rounded-xl bg-primary-50 border border-primary-200">
                          <div className="text-xs font-semibold text-primary-700 flex items-center gap-1.5">
                            <HiOutlineLightningBolt className="w-3.5 h-3.5" />
                            Pro Plan Active ✨
                          </div>
                        </div>
                      ) : (
                        <Link
                          to="/pricing"
                          onClick={() => setUserMenuOpen(false)}
                          className="mx-2 my-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 block hover:bg-amber-100 transition-colors"
                        >
                          <div className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                            <HiOutlineStar className="w-3.5 h-3.5" />
                            Upgrade to Pro — ₹99/mo
                          </div>
                        </Link>
                      )}

                      {/* Actions */}
                      <Link
                        to="/pricing"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-charcoal-600 hover:bg-charcoal-50 transition-colors"
                      >
                        <HiOutlineStar className="w-4 h-4" />
                        Pricing
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full text-left transition-colors"
                        id="logout-btn"
                      >
                        <HiOutlineLogout className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Not logged in — show Login + Sign Up */
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-charcoal-500 hover:text-charcoal-800 px-4 py-2 rounded-xl hover:bg-charcoal-50 transition-all"
                >
                  Login
                </Link>
                <Link to="/login" className="btn-amber text-sm py-2 px-5">
                  Sign Up
                </Link>
              </>
            )}
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

            <div className="pt-3 px-4 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-primary-500 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-charcoal-800">{user.name}</div>
                      <div className="text-xs text-charcoal-400">
                        {isSubscribed ? '⚡ Pro Plan' : 'Free Plan'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-charcoal-600 hover:bg-charcoal-50 transition-colors"
                  >
                    <HiOutlineUser className="w-5 h-5" />
                    Login
                  </Link>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-amber block text-center text-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </MenuMotion>
        )}
      </div>
    </HeaderMotion>
  );
}
