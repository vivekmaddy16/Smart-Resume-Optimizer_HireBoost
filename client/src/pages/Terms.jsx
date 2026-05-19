import { motion } from 'framer-motion';
import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const sections = [
  {
    icon: HiOutlineCheckCircle,
    title: 'Acceptance of Terms',
    color: 'bg-primary-50 text-primary-600',
    iconBg: 'bg-primary-100',
    content: [
      'By accessing or using HireBoost, you agree to be bound by these Terms of Service.',
      'If you do not agree to any part of these terms, you may not use our service.',
      'We reserve the right to update these terms at any time. Continued use constitutes acceptance of the revised terms.',
      'You must be at least 16 years old to use this service.',
    ],
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Use of Service',
    color: 'bg-amber-50 text-amber-600',
    iconBg: 'bg-amber-100',
    content: [
      'HireBoost provides AI-powered resume analysis and optimization tools.',
      'You may use our service for personal, non-commercial resume improvement purposes.',
      'You are responsible for the accuracy and legality of content you upload.',
      'You agree not to upload malicious files, spam the service, or attempt to exploit vulnerabilities.',
      'We reserve the right to suspend or terminate accounts that violate these terms.',
    ],
  },
  {
    icon: HiOutlineDocumentText,
    title: 'Intellectual Property',
    color: 'bg-blue-50 text-blue-600',
    iconBg: 'bg-blue-100',
    content: [
      'You retain full ownership of your resume content and any documents you upload.',
      'HireBoost does not claim ownership over any user-uploaded content.',
      'The HireBoost platform, including its design, code, and branding, is our intellectual property.',
      'AI-generated suggestions and optimized content are provided for your use without restriction.',
    ],
  },
  {
    icon: HiOutlineExclamationCircle,
    title: 'Disclaimers & Limitations',
    color: 'bg-purple-50 text-purple-600',
    iconBg: 'bg-purple-100',
    content: [
      'HireBoost is provided "as is" without warranties of any kind, express or implied.',
      'We do not guarantee that our AI suggestions will result in job interviews or offers.',
      'ATS scores are estimates based on common ATS algorithms and may vary across actual systems.',
      'We are not liable for any damages arising from the use or inability to use our service.',
      'Our AI analysis is a tool to assist you — final resume decisions remain your responsibility.',
    ],
  },
  {
    icon: HiOutlineInformationCircle,
    title: 'Service Availability',
    color: 'bg-rose-50 text-rose-600',
    iconBg: 'bg-rose-100',
    content: [
      'We strive to maintain 99.9% uptime but do not guarantee uninterrupted service.',
      'We may perform maintenance that temporarily affects availability, with advance notice when possible.',
      'We reserve the right to modify, suspend, or discontinue any feature at any time.',
      'Free tier services may have usage limits that are subject to change.',
    ],
  },
];

export default function Terms() {
  const MotionDiv = motion.div;

  return (
    <div className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-6">
            <HiOutlineDocumentText className="w-4 h-4" />
            Legal Agreement
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal-900 mb-4">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-charcoal-500 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using HireBoost. They govern your use of our platform.
          </p>
          <p className="text-charcoal-400 text-sm mt-4">
            Effective date: May 19, 2026
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
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </MotionDiv>
            );
          })}
        </div>

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link to="/" className="text-charcoal-400 hover:text-amber-600 text-sm font-medium transition-colors duration-200">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
