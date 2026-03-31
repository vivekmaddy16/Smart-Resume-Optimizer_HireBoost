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
    desc: 'AI identifies missing skills from job descriptions and suggests where to add them.',
    color: 'from-primary-400 to-accent-500',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Bullet Optimization',
    desc: 'Transforms weak bullet points into powerful, metric-driven achievement statements.',
    color: 'from-accent-500 to-accent-400',
  },
  {
    icon: HiOutlineChartBar,
    title: 'ATS Score Checker',
    desc: 'Get a detailed score breakdown showing how well your resume matches the job.',
    color: 'from-primary-500 to-primary-300',
  },
  {
    icon: HiOutlineSparkles,
    title: 'AI Resume Generator',
    desc: 'Automatically generates a tailored resume optimized for the specific role.',
    color: 'from-dark-700 to-primary-300',
  },
  {
    icon: HiOutlineCloudUpload,
    title: 'LinkedIn Import',
    desc: 'Import your LinkedIn profile data to auto-fill your resume in seconds.',
    color: 'from-accent-400 to-primary-400',
  },
  {
    icon: HiOutlineCode,
    title: 'LaTeX Export',
    desc: 'Export your optimized resume as LaTeX code and open directly in Overleaf.',
    color: 'from-primary-600 to-accent-600',
  },
];

const stats = [
  { value: '95%', label: 'ATS Pass Rate' },
  { value: '3x', label: 'More Interviews' },
  { value: '10K+', label: 'Resumes Optimized' },
  { value: '<30s', label: 'Analysis Time' },
];

export default function Home() {
  const MotionDiv = motion.div;

  return (
    <div className="relative">
      <section className="min-h-[90vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,231,206,0.12),transparent_30%),linear-gradient(180deg,rgba(16,44,38,0),rgba(16,44,38,0.18))]" />

            <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-400/25 text-accent-100 text-sm font-medium mb-8">
              <HiOutlineSparkles className="w-4 h-4" />
              Powered by Google Gemini AI
            </div>

            <h1 className="relative font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-dark-50 leading-tight mb-6">
              Land Your Dream Job with{' '}
              <span className="gradient-text">AI-Optimized</span> Resumes
            </h1>

            <p className="relative text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-10 text-balance">
              Upload your resume and job description. Our AI analyzes, scores, and
              transforms your resume to beat ATS systems and impress recruiters.
            </p>

            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/analyze" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                <HiOutlineSparkles className="w-5 h-5" />
                Optimize My Resume
              </Link>
              <Link to="/multi-target" className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                <HiOutlineChartBar className="w-5 h-5" />
                Multi-Job Compare
              </Link>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="text-3xl font-display font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-dark-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </MotionDiv>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark-50 mb-4">
              Everything You Need to <span className="gradient-text">Stand Out</span>
            </h2>
            <p className="text-dark-300 text-lg max-w-xl mx-auto">
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
                className="glass-card-hover p-7 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-dark-50" />
                </div>
                <h3 className="text-lg font-semibold text-dark-50 mb-2">{feature.title}</h3>
                <p className="text-dark-300 text-sm leading-relaxed">{feature.desc}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark-50 mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload', desc: 'Upload your resume PDF or paste text. Add the job description.' },
              { step: '02', title: 'AI Analysis', desc: 'Gemini AI analyzes keywords, scores ATS compatibility, and finds gaps.' },
              { step: '03', title: 'Download', desc: 'Get your optimized resume as PDF or LaTeX and apply with confidence.' },
            ].map((item, i) => (
              <MotionDiv
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-display font-extrabold gradient-text opacity-50 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-dark-50 mb-2">{item.title}</h3>
                <p className="text-dark-300 text-sm">{item.desc}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 gradient-border relative overflow-hidden"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(247,231,206,0.14),transparent_34%)]" />
            <h2 className="relative font-display text-3xl font-bold text-dark-50 mb-4">
              Ready to Boost Your Resume?
            </h2>
            <p className="relative text-dark-300 mb-8">
              Join thousands of job seekers who landed interviews with AI-optimized resumes.
            </p>
            <Link to="/analyze" className="relative btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5" />
              Start Free Analysis
            </Link>
          </MotionDiv>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-dark-800/50">
        <div className="max-w-6xl mx-auto text-center text-dark-500 text-sm">
          <p>2026 HireBoost. Built with React, Gemini AI, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
