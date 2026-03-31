import { useEffect, useState } from 'react';

export default function ScoreGauge({ score = 0, size = 160, strokeWidth = 12, label = 'ATS Score' }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const innerInset = strokeWidth * 1.7;

  const getColor = (value) => {
    if (value >= 71) {
      return { stroke: '#e2c392', text: 'text-accent-200' };
    }

    if (value >= 41) {
      return { stroke: '#88a99c', text: 'text-primary-100' };
    }

    return { stroke: '#b8674f', text: 'text-danger' };
  };

  const color = getColor(score);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * score);

      setAnimatedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(83, 98, 93, 0.45)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 10px ${color.stroke}33)`,
            }}
          />
        </svg>
        <div
          className="absolute rounded-full border border-dark-700/50 bg-dark-900/80 shadow-inner shadow-black/20"
          style={{ inset: innerInset }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-display font-bold ${color.text}`}>
            {animatedScore}
          </span>
          <span className="text-dark-400 text-xs font-medium mt-1">/ 100</span>
        </div>
      </div>
      <p className="text-dark-300 text-sm font-medium">{label}</p>
    </div>
  );
}
