import { motion } from 'framer-motion';
import {
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlineLockClosed,
  HiOutlineTrash,
  HiOutlineGlobeAlt,
  HiOutlineMail,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const sections = [
  {
    icon: HiOutlineEye,
    title: 'Information We Collect',
    color: 'bg-primary-50 text-primary-600',
    iconBg: 'bg-primary-100',
    content: [
      'Resume content you upload for analysis and optimization.',
      'Job descriptions you provide for matching purposes.',
      'Basic usage data such as session duration and feature usage to improve our service.',
      'We do NOT collect personal identification information beyond what is in your uploaded resume.',
    ],
  },
  {
    icon: HiOutlineLockClosed,
    title: 'How We Use Your Data',
    color: 'bg-amber-50 text-amber-600',
    iconBg: 'bg-amber-100',
    content: [
      'Your resume and job description data are processed solely for AI-powered optimization.',
      'Data is sent securely to Google Gemini AI for analysis and is not stored permanently on our servers.',
      'We do not sell, trade, or share your personal data with third parties.',
      'Usage analytics are collected anonymously to improve the platform experience.',
    ],
  },
  {
    icon: HiOutlineTrash,
    title: 'Data Retention & Deletion',
    color: 'bg-blue-50 text-blue-600',
    iconBg: 'bg-blue-100',
    content: [
      'Uploaded resumes are processed in real-time and are not permanently stored.',
      'Temporary files are automatically deleted after your session ends.',
      'You can request complete data deletion by contacting us at the email below.',
      'We retain anonymized usage statistics for service improvement purposes.',
    ],
  },
  {
    icon: HiOutlineGlobeAlt,
    title: 'Cookies & Tracking',
    color: 'bg-purple-50 text-purple-600',
    iconBg: 'bg-purple-100',
    content: [
      'HireBoost uses minimal cookies required for the application to function.',
      'We do not use third-party advertising or tracking cookies.',
      'Session data is stored locally in your browser and is not transmitted externally.',
      'You may disable cookies in your browser settings at any time.',
    ],
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Security Measures',
    color: 'bg-rose-50 text-rose-600',
    iconBg: 'bg-rose-100',
    content: [
      'All data transmission is encrypted using industry-standard TLS/SSL protocols.',
      'Our servers follow best practices for data security and access control.',
      'We regularly review and update our security practices.',
      'In the event of a data breach, affected users will be notified within 72 hours.',
    ],
  },
];

export default function Privacy() {
  const MotionDiv = motion.div;

  return (
    <div className="relative py-20 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-6">
            <HiOutlineShieldCheck className="w-4 h-4" />
            Your Privacy Matters
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal-900 mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-charcoal-500 text-lg max-w-2xl mx-auto">
            We are committed to protecting your privacy. This policy explains how HireBoost handles your data.
          </p>
          <p className="text-charcoal-400 text-sm mt-4">
            Last updated: May 19, 2026
          </p>
        </MotionDiv>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <MotionDiv
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="warm-card-hover p-7"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${section.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${section.color.split(' ')[1]}`} />
                  </div>
                  <h2 className="font-display text-xl font-bold text-charcoal-800">{section.title}</h2>
                </div>
                <ul className="space-y-3 ml-1">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-charcoal-500 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </MotionDiv>
            );
          })}
        </div>

        {/* Contact CTA */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-12 warm-card p-10 text-center bg-gradient-to-br from-amber-50 via-white to-primary-50 border border-amber-200"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <HiOutlineMail className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="font-display text-xl font-bold text-charcoal-800 mb-2">
            Questions about our privacy practices?
          </h3>
          <p className="text-charcoal-500 text-sm mb-6 max-w-md mx-auto">
            Feel free to reach out — we're happy to clarify anything.
          </p>
          <a
            href="mailto:vivekmaddheshiya19@gmail.com"
            className="btn-amber inline-flex items-center gap-2"
          >
            <HiOutlineMail className="w-5 h-5" />
            Contact Us
          </a>
        </MotionDiv>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link to="/" className="text-charcoal-400 hover:text-amber-600 text-sm font-medium transition-colors duration-200">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
