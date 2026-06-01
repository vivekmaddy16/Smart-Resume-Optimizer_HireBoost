import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineX,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const MotionDiv = motion.div;
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/analyze';

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) throw new Error('Please enter your name');
        if (!email.trim()) throw new Error('Please enter your email');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        signup(name, email, password);
      } else {
        if (!email.trim()) throw new Error('Please enter your email');
        if (!password) throw new Error('Please enter your password');
        login(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 relative">
      {/* Ambient background orbs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl pointer-events-none" />

      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
            <img src="/logo.png" alt="HireBoost" className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <span className="font-display font-bold text-2xl text-charcoal-800">
              Hire<span className="gradient-text">Boost</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-charcoal-800 mb-2">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-charcoal-500 text-sm">
            {isSignup
              ? 'Join thousands of job seekers using AI-optimized resumes'
              : 'Sign in to continue optimizing your resume'}
          </p>
        </div>

        {/* Card */}
        <div className="warm-card p-8">
          {/* Tab Toggle */}
          <div className="flex rounded-2xl bg-warm-muted p-1 mb-7">
            <button
              onClick={() => !loading && setIsSignup(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                !isSignup
                  ? 'bg-white text-charcoal-800 shadow-card'
                  : 'text-charcoal-400 hover:text-charcoal-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => !loading && setIsSignup(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isSignup
                  ? 'bg-white text-charcoal-800 shadow-card'
                  : 'text-charcoal-400 hover:text-charcoal-600'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <MotionDiv
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-5"
              >
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
                  <span>⚠️ {error}</span>
                  <button onClick={() => setError('')} className="hover:text-red-800 transition-colors">
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isSignup && (
                <MotionDiv
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="input-field pl-12"
                      id="login-name"
                    />
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-12"
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 transition-colors"
                >
                  {showPassword
                    ? <HiOutlineEyeOff className="w-5 h-5" />
                    : <HiOutlineEye className="w-5 h-5" />
                  }
                </button>
              </div>
              {isSignup && (
                <p className="text-xs text-charcoal-400 mt-1.5">Must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-amber w-full py-3.5 text-base flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              id="login-submit"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Sign In'}
                  <HiOutlineArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-warm-border" />
            <span className="text-charcoal-400 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-warm-border" />
          </div>

          {/* Toggle */}
          <p className="text-center text-sm text-charcoal-500">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={toggleMode}
              className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              {isSignup ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-charcoal-400">
          <div className="flex items-center gap-1.5 text-xs">
            <HiOutlineShieldCheck className="w-4 h-4 text-primary-500" />
            Secure & Private
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <HiOutlineSparkles className="w-4 h-4 text-amber-500" />
            1 Free Analysis
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}
