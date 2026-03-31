/**
 * Basic keyword extraction using TF-IDF-like approach
 * Used as a fallback/supplement to AI-based extraction
 */

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','as','is','was','are','were','been','be','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall',
  'can','need','must','i','you','he','she','it','we','they','me','him',
  'her','us','them','my','your','his','its','our','their','this','that',
  'these','those','what','which','who','whom','when','where','why','how',
  'all','each','every','both','few','more','most','other','some','such',
  'no','not','only','own','same','so','than','too','very','just','about',
  'above','after','again','against','also','am','an','any','because',
  'before','being','below','between','during','etc','experience','work',
  'working','worked','using','used','use','new','able','ensure','including',
  'strong','well','team','role','job','position','company','years','year',
  'looking','seeking','responsible','responsibilities','requirements',
  'required','preferred','skills','knowledge','understanding','ability'
]);

const SKILL_PATTERNS = {
  technical: [
    'javascript','typescript','python','java','c\\+\\+','c#','ruby','go','rust','swift','kotlin',
    'react','angular','vue','next\\.js','node\\.js','express','django','flask','spring',
    'html','css','sass','tailwind','bootstrap','jquery',
    'sql','mysql','postgresql','mongodb','redis','elasticsearch','firebase',
    'aws','azure','gcp','docker','kubernetes','jenkins','ci/cd','terraform',
    'git','github','gitlab','bitbucket',
    'rest','graphql','api','microservices','websocket',
    'machine learning','deep learning','nlp','computer vision','tensorflow','pytorch',
    'data science','data analysis','pandas','numpy','tableau','power bi',
    'agile','scrum','kanban','jira','confluence'
  ],
  softSkills: [
    'leadership','communication','problem solving','teamwork','collaboration',
    'analytical','critical thinking','time management','adaptability','creativity',
    'mentoring','presentation','negotiation','conflict resolution','decision making',
    'project management','strategic planning','stakeholder management'
  ],
  tools: [
    'figma','sketch','adobe','photoshop','illustrator','xd',
    'slack','notion','trello','asana','monday',
    'postman','swagger','webpack','vite','babel',
    'linux','bash','powershell','terminal',
    'excel','word','powerpoint','google sheets'
  ]
};

/**
 * Extract keywords from text
 */
function extractKeywords(text) {
  const words = text.toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  // Count word frequency
  const freq = {};
  words.forEach(word => {
    freq[word] = (freq[word] || 0) + 1;
  });

  // Extract bigrams (two-word phrases)
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i+1]}`);
  }
  bigrams.forEach(bg => {
    freq[bg] = (freq[bg] || 0) + 1;
  });

  // Sort by frequency
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);

  return sorted;
}

/**
 * Categorize keywords by type
 */
function categorizeKeywords(keywords, text) {
  const lowerText = text.toLowerCase();
  const categorized = { technical: [], softSkills: [], tools: [], other: [] };

  // Check for known skill patterns
  for (const [category, patterns] of Object.entries(SKILL_PATTERNS)) {
    for (const pattern of patterns) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      if (regex.test(lowerText)) {
        categorized[category].push(pattern.replace(/\\\./g, '.').replace(/\\\+/g, '+'));
      }
    }
  }

  return categorized;
}

/**
 * Compare resume keywords with JD keywords
 */
function compareKeywords(resumeText, jdText) {
  const resumeKeywords = new Set(extractKeywords(resumeText));
  const jdKeywords = extractKeywords(jdText);
  const jdCategorized = categorizeKeywords(jdKeywords, jdText);
  const resumeCategorized = categorizeKeywords([], resumeText);

  const allJDSkills = [
    ...jdCategorized.technical,
    ...jdCategorized.softSkills,
    ...jdCategorized.tools
  ];

  const allResumeSkills = [
    ...resumeCategorized.technical,
    ...resumeCategorized.softSkills,
    ...resumeCategorized.tools
  ];

  const present = allJDSkills.filter(skill => 
    allResumeSkills.includes(skill) || resumeText.toLowerCase().includes(skill)
  );
  const missing = allJDSkills.filter(skill => 
    !allResumeSkills.includes(skill) && !resumeText.toLowerCase().includes(skill)
  );

  return {
    present: [...new Set(present)],
    missing: [...new Set(missing)],
    technical: jdCategorized.technical,
    softSkills: jdCategorized.softSkills,
    tools: jdCategorized.tools,
    jdKeywords: jdKeywords.slice(0, 30),
    matchPercentage: allJDSkills.length > 0 
      ? Math.round((present.length / allJDSkills.length) * 100) 
      : 0
  };
}

module.exports = { extractKeywords, categorizeKeywords, compareKeywords };
