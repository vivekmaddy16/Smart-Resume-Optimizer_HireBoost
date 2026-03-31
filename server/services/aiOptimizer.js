const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES || 3);

class AIServiceError extends Error {
  constructor(message, { statusCode = 500, retryable = false } = {}) {
    super(message);
    this.name = 'AIServiceError';
    this.statusCode = statusCode;
    this.retryable = retryable;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getModel() {
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

function getErrorMessage(error) {
  return error?.message || 'Unknown AI error';
}

function isRetryableAIError(error) {
  const message = getErrorMessage(error).toLowerCase();

  return [
    '429',
    '500',
    '503',
    'deadline exceeded',
    'resource exhausted',
    'service unavailable',
    'temporarily unavailable',
    'high demand',
    'overloaded',
    'rate limit'
  ].some(fragment => message.includes(fragment));
}

function extractJsonPayload(text) {
  const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');

  if (start !== -1 && end > start) {
    return cleaned.slice(start, end + 1);
  }

  return cleaned;
}

function parseJsonResponse(text, taskLabel) {
  try {
    return JSON.parse(extractJsonPayload(text));
  } catch {
    throw new AIServiceError(`${taskLabel} returned an unreadable response. Please try again.`, {
      statusCode: 502
    });
  }
}

async function generateJsonResponse(prompt, taskLabel) {
  const model = getModel();
  let lastError;

  for (let attempt = 1; attempt <= GEMINI_MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return parseJsonResponse(result.response.text(), taskLabel);
    } catch (error) {
      lastError = error;
      const retryable = isRetryableAIError(error);

      console.error(`${taskLabel} attempt ${attempt} failed:`, getErrorMessage(error));

      if (!retryable || attempt === GEMINI_MAX_RETRIES) {
        break;
      }

      const delayMs = Math.min(2000 * (2 ** (attempt - 1)), 8000);
      await sleep(delayMs);
    }
  }

  if (isRetryableAIError(lastError)) {
    throw new AIServiceError('Gemini is temporarily experiencing high demand. Please try again in a minute.', {
      statusCode: 503,
      retryable: true
    });
  }

  throw new AIServiceError(`${taskLabel} failed: ${getErrorMessage(lastError)}`, {
    statusCode: 500
  });
}

/**
 * Full resume analysis - the main function
 */
async function analyzeResume(resumeText, jdText) {
  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and professional resume optimizer.

Given the following resume and job description, perform a comprehensive analysis.

=== RESUME ===
${resumeText}

=== JOB DESCRIPTION ===
${jdText}

Return your analysis as a valid JSON object with EXACTLY this structure (no markdown, no code fences, just raw JSON):
{
  "atsScore": {
    "overall": <number 0-100>,
    "keywordMatch": <number 0-100>,
    "formatting": <number 0-100>,
    "impactMetrics": <number 0-100>,
    "atsCompatibility": <number 0-100>
  },
  "keywords": {
    "present": ["skill1", "skill2"],
    "missing": ["skill3", "skill4"],
    "technical": ["tech1", "tech2"],
    "softSkills": ["soft1", "soft2"],
    "tools": ["tool1", "tool2"]
  },
  "bulletImprovements": [
    {
      "original": "original weak bullet point from resume",
      "improved": "stronger version with action verbs and measurable impact",
      "section": "Experience/Projects/etc"
    }
  ],
  "skillGap": [
    {
      "skill": "skill name",
      "category": "technical/soft/tool",
      "importance": "critical/important/nice-to-have",
      "inResume": true/false
    }
  ],
  "sectionFeedback": {
    "summary": "feedback on summary/objective section",
    "experience": "feedback on experience section",
    "skills": "feedback on skills section",
    "projects": "feedback on projects section",
    "education": "feedback on education section"
  },
  "overallFeedback": "2-3 sentence overall assessment",
  "topRecommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}

Be specific, actionable, and data-driven. For bullet improvements, transform at least 3-5 weak bullets. For skill gap, list at least 8-10 skills from the JD.`;

  return generateJsonResponse(prompt, 'Resume analysis');
}

/**
 * Generate fully optimized resume text
 */
async function generateOptimizedResume(resumeText, jdText, analysisResults) {
  const prompt = `You are a professional resume writer and ATS optimization expert.

Given the original resume, job description, and analysis results, generate a COMPLETE optimized resume.

=== ORIGINAL RESUME ===
${resumeText}

=== JOB DESCRIPTION ===
${jdText}

=== ANALYSIS (missing skills, weak areas) ===
Missing Keywords: ${JSON.stringify(analysisResults?.keywords?.missing || [])}
Top Recommendations: ${JSON.stringify(analysisResults?.topRecommendations || [])}

INSTRUCTIONS:
1. Keep all factual information (name, contact, dates, company names) EXACTLY the same
2. Rewrite bullet points with strong action verbs and quantifiable achievements
3. Naturally incorporate missing keywords where truthful
4. Optimize section ordering for ATS scanners
5. Improve the professional summary/objective to match the JD
6. Ensure clean formatting with clear section headers

Return your response as a valid JSON object (no markdown, no code fences):
{
  "optimizedResume": "The full optimized resume text with proper formatting using newlines",
  "changesSummary": ["change 1 description", "change 2 description", "change 3 description"],
  "newATSScore": <estimated new score 0-100>
}`;

  return generateJsonResponse(prompt, 'Resume optimization');
}

/**
 * Parse LinkedIn profile text into structured resume data
 */
async function parseLinkedInProfile(profileText) {
  const prompt = `You are an expert at parsing LinkedIn profiles into structured resume data.

Given the following LinkedIn profile text/data, extract and structure it into resume format.

=== LINKEDIN PROFILE ===
${profileText}

Return a valid JSON object (no markdown, no code fences):
{
  "name": "Full Name",
  "headline": "Professional headline",
  "summary": "Professional summary",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End",
      "description": "Key responsibilities and achievements"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "School name",
      "year": "Graduation year"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "certifications": ["cert1", "cert2"],
  "resumeText": "Full formatted resume text combining all sections above"
}`;

  return generateJsonResponse(prompt, 'LinkedIn parsing');
}

/**
 * Multi-target analysis - analyze resume against multiple JDs
 */
async function multiTargetAnalysis(resumeText, jobDescriptions) {
  const results = [];

  for (const jd of jobDescriptions) {
    try {
      const analysis = await analyzeResume(resumeText, jd.text);
      results.push({
        jobTitle: jd.title || 'Untitled Position',
        company: jd.company || 'Unknown Company',
        analysis
      });
    } catch (error) {
      results.push({
        jobTitle: jd.title || 'Untitled Position',
        company: jd.company || 'Unknown Company',
        error: error.message
      });
    }
  }

  results.sort((a, b) => {
    const scoreA = a.analysis?.atsScore?.overall || 0;
    const scoreB = b.analysis?.atsScore?.overall || 0;
    return scoreB - scoreA;
  });

  return results;
}

module.exports = {
  AIServiceError,
  analyzeResume,
  generateOptimizedResume,
  parseLinkedInProfile,
  multiTargetAnalysis
};
