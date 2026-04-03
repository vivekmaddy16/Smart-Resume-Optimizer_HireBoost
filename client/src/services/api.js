import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 min timeout for AI processing
});

/**
 * Analyze resume against job description
 */
export async function analyzeResume(resumeFile, resumeText, jdText) {
  const formData = new FormData();
  
  if (resumeFile) {
    formData.append('resume', resumeFile);
  }
  if (resumeText) {
    formData.append('resumeText', resumeText);
  }
  formData.append('jdText', jdText);

  const response = await api.post('/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * Generate optimized resume
 */
export async function optimizeResume(resumeText, jdText, analysisResults) {
  const response = await api.post('/resume/optimize', {
    resumeText,
    jdText,
    analysisResults,
  });
  return response.data;
}

/**
 * Multi-target analysis
 */
export async function multiTargetAnalysis(resumeFile, resumeText, jobDescriptions) {
  const formData = new FormData();
  
  if (resumeFile) {
    formData.append('resume', resumeFile);
  }
  if (resumeText) {
    formData.append('resumeText', resumeText);
  }
  formData.append('jobDescriptions', JSON.stringify(jobDescriptions));

  const response = await api.post('/resume/multi-target', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * Import LinkedIn profile
 */
export async function importLinkedIn(profileText) {
  const response = await api.post('/resume/linkedin-import', { profileText });
  return response.data;
}

/**
 * Export as LaTeX
 */
export async function exportLaTeX(resumeText, template) {
  const response = await api.post('/resume/export/latex', { resumeText, template });
  return response.data;
}

/**
 * Get analysis history
 */
export async function getHistory() {
  const response = await api.get('/resume/history');
  return response.data;
}

export default api;
