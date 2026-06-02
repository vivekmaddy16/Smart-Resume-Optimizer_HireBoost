import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineExternalLink,
  HiOutlineBadgeCheck,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const freePlanFeatures = [
  { label: '1 Resume Analysis', included: true },
  { label: 'ATS Score & Feedback', included: true },
  { label: 'Keyword Matching', included: true },
  { label: 'Multi-Job Compare', included: false },
  { label: 'LaTeX Export', included: false },
  { label: 'LinkedIn Import', included: false },
  { label: 'Unlimited Analyses', included: false },
  { label: 'Priority AI Processing', included: false },
];

const proPlanFeatures = [
  { label: 'Unlimited Resume Analyses', included: true },
  { label: 'ATS Score & Feedback', included: true },
  { label: 'Advanced Keyword Matching', included: true },
  { label: 'Multi-Job Compare', included: true },
  { label: 'LaTeX & Overleaf Export', included: true },
  { label: 'LinkedIn Profile Import', included: true },
  { label: 'AI Resume Generator', included: true },
  { label: 'Priority AI Processing', included: true },
];

const RAZORPAY_PAYMENT_LINK = 'https://rzp.io/rzp/M5er44E';

export default function Pricing() {
  const MotionDiv = motion.div;
  const navigate = useNavigate();
  const { user, isSubscribed, activateSubscription, hasUsedFreeTrial } = useAuth();
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const handleUpgrade = () => {
    if (!user) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }
    // Open Razorpay payment page in new tab
    window.open(RAZORPAY_PAYMENT_LINK, '_blank', 'noopener,noreferrer');
    setPaymentInitiated(true);
  };

  const handleConfirmPayment = () => {
    activateSubscription();
    setPaymentInitiated(false);
  };

  const handleGetStartedFree = () => {
    if (!user) {
      navigate('/login', { state: { from: '/analyze' } });
    } else {
      navigate('/analyze');
    }
  };

  return (
    <div className="min-h-[85vh] px-4 py-16 relative">
      {/* Ambient background */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-primary-200/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-6">
            <HiOutlineStar className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal-800 mb-4">
            Supercharge Your <span className="gradient-text">Job Search</span>
          </h1>
          <p className="text-charcoal-500 text-lg max-w-xl mx-auto">
            Start free with one analysis. Upgrade to Pro for unlimited AI-powered resume optimization.
          </p>
        </MotionDiv>

        {/* Already subscribed banner */}
        {isSubscribed && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto mb-10"
          >
            <div className="p-5 rounded-3xl bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-200 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="font-display text-xl font-bold text-charcoal-800 mb-1">You&apos;re on Pro!</h3>
              <p className="text-charcoal-500 text-sm">Enjoy unlimited resume analyses and all premium features.</p>
              <button
                onClick={() => navigate('/analyze')}
                className="btn-primary mt-4 text-sm"
              >
                Go to Analyzer →
              </button>
            </div>
          </MotionDiv>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="warm-card p-8 flex flex-col"
          >
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-charcoal-100 flex items-center justify-center mb-4">
                <HiOutlineSparkles className="w-6 h-6 text-charcoal-500" />
              </div>
              <h3 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Free</h3>
              <p className="text-charcoal-500 text-sm">Try it out — no credit card needed</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold text-charcoal-800">₹0</span>
                <span className="text-charcoal-400 text-sm">/forever</span>
              </div>
            </div>

            <ul className="space-y-3.5 mb-8 flex-1">
              {freePlanFeatures.map(({ label, included }) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  {included ? (
                    <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <HiOutlineCheck className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-charcoal-100 flex items-center justify-center flex-shrink-0">
                      <HiOutlineX className="w-3.5 h-3.5 text-charcoal-400" />
                    </div>
                  )}
                  <span className={included ? 'text-charcoal-700' : 'text-charcoal-400'}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleGetStartedFree}
              disabled={hasUsedFreeTrial && !isSubscribed}
              className="btn-secondary w-full py-3.5 text-base disabled:opacity-40 disabled:cursor-not-allowed"
              id="pricing-free-btn"
            >
              {hasUsedFreeTrial ? 'Trial Used' : 'Get Started Free'}
            </button>
          </MotionDiv>

          {/* Pro Plan */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-amber flex items-center gap-1.5">
                <HiOutlineLightningBolt className="w-3.5 h-3.5" />
                MOST POPULAR
              </div>
            </div>

            <div className="warm-card p-8 flex flex-col border-2 border-amber-300 shadow-lg relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-primary-50/30 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                    <HiOutlineLightningBolt className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Pro</h3>
                  <p className="text-charcoal-500 text-sm">Everything you need to land your dream job</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-5xl font-bold text-charcoal-800">₹99</span>
                    <span className="text-charcoal-400 text-sm">/month</span>
                  </div>
                  <p className="text-primary-600 text-xs font-medium mt-1">
                    💰 Less than a cup of coffee — land interviews worth lakhs
                  </p>
                </div>

                <ul className="space-y-3.5 mb-8 flex-1">
                  {proPlanFeatures.map(({ label, included }) => (
                    <li key={label} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <HiOutlineCheck className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <span className={included ? 'text-charcoal-700 font-medium' : 'text-charcoal-400'}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>

                {isSubscribed ? (
                  <div className="w-full py-3.5 text-base rounded-2xl font-semibold text-center bg-primary-50 text-primary-700 border border-primary-200">
                    ✅ Active Plan
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleUpgrade}
                      className="btn-amber w-full py-3.5 text-base animate-pulse-glow flex items-center justify-center gap-2"
                      id="pricing-pro-btn"
                    >
                      <HiOutlineLightningBolt className="w-5 h-5" />
                      {paymentInitiated ? 'Pay on Razorpay →' : 'Upgrade to Pro — ₹99/mo'}
                      {!paymentInitiated && <HiOutlineExternalLink className="w-4 h-4 opacity-60" />}
                    </button>

                    <AnimatePresence>
                      {paymentInitiated && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <button
                            onClick={handleConfirmPayment}
                            className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
                            id="confirm-payment-btn"
                          >
                            <HiOutlineBadgeCheck className="w-5 h-5" />
                            I&apos;ve Completed Payment
                          </button>
                          <p className="text-xs text-charcoal-400 text-center">
                            Complete payment on Razorpay, then click above to activate Pro
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <img
                        src="https://badges.razorpay.com/badge-dark.png"
                        alt="Razorpay"
                        className="h-6 opacity-60"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className="text-[10px] text-charcoal-400">Secured by Razorpay</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </MotionDiv>
        </div>

        {/* Trust section */}
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-14 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-charcoal-400 text-sm">
            <div className="flex items-center gap-2">
              <HiOutlineShieldCheck className="w-5 h-5 text-primary-500" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔄</span>
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🤝</span>
              <span>10,000+ Happy Users</span>
            </div>
          </div>

          {/* FAQ Teaser */}
          <div className="mt-10 max-w-lg mx-auto warm-card p-6 text-left">
            <h4 className="font-display font-bold text-charcoal-800 mb-3">💡 Why upgrade?</h4>
            <p className="text-charcoal-500 text-sm leading-relaxed">
              Each job application deserves a tailored resume. With Pro, you get{' '}
              <strong className="text-charcoal-700">unlimited AI-powered analyses</strong>,
              multi-job comparison to find your best-fit roles, professional LaTeX exports, and
              priority access to our Gemini AI engine. At just ₹99/month, it&apos;s the best
              investment in your career.
            </p>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
