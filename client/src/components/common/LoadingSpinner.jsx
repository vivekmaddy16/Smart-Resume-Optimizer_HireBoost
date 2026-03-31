import { motion } from 'framer-motion';

export default function LoadingSpinner({ message = 'Analyzing your resume with AI...' }) {
  const MotionDiv = motion.div;
  const tips = [
    '🔍 Extracting keywords from your resume...',
    '🧠 Running AI analysis on job description...',
    '📊 Calculating ATS compatibility score...',
    '✨ Optimizing bullet points...',
    '🎯 Identifying skill gaps...',
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      {/* Animated spinner */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-dark-700 border-t-primary-500 animate-spin" />
        <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-b-accent-500 animate-spin-slow" />
      </div>

      {/* Message */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <p className="text-lg font-medium text-white mb-2">{message}</p>
        <p className="text-dark-400 text-sm">This may take 15-30 seconds</p>
      </MotionDiv>

      {/* Animated tips */}
      <div className="flex flex-col gap-2 mt-4">
        {tips.map((tip, i) => (
          <MotionDiv
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 1.5, duration: 0.5 }}
            className="flex items-center gap-2 text-dark-400 text-sm"
          >
            <span>{tip}</span>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
}
