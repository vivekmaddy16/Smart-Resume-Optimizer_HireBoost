const { extractTextFromPDF } = require('../services/pdfParser');
const { compareKeywords } = require('../services/keywordExtractor');
const { analyzeResume, generateOptimizedResume, parseLinkedInProfile, multiTargetAnalysis } = require('../services/aiOptimizer');
const { generateLaTeX, generateOverleafURL } = require('../services/latexGenerator');
const Resume = require('../models/Resume');

function isDatabaseConnected() {
  return Resume.db?.readyState === 1;
}

function parseJobDescriptions(jobDescriptions) {
  if (Array.isArray(jobDescriptions)) {
    return jobDescriptions;
  }

  if (typeof jobDescriptions !== 'string' || !jobDescriptions.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(jobDescriptions);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * POST /api/resume/analyze
 * Main analysis endpoint — upload resume + JD
 */
exports.analyze = async (req, res) => {
  try {
    let resumeText = req.body.resumeText || '';
    const jdText = req.body.jdText;

    if (!jdText) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    // If PDF file uploaded, extract text
    if (req.file) {
      resumeText = await extractTextFromPDF(req.file.buffer);
    }

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text or PDF file is required' });
    }

    // Step 1: Basic keyword comparison
    const keywordComparison = compareKeywords(resumeText, jdText);

    // Step 2: AI-powered deep analysis
    const aiAnalysis = await analyzeResume(resumeText, jdText);

    // Merge keyword results
    const mergedKeywords = {
      present: [...new Set([...(aiAnalysis.keywords?.present || []), ...keywordComparison.present])],
      missing: [...new Set([...(aiAnalysis.keywords?.missing || []), ...keywordComparison.missing])],
      technical: [...new Set([...(aiAnalysis.keywords?.technical || []), ...keywordComparison.technical])],
      softSkills: [...new Set([...(aiAnalysis.keywords?.softSkills || []), ...keywordComparison.softSkills])],
      tools: [...new Set([...(aiAnalysis.keywords?.tools || []), ...keywordComparison.tools])]
    };

    const response = {
      success: true,
      resumeText,
      analysis: {
        ...aiAnalysis,
        keywords: mergedKeywords,
        keywordMatchPercentage: keywordComparison.matchPercentage
      }
    };

    // Save to MongoDB if connected
    if (isDatabaseConnected()) {
      try {
        await Resume.create({
          originalText: resumeText,
          jobDescription: jdText,
          atsScore: aiAnalysis.atsScore,
          keywords: mergedKeywords,
          bulletImprovements: aiAnalysis.bulletImprovements,
          skillGap: aiAnalysis.skillGap
        });
      } catch (dbError) {
        console.log('DB save skipped:', dbError.message);
      }
    } else {
      console.log('DB save skipped: database not connected');
    }

    res.json(response);
  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Analysis failed' });
  }
};

/**
 * POST /api/resume/optimize
 * Generate optimized resume
 */
exports.optimize = async (req, res) => {
  try {
    const { resumeText, jdText, analysisResults } = req.body;

    if (!resumeText || !jdText) {
      return res.status(400).json({ error: 'Resume text and job description are required' });
    }

    const optimized = await generateOptimizedResume(resumeText, jdText, analysisResults);

    res.json({
      success: true,
      ...optimized
    });
  } catch (error) {
    console.error('Optimization Error:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Optimization failed' });
  }
};

/**
 * POST /api/resume/multi-target
 * Analyze resume against multiple JDs
 */
exports.multiTarget = async (req, res) => {
  try {
    let resumeText = req.body.resumeText || '';
    const jobDescriptions = parseJobDescriptions(req.body.jobDescriptions);

    if (req.file) {
      resumeText = await extractTextFromPDF(req.file.buffer);
    }

    if (!resumeText || !jobDescriptions) {
      return res.status(400).json({ error: 'Resume text and array of job descriptions are required' });
    }

    const results = await multiTargetAnalysis(resumeText, jobDescriptions);

    res.json({
      success: true,
      resumeText,
      results
    });
  } catch (error) {
    console.error('Multi-target Error:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Multi-target analysis failed' });
  }
};

/**
 * POST /api/resume/linkedin-import
 * Import and parse LinkedIn profile
 */
exports.linkedinImport = async (req, res) => {
  try {
    const { profileText } = req.body;

    if (!profileText) {
      return res.status(400).json({ error: 'LinkedIn profile text is required' });
    }

    const parsed = await parseLinkedInProfile(profileText);

    res.json({
      success: true,
      profile: parsed
    });
  } catch (error) {
    console.error('LinkedIn Import Error:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'LinkedIn import failed' });
  }
};

/**
 * POST /api/resume/export/latex
 * Generate LaTeX source code
 */
exports.exportLatex = async (req, res) => {
  try {
    const { resumeText, template } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const latex = generateLaTeX({ resumeText }, template || 'professional');
    const overleafURL = generateOverleafURL(latex);

    res.json({
      success: true,
      latex,
      overleafURL
    });
  } catch (error) {
    console.error('LaTeX Export Error:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'LaTeX export failed' });
  }
};

/**
 * GET /api/resume/history
 * Get past analyses
 */
exports.getHistory = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json({ success: true, history: [], message: 'Database not connected' });
    }

    const history = await Resume.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('jobDescription atsScore createdAt');

    res.json({ success: true, history });
  } catch (error) {
    res.json({ success: true, history: [], message: 'Database not connected' });
  }
};
