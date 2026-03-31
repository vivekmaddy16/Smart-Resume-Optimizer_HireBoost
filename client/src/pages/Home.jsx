import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineSparkles, HiOutlineChartBar, HiOutlineLightningBolt, HiOutlineDocumentSearch, HiOutlineCloudUpload, HiOutlineCode } from 'react-icons/hi';

const features = [
  {
    icon: HiOutlineDocumentSearch,
    title: 'Keyword Matching',
    desc: 'AI identifies missing skills from job descriptions and suggests where to add them.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Bullet Optimization',
    desc: 'Transforms weak bullet points into powerful, metric-driven achievement statements.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: HiOutlineChartBar,
    title: 'ATS Score Checker',
    desc: 'Get a detailed score breakdown showing how well your resume matches the job.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: HiOutlineSparkles,
    title: 'AI Resume Generator',
    desc: 'Automatically generates a tailored resume optimized for the specific role.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: HiOutlineCloudUpload,
    title: 'LinkedIn Import',
    desc: 'Import your LinkedIn profile data to auto-fill your resume in seconds.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: HiOutlineCode,
    title: 'LaTeX Export',
    desc: 'Export your optimized resume as LaTeX code and open directly in Overleaf.',
    color: 'from-rose-500 to-red-500',
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
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/25 text-primary-300 text-sm font-medium mb-8">
              <HiOutlineSparkles className="w-4 h-4" />
              Powered by Google Gemini AI
            </div>

            {/* Heading */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Land Your Dream Job with{' '}
              <span className="gradient-text">AI-Optimized</span> Resumes
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-10 text-balance">
              Upload your resume and job description — our AI analyzes, scores, and transforms your resume to beat ATS systems and impress recruiters.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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

          {/* Stats */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="text-3xl font-display font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-dark-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to <span className="gradient-text">Stand Out</span>
            </h2>
            <p className="text-dark-400 text-lg max-w-xl mx-auto">
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
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.desc}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload', desc: 'Upload your resume PDF or paste text. Add the job description.' },
              { step: '02', title: 'AI Analysis', desc: 'Gemini AI analyzes keywords, scores ATS compatibility, finds gaps.' },
              { step: '03', title: 'Download', desc: 'Get your optimized resume as PDF or LaTeX. Apply with confidence!' },
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
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-dark-400 text-sm">{item.desc}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 gradient-border"
          >
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Ready to Boost Your Resume?
            </h2>
            <p className="text-dark-400 mb-8">
              Join thousands of job seekers who landed interviews with AI-optimized resumes.
            </p>
            <Link to="/analyze" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5" />
              Start Free Analysis
            </Link>
          </MotionDiv>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-dark-800/50">
        <div className="max-w-6xl mx-auto text-center text-dark-500 text-sm">
          <p>© 2026 HireBoost. Built with ❤️ using React, Gemini AI & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
