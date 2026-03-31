import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineSparkles, HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlineX } from 'react-icons/hi';
import { multiTargetAnalysis } from '../services/api';
import ScoreGauge from '../components/common/ScoreGauge';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function MultiTarget() {
  const MotionDiv = motion.div;
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [inputMode, setInputMode] = useState('upload');
  const [jobs, setJobs] = useState([{ title: '', company: '', text: '' }]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const addJob = () => {
    if (jobs.length >= 5) return;
    setJobs([...jobs, { title: '', company: '', text: '' }]);
  };

  const removeJob = (idx) => {
    if (jobs.length <= 1) return;
    setJobs(jobs.filter((_, i) => i !== idx));
  };

  const updateJob = (idx, field, value) => {
    const updated = [...jobs];
    updated[idx][field] = value;
    setJobs(updated);
  };

  const handleAnalyze = async () => {
    const validJobs = jobs.filter(j => j.text.trim());
    if (validJobs.length === 0) {
      setError('Please enter at least one job description');
      return;
    }
    if (!resumeFile && !resumeText.trim()) {
      setError('Please upload a resume or paste resume text');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await multiTargetAnalysis(resumeFile, resumeText, validJobs);
      setResults(res.results);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingSpinner message={`Analyzing resume against ${jobs.filter(j => j.text.trim()).length} job descriptions...`} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Multi-Job <span className="gradient-text">Targeting</span>
          </h1>
          <p className="text-dark-400 text-lg">
            Compare your resume against multiple jobs to find your best fit.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')}><HiOutlineX className="w-4 h-4" /></button>
          </div>
        )}

        {!results ? (
          <>
            {/* Resume Input */}
            <div className="glass-card p-6 mb-8 max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <HiOutlineDocumentText className="w-5 h-5 text-primary-400" />
                Your Resume
              </h2>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setInputMode('upload')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    inputMode === 'upload' ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'text-dark-400 hover:text-white'
                  }`}
                >
                  📄 Upload PDF
                </button>
                <button
                  onClick={() => setInputMode('paste')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    inputMode === 'paste' ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'text-dark-400 hover:text-white'
                  }`}
                >
                  📝 Paste Text
                </button>
              </div>

              {inputMode === 'upload' ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragActive ? 'border-primary-500 bg-primary-500/5' :
                    resumeFile ? 'border-accent-500/50 bg-accent-500/5' :
                    'border-dark-600 hover:border-primary-500/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <HiOutlineDocumentText className="w-6 h-6 text-accent-400" />
                      <span className="text-accent-400 font-medium">{resumeFile.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); setResumeFile(null); }} className="text-red-400 hover:text-red-300">
                        <HiOutlineX className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <HiOutlineCloudUpload className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                      <p className="text-dark-300">Drop your resume PDF here</p>
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="input-field h-40 resize-none font-mono text-sm"
                />
              )}
            </div>

            {/* Job Descriptions */}
            <div className="max-w-3xl mx-auto space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">🎯 Job Descriptions ({jobs.length}/5)</h2>
                {jobs.length < 5 && (
                  <button onClick={addJob} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                    <HiOutlinePlus className="w-4 h-4" /> Add Job
                  </button>
                )}
              </div>

              {jobs.map((job, i) => (
                <MotionDiv
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-primary-400 font-medium text-sm">Job #{i + 1}</span>
                    {jobs.length > 1 && (
                      <button onClick={() => removeJob(i)} className="text-red-400 hover:text-red-300">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <input
                      value={job.title}
                      onChange={(e) => updateJob(i, 'title', e.target.value)}
                      placeholder="Job Title (e.g., Full Stack Developer)"
                      className="input-field text-sm"
                    />
                    <input
                      value={job.company}
                      onChange={(e) => updateJob(i, 'company', e.target.value)}
                      placeholder="Company (e.g., Google)"
                      className="input-field text-sm"
                    />
                  </div>
                  <textarea
                    value={job.text}
                    onChange={(e) => updateJob(i, 'text', e.target.value)}
                    placeholder="Paste the full job description..."
                    className="input-field h-36 resize-none text-sm"
                  />
                </MotionDiv>
              ))}
            </div>

            {/* Analyze Button */}
            <div className="text-center">
              <button
                onClick={handleAnalyze}
                disabled={!jobs.some(j => j.text.trim()) || (!resumeFile && !resumeText.trim())}
                className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <HiOutlineSparkles className="w-6 h-6" />
                Compare All Jobs
              </button>
            </div>
          </>
        ) : (
          /* RESULTS */
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-white">📊 Comparison Results</h2>
              <button onClick={() => setResults(null)} className="btn-secondary text-sm py-2 px-4">
                ← Back to Input
              </button>
            </div>

            {/* Result Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((r, i) => {
                const score = r.analysis?.atsScore?.overall || 0;
                const isBest = i === 0;
                return (
                  <MotionDiv
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`glass-card p-6 relative ${isBest ? 'ring-2 ring-accent-500/50' : ''}`}
                  >
                    {isBest && (
                      <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-accent-500 text-white text-xs font-bold">
                        🏆 Best Fit
                      </div>
                    )}
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-white">{r.jobTitle}</h3>
                      <p className="text-dark-400 text-sm">{r.company}</p>
                    </div>

                    {r.error ? (
                      <p className="text-red-400 text-sm text-center">{r.error}</p>
                    ) : (
                      <>
                        <div className="flex justify-center mb-4">
                          <ScoreGauge score={score} size={120} strokeWidth={10} label="ATS Score" />
                        </div>

                        {/* Key stats */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-dark-400">
                            <span>Keywords Match</span>
                            <span className="text-white font-medium">{r.analysis?.atsScore?.keywordMatch || 0}%</span>
                          </div>
                          <div className="flex justify-between text-dark-400">
                            <span>Missing Skills</span>
                            <span className="text-red-400 font-medium">{r.analysis?.keywords?.missing?.length || 0}</span>
                          </div>
                          <div className="flex justify-between text-dark-400">
                            <span>Present Skills</span>
                            <span className="text-emerald-400 font-medium">{r.analysis?.keywords?.present?.length || 0}</span>
                          </div>
                        </div>

                        {/* Missing keywords preview */}
                        {r.analysis?.keywords?.missing?.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-dark-700">
                            <p className="text-xs text-dark-500 mb-2">Top missing skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {r.analysis.keywords.missing.slice(0, 5).map((kw, j) => (
                                <span key={j} className="badge-missing text-[10px]">{kw}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </MotionDiv>
                );
              })}
            </div>
          </div>
        )}
      </MotionDiv>
    </div>
  );
}
