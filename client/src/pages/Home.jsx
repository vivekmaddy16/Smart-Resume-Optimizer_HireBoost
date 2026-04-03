import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineDocumentSearch,
  HiOutlineCloudUpload,
  HiOutlineCode,
} from 'react-icons/hi';

const features = [
  {
    icon: HiOutlineDocumentSearch,
    title: 'Keyword Matching',
    desc: 'AI finds missing skills from job descriptions and suggests where to add them.',
    color: 'bg-primary-50 text-primary-600',
    iconBg: 'bg-primary-100',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Bullet Optimization',
    desc: 'Transforms weak bullet points into powerful, metric-driven achievement statements.',
    color: 'bg-amber-50 text-amber-600',
    iconBg: 'bg-amber-100',
  },
  {
    icon: HiOutlineChartBar,
    title: 'ATS Score Checker',
    desc: 'Get a detailed score breakdown showing how well your resume matches the job.',
    color: 'bg-blue-50 text-blue-600',
    iconBg: 'bg-blue-100',
  },
  {
    icon: HiOutlineSparkles,
    title: 'AI Resume Generator',
    desc: 'Automatically generates a tailored resume optimized for the specific role.',
    color: 'bg-purple-50 text-purple-600',
    iconBg: 'bg-purple-100',
  },
  {
    icon: HiOutlineCloudUpload,
    title: 'LinkedIn Import',
    desc: 'Import your LinkedIn profile data to auto-fill your resume in seconds.',
    color: 'bg-sky-50 text-sky-600',
    iconBg: 'bg-sky-100',
  },
  {
    icon: HiOutlineCode,
    title: 'LaTeX Export',
    desc: 'Export your optimized resume as LaTeX code and open directly in Overleaf.',
    color: 'bg-rose-50 text-rose-600',
    iconBg: 'bg-rose-100',
  },
];

const stats = [
  { value: '95%', label: 'ATS Pass Rate', emoji: '🎯' },
  { value: '3x', label: 'More Interviews', emoji: '📈' },
  { value: '10K+', label: 'Resumes Optimized', emoji: '📄' },
  { value: '<30s', label: 'Analysis Time', emoji: '⚡' },
];

export default function Home() {
  const MotionDiv = motion.div;

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-8">
              <HiOutlineSparkles className="w-4 h-4" />
              Powered by Google Gemini AI
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-charcoal-900 leading-tight mb-6">
              Land Your Dream Job with{' '}
              <span className="gradient-text">AI-Optimized</span> Resumes
            </h1>

            <p className="text-lg sm:text-xl text-charcoal-500 max-w-2xl mx-auto mb-10 text-balance">
              Upload your resume and job description. Our AI analyzes, scores, and
              transforms your resume to beat ATS systems and impress recruiters.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/analyze" className="btn-amber text-lg px-8 py-4 flex items-center gap-2">
                <span>🚀</span>
                Optimize My Resume
              </Link>
              <Link to="/multi-target" className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                <HiOutlineChartBar className="w-5 h-5" />
                Multi-Job Compare
              </Link>
            </div>
          </MotionDiv>

          {/* Stats */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <div key={i} className="warm-card p-6 text-center">
                <div className="text-2xl mb-2">{stat.emoji}</div>
                <div className="text-3xl font-display font-bold text-charcoal-800 mb-1">{stat.value}</div>
                <div className="text-charcoal-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-warm-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal-800 mb-4">
              Everything You Need to <span className="gradient-text">Stand Out</span>
            </h2>
            <p className="text-charcoal-500 text-lg max-w-xl mx-auto">
              Our AI-powered toolkit gives you an unfair advantage in the job market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <MotionDiv
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="warm-card-hover p-7 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color.split(' ')[1]}`} />
                </div>
                <h3 className="text-lg font-semibold text-charcoal-800 mb-2">{feature.title}</h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">{feature.desc}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal-800 mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload', desc: 'Upload your resume PDF or paste text. Add the job description.', emoji: '📤' },
              { step: '2', title: 'AI Analysis', desc: 'Gemini AI analyzes keywords, scores ATS compatibility, and finds gaps.', emoji: '🧠' },
              { step: '3', title: 'Download', desc: 'Get your optimized resume as PDF or LaTeX and apply with confidence.', emoji: '✅' },
            ].map((item, i) => (
              <MotionDiv
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-5">
                  <span className="text-3xl">{item.emoji}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold mb-3">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-semibold text-charcoal-800 mb-2">{item.title}</h3>
                <p className="text-charcoal-500 text-sm">{item.desc}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="warm-card p-12 bg-gradient-to-br from-amber-50 via-white to-primary-50 border border-amber-200"
          >
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="font-display text-3xl font-bold text-charcoal-800 mb-4">
              Ready to Boost Your Resume?
            </h2>
            <p className="text-charcoal-500 mb-8">
              Join thousands of job seekers who landed interviews with AI-optimized resumes.
            </p>
            <Link to="/analyze" className="btn-amber text-lg px-10 py-4 inline-flex items-center gap-2">
              <span>✨</span>
              Start Free Analysis
            </Link>
          </MotionDiv>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-warm-border bg-white/50">
        <div className="max-w-6xl mx-auto text-center text-charcoal-400 text-sm">
          <p>© 2026 HireBoost. Built with React, Gemini AI, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
