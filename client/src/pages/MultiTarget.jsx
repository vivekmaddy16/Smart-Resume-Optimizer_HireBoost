import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineSparkles,
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineX,
} from 'react-icons/hi';
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
    const validJobs = jobs.filter((job) => job.text.trim());
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
      const response = await multiTargetAnalysis(resumeFile, resumeText, validJobs);
      setResults(response.results);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingSpinner message={`Analyzing your resume against ${jobs.filter((job) => job.text.trim()).length} job descriptions...`} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark-50 mb-3">
            Multi-Job <span className="gradient-text">Targeting</span>
          </h1>
          <p className="text-dark-300 text-lg">
            Compare your resume against multiple roles to find your strongest fit.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-2xl bg-danger/10 border border-danger/25 text-danger text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="hover:text-dark-50 transition-colors">
              <HiOutlineX className="w-4 h-4" />
            </button>
          </div>
        )}

        {!results ? (
          <>
            <div className="glass-card p-6 mb-8 max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold text-dark-50 mb-4 flex items-center gap-2">
                <HiOutlineDocumentText className="w-5 h-5 text-accent-200" />
                Your Resume
              </h2>

              <div className="flex gap-2 mb-4 flex-wrap">
                {['upload', 'paste'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setInputMode(mode)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      inputMode === mode
                        ? 'bg-accent-500/10 text-accent-100 border border-accent-400/25'
                        : 'text-dark-400 hover:text-dark-50 hover:bg-dark-700/40'
                    }`}
                  >
                    {mode === 'upload' ? 'Upload PDF' : 'Paste Text'}
                  </button>
                ))}
              </div>

              {inputMode === 'upload' ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-[24px] p-8 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-accent-400 bg-accent-500/10'
                      : resumeFile
                        ? 'border-primary-300/50 bg-primary-400/10'
                        : 'border-dark-600 hover:border-accent-400/40 hover:bg-dark-800/40'
                  }`}
                >
                  <input {...getInputProps()} />
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <HiOutlineDocumentText className="w-6 h-6 text-primary-100" />
                      <span className="text-primary-100 font-medium">{resumeFile.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                        }}
                        className="text-danger hover:text-accent-100 transition-colors"
                      >
                        <HiOutlineX className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <HiOutlineCloudUpload className="w-8 h-8 text-accent-200 mx-auto mb-2" />
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

            <div className="max-w-3xl mx-auto space-y-4 mb-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-dark-50">Job Descriptions ({jobs.length}/5)</h2>
                {jobs.length < 5 && (
                  <button onClick={addJob} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                    <HiOutlinePlus className="w-4 h-4" />
                    Add Job
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
                    <span className="text-accent-200 font-medium text-sm">Job #{i + 1}</span>
                    {jobs.length > 1 && (
                      <button onClick={() => removeJob(i)} className="text-danger hover:text-accent-100 transition-colors">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <input
                      value={job.title}
                      onChange={(e) => updateJob(i, 'title', e.target.value)}
                      placeholder="Job Title"
                      className="input-field text-sm"
                    />
                    <input
                      value={job.company}
                      onChange={(e) => updateJob(i, 'company', e.target.value)}
                      placeholder="Company"
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

            <div className="text-center">
              <button
                onClick={handleAnalyze}
                disabled={!jobs.some((job) => job.text.trim()) || (!resumeFile && !resumeText.trim())}
                className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <HiOutlineSparkles className="w-6 h-6" />
                Compare All Jobs
              </button>
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8 gap-3">
              <h2 className="text-xl font-semibold text-dark-50">Comparison Results</h2>
              <button onClick={() => setResults(null)} className="btn-secondary text-sm py-2 px-4">
                Back to Input
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((resultItem, i) => {
                const score = resultItem.analysis?.atsScore?.overall || 0;
                const isBest = i === 0;

                return (
                  <MotionDiv
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`glass-card p-6 relative ${isBest ? 'ring-2 ring-accent-400/45' : ''}`}
                  >
                    {isBest && (
                      <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-accent-500 text-dark-950 text-xs font-bold">
                        Best Fit
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-dark-50">{resultItem.jobTitle}</h3>
                      <p className="text-dark-300 text-sm">{resultItem.company}</p>
                    </div>

                    {resultItem.error ? (
                      <p className="text-danger text-sm text-center">{resultItem.error}</p>
                    ) : (
                      <>
                        <div className="flex justify-center mb-4">
                          <ScoreGauge score={score} size={120} strokeWidth={10} label="ATS Score" />
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-dark-400">
                            <span>Keywords Match</span>
                            <span className="text-dark-50 font-medium">{resultItem.analysis?.atsScore?.keywordMatch || 0}%</span>
                          </div>
                          <div className="flex justify-between text-dark-400">
                            <span>Missing Skills</span>
                            <span className="text-danger font-medium">{resultItem.analysis?.keywords?.missing?.length || 0}</span>
                          </div>
                          <div className="flex justify-between text-dark-400">
                            <span>Present Skills</span>
                            <span className="text-primary-100 font-medium">{resultItem.analysis?.keywords?.present?.length || 0}</span>
                          </div>
                        </div>

                        {resultItem.analysis?.keywords?.missing?.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-dark-700">
                            <p className="text-xs text-dark-500 mb-2">Top missing skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {resultItem.analysis.keywords.missing.slice(0, 5).map((keyword, j) => (
                                <span key={j} className="badge-missing text-[10px]">{keyword}</span>
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
