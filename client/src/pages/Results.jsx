import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineDownload,
  HiOutlineRefresh,
  HiOutlineCode,
  HiOutlineClipboardCopy,
  HiOutlineCheck,
} from 'react-icons/hi';
import ScoreGauge from '../components/common/ScoreGauge';
import { optimizeResume, exportLaTeX } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const progressTone = (score = 0) => {
  if (score >= 70) return 'bg-primary-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-400';
};

const importanceTone = (importance) => {
  if (importance === 'critical') {
    return 'bg-red-50 text-red-600 border border-red-200';
  }

  if (importance === 'important') {
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  }

  return 'bg-charcoal-50 text-charcoal-500 border border-charcoal-200';
};

const sectionLabels = {
  summary: 'Summary',
  experience: 'Experience',
  skills: 'Skills',
  projects: 'Projects',
  education: 'Education',
};

export default function Results() {
  const MotionDiv = motion.div;
  const location = useLocation();
  const navigate = useNavigate();
  const { result, jdText } = location.state || {};
  const [optimized, setOptimized] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [latexData, setLatexData] = useState(null);
  const [exportingLatex, setExportingLatex] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-charcoal-500 text-lg mb-4">No analysis results found.</p>
        <button onClick={() => navigate('/analyze')} className="btn-primary">
          Go to Analysis
        </button>
      </div>
    );
  }

  const { analysis, resumeText } = result;
  const atsScore = analysis?.atsScore || {};
  const keywords = analysis?.keywords || {};
  const bullets = analysis?.bulletImprovements || [];
  const skillGap = analysis?.skillGap || [];
  const sectionFeedback = analysis?.sectionFeedback || {};
  const recommendations = analysis?.topRecommendations || [];

  const handleOptimize = async () => {
    setOptimizing(true);

    try {
      const opt = await optimizeResume(resumeText, jdText, analysis);
      setOptimized(opt);
      setActiveTab('optimized');
    } catch (err) {
      alert(`Optimization failed: ${err.response?.data?.error || err.message}`);
    }

    setOptimizing(false);
  };

  const handleExportLatex = async () => {
    setExportingLatex(true);

    try {
      const text = optimized?.optimizedResume || resumeText;
      const data = await exportLaTeX(text, 'professional');
      setLatexData(data);
      setActiveTab('latex');
    } catch (err) {
      alert(`LaTeX export failed: ${err.response?.data?.error || err.message}`);
    }

    setExportingLatex(false);
  };

  const downloadLatex = () => {
    if (!latexData?.latex) return;

    const blob = new Blob([latexData.latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.tex';
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'keywords', label: '🔑 Keywords' },
    { key: 'bullets', label: '💡 Bullets' },
    { key: 'skills', label: '🧩 Skill Gap' },
    { key: 'feedback', label: '💬 Feedback' },
    ...(optimized ? [{ key: 'optimized', label: '✨ Optimized' }] : []),
    ...(latexData ? [{ key: 'latex', label: '📝 LaTeX' }] : []),
  ];

  if (optimizing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingSpinner message="Generating your optimized resume... ✨" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-charcoal-800 mb-1">
              Analysis <span className="gradient-text">Results</span> 🎉
            </h1>
            <p className="text-charcoal-500 text-sm">Great news! Your resume has been analyzed by AI.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleOptimize} disabled={optimizing} className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
              <HiOutlineSparkles className="w-4 h-4" />
              Generate Optimized Resume
            </button>
            <button onClick={handleExportLatex} disabled={exportingLatex} className="btn-secondary text-sm py-2 px-5 flex items-center gap-2">
              <HiOutlineCode className="w-4 h-4" />
              Export LaTeX
            </button>
            <button onClick={() => navigate('/analyze')} className="btn-ghost text-sm py-2 px-5 flex items-center gap-2">
              <HiOutlineRefresh className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="warm-card p-5 flex flex-col items-center">
            <ScoreGauge score={atsScore.overall || 0} size={100} strokeWidth={8} label="Overall" />
          </div>
          <div className="warm-card p-5 flex flex-col items-center">
            <ScoreGauge score={atsScore.keywordMatch || 0} size={100} strokeWidth={8} label="Keywords" />
          </div>
          <div className="warm-card p-5 flex flex-col items-center">
            <ScoreGauge score={atsScore.impactMetrics || 0} size={100} strokeWidth={8} label="Impact" />
          </div>
          <div className="warm-card p-5 flex flex-col items-center">
            <ScoreGauge score={atsScore.atsCompatibility || 0} size={100} strokeWidth={8} label="ATS" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === key
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <MotionDiv
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="warm-card p-6">
                <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
                  <span>📋</span> Overall Feedback
                </h3>
                <p className="text-charcoal-600 leading-relaxed">{analysis?.overallFeedback || 'No feedback available.'}</p>
              </div>

              <div className="warm-card p-6">
                <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
                  <span>🎯</span> Top Recommendations
                </h3>
                <ul className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-charcoal-600">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                  {recommendations.length === 0 && (
                    <li className="text-charcoal-400 text-sm">No recommendations available.</li>
                  )}
                </ul>
              </div>

              <div className="warm-card p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
                  <span>📊</span> Score Breakdown
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Keyword Match', score: atsScore.keywordMatch, weight: '30%' },
                    { label: 'Formatting', score: atsScore.formatting, weight: '20%' },
                    { label: 'Impact Metrics', score: atsScore.impactMetrics, weight: '25%' },
                    { label: 'ATS Compatibility', score: atsScore.atsCompatibility, weight: '25%' },
                  ].map((item, i) => (
                    <div key={i} className="bg-warm-muted rounded-2xl p-4 border border-warm-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-charcoal-500 text-xs">{item.label}</span>
                        <span className="text-xs text-charcoal-400">{item.weight}</span>
                      </div>
                      <div className="text-2xl font-bold text-charcoal-800">{item.score || 0}</div>
                      <div className="w-full bg-charcoal-100 rounded-full h-1.5 mt-2">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-1000 ${progressTone(item.score || 0)}`}
                          style={{ width: `${item.score || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="warm-card p-6">
                <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
                  ✅ Present Keywords <span className="badge-present">{keywords.present?.length || 0}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(keywords.present || []).map((kw, i) => (
                    <span key={i} className="badge-present">{kw}</span>
                  ))}
                  {(!keywords.present || keywords.present.length === 0) && (
                    <p className="text-charcoal-400 text-sm">No matching keywords found.</p>
                  )}
                </div>
              </div>

              <div className="warm-card p-6">
                <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
                  ❌ Missing Keywords <span className="badge-missing">{keywords.missing?.length || 0}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(keywords.missing || []).map((kw, i) => (
                    <span key={i} className="badge-missing">{kw}</span>
                  ))}
                  {(!keywords.missing || keywords.missing.length === 0) && (
                    <p className="text-charcoal-400 text-sm">Great! No missing keywords. 🎉</p>
                  )}
                </div>
              </div>

              <div className="warm-card p-6">
                <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
                  <span>💻</span> Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(keywords.technical || []).map((kw, i) => (
                    <span key={i} className="badge-info">{kw}</span>
                  ))}
                </div>
              </div>

              <div className="warm-card p-6">
                <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
                  <span>🤝</span> Soft Skills & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(keywords.softSkills || []).map((kw, i) => (
                    <span key={i} className="badge-info">{kw}</span>
                  ))}
                  {(keywords.tools || []).map((kw, i) => (
                    <span key={i} className="badge-present">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bullets' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal-800 mb-2 flex items-center gap-2">
                <span>💡</span> Bullet Point Improvements
              </h3>
              <p className="text-charcoal-500 text-sm mb-4">
                AI-enhanced versions of your resume bullets with stronger action verbs and measurable impact.
              </p>

              {bullets.map((bullet, i) => (
                <div key={i} className="warm-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-charcoal-500 bg-charcoal-100 px-2 py-1 rounded-full">
                      {bullet.section || 'General'}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                      <div className="text-xs font-medium text-red-600 mb-2">❌ Original</div>
                      <p className="text-charcoal-600 text-sm">{bullet.original}</p>
                    </div>
                    <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 relative">
                      <div className="text-xs font-medium text-primary-700 mb-2">✅ Improved</div>
                      <p className="text-charcoal-800 text-sm">{bullet.improved}</p>
                      <button
                        onClick={() => copyToClipboard(bullet.improved, i)}
                        className="absolute top-3 right-3 text-charcoal-400 hover:text-charcoal-700 transition-colors"
                        title="Copy"
                      >
                        {copiedIdx === i ? <HiOutlineCheck className="w-4 h-4 text-primary-500" /> : <HiOutlineClipboardCopy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {bullets.length === 0 && (
                <div className="warm-card p-8 text-center text-charcoal-400">No bullet improvements available.</div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="warm-card p-6">
              <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
                <span>🧩</span> Skill Gap Analysis
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-warm-border">
                      <th className="text-left py-3 px-4 text-charcoal-500 font-medium">Skill</th>
                      <th className="text-left py-3 px-4 text-charcoal-500 font-medium">Category</th>
                      <th className="text-left py-3 px-4 text-charcoal-500 font-medium">Importance</th>
                      <th className="text-center py-3 px-4 text-charcoal-500 font-medium">In Resume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillGap.map((skill, i) => (
                      <tr key={i} className="border-b border-warm-border/50 hover:bg-warm-muted/50 transition-colors">
                        <td className="py-3 px-4 text-charcoal-800 font-medium">{skill.skill}</td>
                        <td className="py-3 px-4">
                          <span className="badge-info">{skill.category}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${importanceTone(skill.importance)}`}>
                            {skill.importance}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={skill.inResume ? 'badge-present' : 'badge-missing'}>
                            {skill.inResume ? '✅ Present' : '❌ Missing'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {skillGap.length === 0 && (
                  <p className="text-center text-charcoal-400 py-8">No skill gap data available.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(sectionFeedback || {}).map(([section, feedback]) => (
                feedback && (
                  <div key={section} className="warm-card p-6">
                    <h3 className="text-lg font-semibold text-charcoal-800 mb-3 capitalize flex items-center gap-2">
                      <span>💬</span> {sectionLabels[section] || section}
                    </h3>
                    <p className="text-charcoal-600 text-sm leading-relaxed">{feedback}</p>
                  </div>
                )
              ))}
            </div>
          )}

          {activeTab === 'optimized' && optimized && (
            <div className="space-y-6">
              <div className="warm-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-charcoal-800 flex items-center gap-2">
                    <span>✨</span> Optimized Resume
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(optimized.optimizedResume, 'opt')}
                      className="btn-ghost text-sm py-1.5 px-3 flex items-center gap-1"
                    >
                      {copiedIdx === 'opt' ? <HiOutlineCheck className="w-4 h-4 text-primary-500" /> : <HiOutlineClipboardCopy className="w-4 h-4" />}
                      Copy
                    </button>
                  </div>
                </div>

                {optimized.newATSScore && (
                  <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-2xl text-primary-700 text-sm">
                    🎉 Estimated new ATS score: <strong>{optimized.newATSScore}/100</strong>
                    {atsScore.overall ? (
                      <span className="ml-2 text-charcoal-500">
                        (was {atsScore.overall} →{' '}
                        <span className="text-primary-600 font-semibold">
                          {optimized.newATSScore - atsScore.overall >= 0 ? '+' : ''}
                          {optimized.newATSScore - atsScore.overall}
                        </span>
                        )
                      </span>
                    ) : null}
                  </div>
                )}

                <div className="bg-warm-muted rounded-3xl p-6 font-mono text-sm text-charcoal-700 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto border border-warm-border">
                  {optimized.optimizedResume}
                </div>
              </div>

              {optimized.changesSummary && (
                <div className="warm-card p-6">
                  <h3 className="text-lg font-semibold text-charcoal-800 mb-3 flex items-center gap-2">
                    <span>📝</span> Changes Made
                  </h3>
                  <ul className="space-y-2">
                    {optimized.changesSummary.map((change, i) => (
                      <li key={i} className="flex items-start gap-2 text-charcoal-600 text-sm">
                        <span className="text-primary-500 mt-0.5">✓</span>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'latex' && latexData && (
            <div className="space-y-6">
              {/* Instructions Card */}
              <div className="warm-card p-5 bg-primary-50 border border-primary-200">
                <h4 className="text-sm font-semibold text-primary-800 mb-2 flex items-center gap-2">
                  <span>📋</span> How to use this LaTeX code
                </h4>
                <ol className="text-sm text-primary-700 space-y-1 list-decimal list-inside">
                  <li>Click <strong>"Copy LaTeX Code"</strong> below to copy the entire code</li>
                  <li>Go to <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">overleaf.com</a> and create a <strong>New Blank Project</strong></li>
                  <li>Select all existing code in the editor (Ctrl+A) and <strong>paste</strong> (Ctrl+V)</li>
                  <li>Click <strong>"Recompile"</strong> to see your formatted resume!</li>
                </ol>
              </div>

              <div className="warm-card p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h3 className="text-lg font-semibold text-charcoal-800 flex items-center gap-2">
                    <span>📝</span> LaTeX Source Code
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => copyToClipboard(latexData.latex, 'latex-code')}
                      className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                    >
                      {copiedIdx === 'latex-code' ? (
                        <><HiOutlineCheck className="w-4 h-4" /> Copied!</>
                      ) : (
                        <><HiOutlineClipboardCopy className="w-4 h-4" /> Copy LaTeX Code</>
                      )}
                    </button>
                    <button onClick={downloadLatex} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                      <HiOutlineDownload className="w-4 h-4" />
                      Download .tex
                    </button>
                    {latexData.overleafURL && (
                      <a href={latexData.overleafURL} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm py-2 px-4 flex items-center gap-2">
                        Open in Overleaf ↗
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-charcoal-800 rounded-2xl p-5 font-mono text-xs text-green-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto border border-charcoal-700 leading-relaxed select-all">
                  {latexData.latex}
                </div>
              </div>
            </div>
          )}
        </MotionDiv>
      </MotionDiv>
    </div>
  );
}
