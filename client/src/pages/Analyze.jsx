import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlineSparkles, HiOutlineX, HiOutlineLink } from 'react-icons/hi';
import { analyzeResume, importLinkedIn } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Analyze() {
  const MotionDiv = motion.div;
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'paste' | 'linkedin'
  const [linkedinText, setLinkedinText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File must be under 5MB');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleLinkedInImport = async () => {
    if (!linkedinText.trim()) {
      setError('Please paste your LinkedIn profile content');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await importLinkedIn(linkedinText);
      if (result.success && result.profile) {
        setResumeText(result.profile.resumeText || JSON.stringify(result.profile, null, 2));
        setInputMode('paste');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'LinkedIn import failed');
    }
    setLoading(false);
  };

  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      setError('Please enter a job description');
      return;
    }
    if (!resumeFile && !resumeText.trim()) {
      setError('Please upload a resume or paste resume text');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await analyzeResume(resumeFile, resumeText, jdText);
      // Navigate to results with data
      navigate('/results', { state: { result, jdText } });
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Analyze Your <span className="gradient-text">Resume</span>
          </h1>
          <p className="text-dark-400 text-lg">
            Upload your resume and paste the job description to get AI-powered insights.
          </p>
        </div>

        {error && (
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center justify-between"
          >
            <span>{error}</span>
            <button onClick={() => setError('')} className="hover:text-white">
              <HiOutlineX className="w-4 h-4" />
            </button>
          </MotionDiv>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left — Resume Input */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <HiOutlineDocumentText className="w-5 h-5 text-primary-400" />
              Your Resume
            </h2>

            {/* Input Mode Tabs */}
            <div className="flex gap-2 mb-5">
              {[
                { key: 'upload', label: '📄 Upload PDF', icon: HiOutlineCloudUpload },
                { key: 'paste', label: '📝 Paste Text', icon: HiOutlineDocumentText },
                { key: 'linkedin', label: '🔗 LinkedIn', icon: HiOutlineLink },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setInputMode(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    inputMode === key
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                      : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Upload Mode */}
            {inputMode === 'upload' && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-500/5'
                    : resumeFile
                    ? 'border-accent-500/50 bg-accent-500/5'
                    : 'border-dark-600 hover:border-primary-500/50 hover:bg-dark-800/50'
                }`}
              >
                <input {...getInputProps()} />
                {resumeFile ? (
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-accent-500/15 flex items-center justify-center mx-auto mb-4">
                      <HiOutlineDocumentText className="w-7 h-7 text-accent-400" />
                    </div>
                    <p className="text-accent-400 font-medium">{resumeFile.name}</p>
                    <p className="text-dark-500 text-sm mt-1">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                      className="mt-3 text-red-400 text-sm hover:text-red-300 flex items-center gap-1 mx-auto"
                    >
                      <HiOutlineX className="w-4 h-4" /> Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                      <HiOutlineCloudUpload className="w-7 h-7 text-primary-400" />
                    </div>
                    <p className="text-dark-200 font-medium">
                      {isDragActive ? 'Drop your resume here!' : 'Drag & drop your resume PDF'}
                    </p>
                    <p className="text-dark-500 text-sm mt-1">or click to browse • PDF only • Max 5MB</p>
                  </div>
                )}
              </div>
            )}

            {/* Paste Mode */}
            {inputMode === 'paste' && (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="input-field h-72 resize-none font-mono text-sm"
              />
            )}

            {/* LinkedIn Mode */}
            {inputMode === 'linkedin' && (
              <div>
                <p className="text-dark-400 text-sm mb-3">
                  Copy your LinkedIn profile content (About, Experience, Skills sections) and paste below:
                </p>
                <textarea
                  value={linkedinText}
                  onChange={(e) => setLinkedinText(e.target.value)}
                  placeholder="Paste your LinkedIn profile content here... (Copy from your profile page)"
                  className="input-field h-52 resize-none font-mono text-sm mb-4"
                />
                <button
                  onClick={handleLinkedInImport}
                  disabled={!linkedinText.trim()}
                  className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <HiOutlineLink className="w-5 h-5" />
                  Import & Parse Profile
                </button>
              </div>
            )}
          </div>

          {/* Right — Job Description */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5 text-accent-400" />
              Job Description
            </h2>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here...

Example:
We are looking for a Full Stack Developer with experience in:
- React.js, Node.js, TypeScript
- RESTful APIs and microservices
- AWS cloud services
- Agile methodology

Requirements:
- 3+ years experience
- Bachelor's in CS or related field
- Strong problem-solving skills"
              className="input-field h-[420px] resize-none text-sm"
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleAnalyze}
            disabled={(!resumeFile && !resumeText.trim()) || !jdText.trim()}
            className="btn-primary text-lg px-12 py-4 inline-flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed animate-pulse-glow"
          >
            <HiOutlineSparkles className="w-6 h-6" />
            Analyze with AI
          </button>
          <p className="text-dark-500 text-sm mt-3">Free • Takes ~30 seconds • Powered by Gemini AI</p>
        </div>
      </MotionDiv>
    </div>
  );
}
