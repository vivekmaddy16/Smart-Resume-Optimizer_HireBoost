/**
 * LaTeX Resume Generator
 * Generates professional LaTeX source code from resume data
 * Compatible with Overleaf for direct paste & compile
 */

/**
 * Escape special LaTeX characters in user text
 * Only escapes characters that have special meaning in LaTeX
 */
function escapeLatex(text) {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Parse resume text into structured sections
 */
function parseResumeIntoSections(text) {
  if (typeof text !== 'string') {
    return {
      name: '',
      email: '',
      phone: '',
      github: '',
      linkedin: '',
      location: '',
      summary: '',
      education: [],
      skills: '',
      experience: [],
      projects: [],
      certifications: [],
      coursework: '',
      additional: ''
    };
  }

  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const sections = {
    name: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    location: '',
    summary: '',
    education: [],
    skills: '',
    experience: [],
    projects: [],
    certifications: [],
    coursework: '',
    additional: ''
  };

  // Extract name from first line
  sections.name = lines[0] || 'Your Name';

  // Try to extract contact info from the first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Email
    const emailMatch = line.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
    if (emailMatch) sections.email = emailMatch[0];
    // Phone
    const phoneMatch = line.match(/(\+?\d[\d\s\-()]{7,}\d)/);
    if (phoneMatch) sections.phone = phoneMatch[1].trim();
    // GitHub
    const ghMatch = line.match(/github\.com\/[\w-]+/i);
    if (ghMatch) sections.github = ghMatch[0];
    // LinkedIn
    const liMatch = line.match(/linkedin\.com\/in\/[\w-]+/i);
    if (liMatch) sections.linkedin = liMatch[0];
  }

  // Detect section headers and map content
  const sectionMap = {
    'professional summary': 'summary',
    'summary': 'summary',
    'objective': 'summary',
    'about': 'summary',
    'profile': 'summary',
    'experience': 'experience',
    'work experience': 'experience',
    'employment': 'experience',
    'education': 'education',
    'academic': 'education',
    'academics': 'education',
    'skills': 'skills',
    'technical skills': 'skills',
    'competencies': 'skills',
    'core competencies': 'skills',
    'projects': 'projects',
    'personal projects': 'projects',
    'academic projects': 'projects',
    'certifications': 'certifications',
    'certificates': 'certifications',
    'certification': 'certifications',
    'relevant coursework': 'coursework',
    'coursework': 'coursework',
    'additional information': 'additional',
    'additional': 'additional',
    'interests': 'additional',
    'hobbies': 'additional',
    'extracurricular': 'additional'
  };

  let currentSection = null;
  let sectionContent = [];
  // Track where header/contact info ends
  let contentStartIdx = 1;
  for (let i = 1; i < Math.min(5, lines.length); i++) {
    const lower = lines[i].toLowerCase().replace(/[^a-z\s@.\/]/g, '').trim();
    if (sectionMap[lower]) {
      contentStartIdx = i;
      break;
    }
    // If a line contains mostly contact info, skip it
    if (lines[i].match(/[@|•·,]/) || lines[i].match(/github|linkedin|phone|mobile|email/i)) {
      contentStartIdx = i + 1;
    }
  }

  function flushSection() {
    if (!currentSection || sectionContent.length === 0) return;

    const content = sectionContent.join('\n');

    if (currentSection === 'summary') {
      // Remove contact info lines that are already in the header
      sections.summary = content
        .replace(/LinkedIn:\s*\S+\s*/gi, '')
        .replace(/GitHub:\s*\S+\s*/gi, '')
        .replace(/Email:\s*\S+\s*/gi, '')
        .replace(/Phone:\s*\S+\s*/gi, '')
        .replace(/Mobile:\s*\S+\s*/gi, '')
        .trim();
    } else if (currentSection === 'skills') {
      sections.skills = content;
    } else if (currentSection === 'coursework') {
      sections.coursework = content;
    } else if (currentSection === 'additional') {
      sections.additional = content;
    } else if (currentSection === 'education') {
      sections.education = parseEducationEntries(sectionContent);
    } else if (currentSection === 'experience') {
      sections.experience = parseExperienceEntries(sectionContent);
    } else if (currentSection === 'projects') {
      sections.projects = parseProjectEntries(sectionContent);
    } else if (currentSection === 'certifications') {
      sections.certifications = sectionContent.filter(l => l.trim());
    }

    sectionContent = [];
  }

  for (let i = contentStartIdx; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();

    if (sectionMap[lowerLine]) {
      flushSection();
      currentSection = sectionMap[lowerLine];
      continue;
    }

    if (currentSection) {
      sectionContent.push(line);
    }
  }
  flushSection();

  return sections;
}

/**
 * Parse education entries from lines
 * Handles formats like:
 *   • BBD University Lucknow, India
 *   B.Tech in Computer Science; CGPA: 7.89 2023 - Present
 */
function parseEducationEntries(lines) {
  const entries = [];
  let current = null;

  for (const line of lines) {
    const isBullet = /^[•\-*]\s/.test(line);
    const cleaned = line.replace(/^[•\-*]\s*/, '').trim();

    if (isBullet) {
      // Bullet line = new institution entry
      if (current) entries.push(current);
      current = { institution: cleaned, degree: '', dates: '', cgpa: '' };
    } else if (current) {
      // Non-bullet line following a bullet = degree/details
      const dateMatch = cleaned.match(/(\d{4}\s*[-–]\s*(Present|\d{4}))/i);
      const cgpaMatch = cleaned.match(/(?:CGPA|GPA|cgpa):\s*([\d.]+)/i);
      const percentMatch = cleaned.match(/([\d.]+)%/);

      if (dateMatch) current.dates = dateMatch[1];
      if (cgpaMatch) current.cgpa = 'CGPA: ' + cgpaMatch[1];
      if (percentMatch && !cgpaMatch) current.cgpa = percentMatch[0];

      // Extract degree information (strip out date and score info)
      let degreeText = cleaned
        .replace(/(\d{4}\s*[-–]\s*(Present|\d{4}))/i, '')
        .replace(/;?\s*(?:CGPA|GPA):\s*[\d.]+/i, '')
        .replace(/;?\s*[\d.]+%/, '')
        .replace(/;/g, '')
        .trim();

      if (degreeText) {
        current.degree = current.degree ? current.degree + '; ' + degreeText : degreeText;
      }
    } else {
      // No current and no bullet - standalone entry
      if (current) entries.push(current);
      const dateMatch = cleaned.match(/(\d{4}\s*[-–]\s*(Present|\d{4}))/i);
      current = {
        institution: cleaned.replace(/(\d{4}\s*[-–]\s*(Present|\d{4}))/i, '').trim(),
        degree: '',
        dates: dateMatch ? dateMatch[1] : '',
        cgpa: ''
      };
    }
  }
  if (current) entries.push(current);
  return entries;
}

/**
 * Parse experience entries from lines
 */
function parseExperienceEntries(lines) {
  const entries = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('–')) {
      const cleaned = line.replace(/^[•\-*–]\s*/, '').trim();
      if (current) {
        current.bullets.push(cleaned);
      }
    } else {
      if (current) entries.push(current);
      current = { title: line, bullets: [] };
    }
  }
  if (current) entries.push(current);
  return entries;
}

/**
 * Parse project entries from lines
 */
function parseProjectEntries(lines) {
  const entries = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('–')) {
      const cleaned = line.replace(/^[•\-*–]\s*/, '').trim();
      if (current) {
        current.bullets.push(cleaned);
      }
    } else {
      if (current) entries.push(current);
      // Try to split project name and tech stack
      const dashMatch = line.match(/^(.+?)\s*[-–—|]\s*(.+)$/);
      if (dashMatch) {
        current = { name: dashMatch[1].trim(), tech: dashMatch[2].trim(), bullets: [] };
      } else {
        current = { name: line.trim(), tech: '', bullets: [] };
      }
    }
  }
  if (current) entries.push(current);
  return entries;
}

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
  const e = escapeLatex;

  // Build contact line
  const contactParts = [];
  if (sections.email) contactParts.push(`\\href{mailto:${e(sections.email)}}{${e(sections.email)}}`);
  if (sections.phone) contactParts.push(e(sections.phone));
  if (sections.github) contactParts.push(`\\href{https://${e(sections.github)}}{${e(sections.github)}}`);
  if (sections.linkedin) contactParts.push(`\\href{https://${e(sections.linkedin)}}{${e(sections.linkedin)}}`);
  const contactLine = contactParts.join(' $|$ ');

  // Build sections
  let body = '';

  // --- HEADER ---
  body += `\\begin{center}
  \\textbf{\\Huge \\scshape ${e(sections.name)}} \\\\ \\vspace{1pt}
  \\small ${contactLine || e('email@example.com')}
\\end{center}
`;

  // --- PROFESSIONAL SUMMARY ---
  if (sections.summary) {
    body += `
%-----------PROFESSIONAL SUMMARY-----------
\\section{Professional Summary}
${e(sections.summary)}
`;
  }

  // --- EDUCATION ---
  if (sections.education.length > 0) {
    body += `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
`;
    for (const edu of sections.education) {
      const inst = e(edu.institution);
      const deg = e(edu.degree);
      const dates = e(edu.dates);
      const cgpa = edu.cgpa ? e(edu.cgpa) : '';
      const degreeWithCgpa = deg + (cgpa ? '; ' + cgpa : '');
      body += `    \\resumeSubheading
      {${inst}}{${dates}}
      {${degreeWithCgpa}}{}
`;
    }
    body += `  \\resumeSubHeadingListEnd
`;
  }

  // --- TECHNICAL SKILLS ---
  if (sections.skills) {
    body += `
%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${formatSkillsLatex(sections.skills)}
    }}
 \\end{itemize}
`;
  }

  // --- PROJECTS ---
  if (sections.projects.length > 0) {
    body += `
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
`;
    for (const proj of sections.projects) {
      const techPart = proj.tech ? ` $|$ \\emph{${e(proj.tech)}}` : '';
      body += `      \\resumeProjectHeading
          {\\textbf{${e(proj.name)}}${techPart}}{}
`;
      if (proj.bullets.length > 0) {
        body += `          \\resumeItemListStart
`;
        for (const bullet of proj.bullets) {
          body += `            \\resumeItem{${e(bullet)}}
`;
        }
        body += `          \\resumeItemListEnd
`;
      }
    }
    body += `    \\resumeSubHeadingListEnd
`;
  }

  // --- EXPERIENCE ---
  if (sections.experience.length > 0) {
    body += `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
`;
    for (const exp of sections.experience) {
      body += `    \\resumeSubheading
      {${e(exp.title)}}{}
      {}{}
`;
      if (exp.bullets.length > 0) {
        body += `      \\resumeItemListStart
`;
        for (const bullet of exp.bullets) {
          body += `        \\resumeItem{${e(bullet)}}
`;
        }
        body += `      \\resumeItemListEnd
`;
      }
    }
    body += `  \\resumeSubHeadingListEnd
`;
  }

  // --- CERTIFICATIONS ---
  if (sections.certifications.length > 0) {
    body += `
%-----------CERTIFICATIONS-----------
\\section{Certifications}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
`;
    for (const cert of sections.certifications) {
      body += `     ${e(cert)} \\\\
`;
    }
    body += `    }}
 \\end{itemize}
`;
  }

  // --- RELEVANT COURSEWORK ---
  if (sections.coursework) {
    body += `
%-----------COURSEWORK-----------
\\section{Relevant Coursework}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${e(sections.coursework)}
    }}
 \\end{itemize}
`;
  }

  // --- ADDITIONAL INFORMATION ---
  if (sections.additional) {
    body += `
%-----------ADDITIONAL INFORMATION-----------
\\section{Additional Information}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${e(sections.additional)}
    }}
 \\end{itemize}
`;
  }

  // Wrap in document
  const preamble = `%-------------------------
% Resume in LaTeX
% Based on Jake's Resume template
% License: MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

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
\\input{glyphtounicode}

%----------FONT OPTIONS----------
\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generated pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
`;

  return preamble + `\\begin{document}

` + body + `
\\end{document}
`;
}

/**
 * Format skills text for LaTeX
 * Tries to detect categories like "Languages: ..., Frameworks: ..."
 */
function formatSkillsLatex(text) {
  if (!text) return '';
  const e = escapeLatex;
  
  // Check if skills have category labels (e.g., "Programming Languages: ..." or "Languages: ...")
  const lines = text.split('\n').filter(l => l.trim());
  const formatted = [];
  
  for (const line of lines) {
    const colonMatch = line.match(/^([^:]+):\s*(.+)$/);
    if (colonMatch) {
      formatted.push(`\\textbf{${e(colonMatch[1].replace(/^[•\-*]\s*/, '').trim())}}{: ${e(colonMatch[2].trim())}}`);
    } else {
      // Detect bullet-separated items
      const cleaned = line.replace(/^[•\-*]\s*/, '').trim();
      if (cleaned) {
        formatted.push(e(cleaned));
      }
    }
  }
  
  return formatted.join(' \\\\\n     ');
}

function generateModernTemplate(data) {
  // Same structure but with colored section headers
  return generateProfessionalTemplate(data)
    .replace('\\usepackage[usenames,dvipsnames]{color}', '\\usepackage[usenames,dvipsnames]{xcolor}\n\\definecolor{primary}{HTML}{2563EB}')
    .replace('\\color{black}\\titlerule', '\\color{primary}\\titlerule');
}

function generateMinimalTemplate(data) {
  return generateProfessionalTemplate(data);
}

/**
 * Generate Overleaf-compatible URL
 */
function generateOverleafURL(latexContent) {
  const encoded = encodeURIComponent(latexContent);
  return `https://www.overleaf.com/docs?snip_uri=data:application/x-tex;charset=utf-8,${encoded}`;
}

module.exports = { generateLaTeX, generateOverleafURL, parseResumeIntoSections };
