import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineMail,
  HiOutlineHeart,
} from 'react-icons/hi';
import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';

const footerLinks = {
  product: [
    { label: 'Resume Analyzer', to: '/analyze', icon: HiOutlineDocumentText },
    { label: 'Multi-Job Compare', to: '/multi-target', icon: HiOutlineChartBar },
    { label: 'AI Optimizer', to: '/analyze', icon: HiOutlineSparkles },
  ],
  features: [
    { label: 'ATS Score Checker' },
    { label: 'Keyword Matching' },
    { label: 'LaTeX Export' },
    { label: 'LinkedIn Import' },
  ],
  resources: [
    { label: 'How It Works', to: '/' },
    { label: 'Resume Tips', href: '#' },
    { label: 'ATS Guide', href: '#' },
  ],
};

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/vivekmaddy16', label: 'GitHub' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/vivekm007', label: 'LinkedIn' },
  { icon: FaXTwitter, href: 'https://x.com/vivekmaddy16', label: 'X (Twitter)' },
  { icon: HiOutlineMail, href: 'mailto:vivekmaddheshiya19@gmail.com', label: 'Email' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const MotionDiv = motion.div;
  const MotionFooter = motion.footer;

  return (
    <MotionFooter
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative bg-charcoal-900 text-white overflow-hidden"
    >
      {/* Top decorative gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-primary-500 to-amber-500" />

      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter / CTA strip */}
        <div className="py-10 border-b border-charcoal-700/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="font-display text-xl font-bold text-white mb-1">
                Ready to land your dream job?
              </h3>
              <p className="text-charcoal-400 text-sm">
                Start optimizing your resume with AI — it&apos;s free and takes less than 30 seconds.
              </p>
            </div>
            <Link
              to="/analyze"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-charcoal-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/25 active:scale-95"
            >
              <HiOutlineSparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Start Free Analysis
            </Link>
          </div>
        </div>

        {/* Links grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-5">
              <img
                src="/logo.png"
                alt="HireBoost"
                className="w-9 h-9 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="font-display font-bold text-xl text-white">
                Hire<span className="text-amber-400">Boost</span>
              </span>
            </Link>
            <p className="text-charcoal-400 text-sm leading-relaxed mb-6">
              AI-powered resume optimization that helps you beat ATS systems and land more interviews.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-charcoal-400 hover:text-white hover:bg-charcoal-700 hover:border-charcoal-600 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-charcoal-300 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map(({ label, to, icon: Icon }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="group flex items-center gap-2 text-sm text-charcoal-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4 text-charcoal-600 group-hover:text-amber-500 transition-colors duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-charcoal-300 uppercase tracking-wider mb-4">
              Features
            </h4>
            <ul className="space-y-3">
              {footerLinks.features.map(({ label }) => (
                <li key={label}>
                  <span className="flex items-center gap-2 text-sm text-charcoal-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/60" />
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-charcoal-300 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map(({ label, to, href }) => (
                <li key={label}>
                  {to ? (
                    <Link
                      to={to}
                      className="text-sm text-charcoal-400 hover:text-amber-400 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="text-sm text-charcoal-400 hover:text-amber-400 transition-colors duration-200"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Tech stack badges */}
            <div className="mt-6">
              <h4 className="font-display font-semibold text-sm text-charcoal-300 uppercase tracking-wider mb-3">
                Built With
              </h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'Gemini AI', 'Node.js'].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-charcoal-800 border border-charcoal-700 text-charcoal-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-charcoal-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-charcoal-500 text-sm">
              © {currentYear} HireBoost. All rights reserved.
            </p>
            <MotionDiv
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-1.5 text-sm text-charcoal-500"
            >
              Made with
              <HiOutlineHeart className="w-4 h-4 text-red-400 animate-pulse" />
              and
              <span className="text-lg leading-none" role="img" aria-label="coffee">☕</span>
              by
              <a
                href="https://github.com/vivekmaddy16"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Vivek Maddheshiya
              </a>
            </MotionDiv>
            <div className="flex items-center gap-4 text-xs text-charcoal-500">
              <Link to="/privacy" className="hover:text-amber-400 transition-colors duration-200">Privacy</Link>
              <span className="text-charcoal-700">•</span>
              <Link to="/terms" className="hover:text-amber-400 transition-colors duration-200">Terms</Link>
              <span className="text-charcoal-700">•</span>
              <Link to="/contact" className="hover:text-amber-400 transition-colors duration-200">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </MotionFooter>
  );
}
