/**
 * LaTeX Resume Generator
 * Generates professional LaTeX source code from resume data
 * Compatible with Overleaf for one-click import
 */

/**
 * Generate LaTeX resume source code
 */
function generateLaTeX(resumeData, template = 'professional') {
  const templates = {
    professional: generateProfessionalTemplate,
    modern: generateModernTemplate,
    minimal: generateMinimalTemplate
  };

  const generator = templates[template] || templates.professional;
  return generator(resumeData);
}

function generateProfessionalTemplate(data) {
  const sections = parseResumeIntoSections(data.resumeText || data);
  
  return `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[1]{
  \\item\\small{#1 \\vspace{-2pt}}
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%--- HEADER ---
\\begin{center}
  \\textbf{\\Huge \\scshape ${escapeLatex(sections.name || 'Your Name')}} \\\\ \\vspace{1pt}
  \\small ${escapeLatex(sections.contact || 'email@example.com | (123) 456-7890 | City, State')}
\\end{center}

${sections.summary ? `
%--- SUMMARY ---
\\section{Professional Summary}
${escapeLatex(sections.summary)}
` : ''}

${sections.experience ? `
%--- EXPERIENCE ---
\\section{Experience}
  \\resumeSubHeadingListStart
${formatExperienceLatex(sections.experience)}
  \\resumeSubHeadingListEnd
` : ''}

${sections.education ? `
%--- EDUCATION ---
\\section{Education}
  \\resumeSubHeadingListStart
${formatEducationLatex(sections.education)}
  \\resumeSubHeadingListEnd
` : ''}

${sections.skills ? `
%--- SKILLS ---
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${escapeLatex(sections.skills)}
    }}
 \\end{itemize}
` : ''}

${sections.projects ? `
%--- PROJECTS ---
\\section{Projects}
  \\resumeSubHeadingListStart
${formatProjectsLatex(sections.projects)}
  \\resumeSubHeadingListEnd
` : ''}

\\end{document}`;
}

function generateModernTemplate(data) {
  // Slightly different styling with colored headers
  const sections = parseResumeIntoSections(data.resumeText || data);
  return generateProfessionalTemplate(data)
    .replace('\\usepackage[usenames,dvipsnames]{color}', '\\usepackage[usenames,dvipsnames]{xcolor}\n\\definecolor{primary}{HTML}{2563EB}')
    .replace('\\color{black}\\titlerule', '\\color{primary}\\titlerule');
}

function generateMinimalTemplate(data) {
  return generateProfessionalTemplate(data);
}

/**
 * Parse resume text into sections
 */
function parseResumeIntoSections(text) {
  if (typeof text !== 'string') {
    return { name: '', contact: '', summary: '', experience: '', education: '', skills: '', projects: '' };
  }

  const lines = text.split('\n');
  const sections = {
    name: lines[0] || 'Your Name',
    contact: lines[1] || '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: ''
  };

  let currentSection = 'summary';
  const sectionMap = {
    'summary': 'summary', 'objective': 'summary', 'about': 'summary', 'professional summary': 'summary',
    'experience': 'experience', 'work experience': 'experience', 'employment': 'experience',
    'education': 'education', 'academic': 'education',
    'skills': 'skills', 'technical skills': 'skills', 'competencies': 'skills',
    'projects': 'projects', 'personal projects': 'projects', 'academic projects': 'projects'
  };

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    
    if (sectionMap[lowerLine]) {
      currentSection = sectionMap[lowerLine];
      continue;
    }
    
    if (currentSection && line) {
      sections[currentSection] += line + '\n';
    }
  }

  return sections;
}

function escapeLatex(text) {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, match => '\\' + match)
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function formatExperienceLatex(text) {
  if (!text) return '';
  const lines = text.trim().split('\n').filter(l => l.trim());
  let result = '';
  
  for (const line of lines) {
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      result += `    \\resumeItem{${escapeLatex(line.replace(/^[•\-*]\s*/, ''))}}\n`;
    } else {
      result += `    \\resumeSubheading{${escapeLatex(line)}}{}{}{}\n`;
    }
  }
  return result;
}

function formatEducationLatex(text) {
  if (!text) return '';
  const lines = text.trim().split('\n').filter(l => l.trim());
  let result = '';
  for (const line of lines) {
    result += `    \\resumeSubheading{${escapeLatex(line)}}{}{}{}\n`;
  }
  return result;
}

function formatProjectsLatex(text) {
  if (!text) return '';
  const lines = text.trim().split('\n').filter(l => l.trim());
  let result = '';
  for (const line of lines) {
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      result += `    \\resumeItem{${escapeLatex(line.replace(/^[•\-*]\s*/, ''))}}\n`;
    } else {
      result += `    \\resumeProjectHeading{\\textbf{${escapeLatex(line)}}}{}\n`;
    }
  }
  return result;
}

/**
 * Generate Overleaf-compatible URL
 */
function generateOverleafURL(latexContent) {
  const encoded = encodeURIComponent(latexContent);
  return `https://www.overleaf.com/docs?snip_uri=data:application/x-tex;charset=utf-8,${encoded}`;
}

module.exports = { generateLaTeX, generateOverleafURL, parseResumeIntoSections };
