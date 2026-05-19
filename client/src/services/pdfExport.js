import html2pdf from 'html2pdf.js';

// ─────────────────────────────────────────────
// TEXT UTILITIES
// ─────────────────────────────────────────────

function cleanMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
}

function isSectionHeading(line) {
  const cleaned = line.replace(/[^a-zA-Z\s&]/g, '').trim().toUpperCase();
  const headings = [
    'PROFESSIONAL SUMMARY', 'SUMMARY', 'PROFILE', 'OBJECTIVE', 'CAREER OBJECTIVE',
    'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT', 'PROFESSIONAL EXPERIENCE',
    'EDUCATION', 'ACADEMIC BACKGROUND', 'ACADEMICS',
    'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES', 'PROFESSIONAL COMPETENCIES', 'KEY SKILLS',
    'PROJECTS', 'ACADEMIC PROJECTS', 'KEY PROJECTS', 'PERSONAL PROJECTS',
    'CERTIFICATIONS', 'CERTIFICATES', 'LICENSES',
    'ACHIEVEMENTS', 'AWARDS', 'HONORS', 'ACHIEVEMENTS & ACTIVITIES',
    'ACTIVITIES', 'EXTRACURRICULAR', 'EXTRACURRICULAR ACTIVITIES',
    'INTERESTS', 'HOBBIES', 'LANGUAGES', 'REFERENCES', 'PUBLICATIONS',
    'VOLUNTEER', 'VOLUNTEER EXPERIENCE', 'TRAINING', 'WORKSHOPS',
  ];
  return headings.some((h) => cleaned === h || cleaned.startsWith(h));
}

function isContactInfo(line) {
  return /[\w.-]+@[\w.-]+\.\w+/.test(line) || /(\+?\d[\d\s\-().]{7,})/.test(line) || /(linkedin\.com|github\.com|http|www\.)/i.test(line);
}

function isRoleLine(line) {
  return /\b(20\d{2}|19\d{2})\b/.test(line) && /[|–\-—]/.test(line);
}

function isBullet(line) {
  return /^[\s]*[-•●▪▸►‣⦿→✦✓]\s/.test(line) || /^\s*\d+[.)]\s/.test(line);
}

// ─────────────────────────────────────────────
// RESUME PARSER
// ─────────────────────────────────────────────

function parseResume(text) {
  const lines = text.split('\n').map((l) => l.trimEnd());
  const resume = { name: '', contactLines: [], sections: [] };
  let currentSection = null;
  let headerDone = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (!resume.name && !headerDone) {
      resume.name = line.replace(/\*\*/g, '').trim();
      continue;
    }

    if (!headerDone && !isSectionHeading(line)) {
      if (isContactInfo(line) || (!currentSection && resume.contactLines.length < 3)) {
        const parts = line.split(/\s*[|]\s*/).filter(Boolean);
        resume.contactLines.push(...parts);
        continue;
      }
    }

    if (isSectionHeading(line)) {
      headerDone = true;
      currentSection = { title: line.replace(/\*\*/g, '').replace(/[:\-]+$/, '').trim().toUpperCase(), entries: [] };
      resume.sections.push(currentSection);
      continue;
    }

    headerDone = true;

    if (!currentSection) {
      if (isContactInfo(line)) {
        resume.contactLines.push(...line.split(/\s*[|]\s*/).filter(Boolean));
      } else {
        currentSection = { title: 'PROFESSIONAL SUMMARY', entries: [] };
        resume.sections.push(currentSection);
        currentSection.entries.push({ type: 'text', content: line });
      }
      continue;
    }

    if (isBullet(line)) {
      const cleaned = line.replace(/^[\s]*[-•●▪▸►‣⦿→✦✓]\s*/, '').replace(/^\d+[.)]\s*/, '');
      currentSection.entries.push({ type: 'bullet', content: cleaned });
    } else if (isRoleLine(line)) {
      currentSection.entries.push({ type: 'role', content: line });
    } else if (line.match(/^[A-Z][\w\s,&.()-]+$/) && line.length < 80 && !line.includes('.') && currentSection.title.match(/EXPERIENCE|PROJECT/)) {
      currentSection.entries.push({ type: 'subheading', content: line });
    } else {
      currentSection.entries.push({ type: 'text', content: line });
    }
  }

  return resume;
}

function buildSectionContent(entries) {
  let html = '';
  for (const entry of entries) {
    const cleaned = cleanMarkdown(entry.content);
    switch (entry.type) {
      case 'bullet': html += `<li>${cleaned}</li>`; break;
      case 'role': html += `<div class="role-line">${cleaned}</div>`; break;
      case 'subheading': html += `<div class="sub-heading">${cleaned}</div>`; break;
      default: html += `<p class="text-line">${cleaned}</p>`; break;
    }
  }
  return html.replace(/(<li>[\s\S]*?<\/li>)+/g, (match) => `<ul>${match}</ul>`);
}

// ─────────────────────────────────────────────
// TEMPLATE DEFINITIONS
// ─────────────────────────────────────────────

export const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional serif layout — timeless and professional',
    preview: '📄',
    color: '#1a1a1a',
    accent: '#333',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean sans-serif design with blue accents',
    preview: '💎',
    color: '#1e40af',
    accent: '#2563eb',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean with maximum whitespace',
    preview: '✨',
    color: '#374151',
    accent: '#6b7280',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Bold sidebar-style layout for senior roles',
    preview: '🏢',
    color: '#1e3a5f',
    accent: '#1e3a5f',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant design with gradient accents',
    preview: '🎨',
    color: '#7c3aed',
    accent: '#8b5cf6',
  },
  {
    id: 'ats_optimized',
    name: 'ATS Optimized',
    description: 'Maximum ATS compatibility — no graphics, pure text',
    preview: '🤖',
    color: '#059669',
    accent: '#10b981',
  },
];

// ─────────────────────────────────────────────
// TEMPLATE STYLES
// ─────────────────────────────────────────────

function getTemplateStyles(templateId) {
  const styles = {
    // ── CLASSIC ──
    classic: `
      #resume-pdf-content {
        font-family: 'Georgia', 'Times New Roman', serif;
        color: #222; padding: 40px 48px; max-width: 780px; margin: 0 auto; line-height: 1.5; font-size: 11px;
      }
      .header { text-align: center; margin-bottom: 10px; padding-bottom: 12px; border-bottom: 2.5px solid #1a1a1a; }
      .header .name { font-size: 26px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #111; margin: 0 0 6px 0; }
      .header .contact { font-size: 10px; color: #444; line-height: 1.8; }
      .header .contact .row { display: flex; justify-content: center; flex-wrap: wrap; gap: 4px; }
      .header .contact .sep { margin: 0 8px; color: #999; }
      .section { margin-bottom: 12px; }
      .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #111; border-bottom: 1.5px solid #555; padding-bottom: 3px; margin-bottom: 7px; }
      .section-body { font-size: 10.5px; color: #222; }
      .text-line { margin: 2px 0; line-height: 1.55; }
      .role-line { font-weight: 700; font-size: 11px; margin-top: 7px; margin-bottom: 1px; color: #111; }
      .sub-heading { font-weight: 700; font-size: 11px; margin-top: 8px; margin-bottom: 1px; color: #111; font-style: italic; }
      .section-body ul { margin: 3px 0 3px 18px; padding: 0; list-style-type: disc; }
      .section-body li { margin-bottom: 2px; font-size: 10.5px; line-height: 1.55; }
      strong { font-weight: 700; color: #111; }
    `,

    // ── MODERN ──
    modern: `
      #resume-pdf-content {
        font-family: 'Calibri', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
        color: #1f2937; padding: 36px 44px; max-width: 780px; margin: 0 auto; line-height: 1.45; font-size: 11px;
      }
      .header { text-align: center; margin-bottom: 10px; padding-bottom: 12px; border-bottom: 3px solid #2563eb; }
      .header .name { font-size: 28px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #1e40af; margin: 0 0 6px 0; }
      .header .contact { font-size: 10px; color: #4b5563; line-height: 1.7; }
      .header .contact .row { display: flex; justify-content: center; flex-wrap: wrap; gap: 4px; }
      .header .contact .sep { margin: 0 8px; color: #93c5fd; font-weight: 700; }
      .section { margin-bottom: 11px; }
      .section-title { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.8px; color: #1e40af; border-bottom: 2px solid #bfdbfe; padding-bottom: 3px; margin-bottom: 6px; }
      .section-body { font-size: 10.5px; color: #1f2937; }
      .text-line { margin: 2px 0; line-height: 1.5; }
      .role-line { font-weight: 700; font-size: 10.5px; margin-top: 6px; margin-bottom: 1px; color: #1e3a8a; }
      .sub-heading { font-weight: 700; font-size: 11px; margin-top: 7px; color: #1e40af; }
      .section-body ul { margin: 3px 0 3px 16px; padding: 0; list-style-type: '▸ '; }
      .section-body li { margin-bottom: 2px; font-size: 10.5px; line-height: 1.5; }
      strong { font-weight: 700; color: #111; }
    `,

    // ── MINIMAL ──
    minimal: `
      #resume-pdf-content {
        font-family: 'Helvetica Neue', 'Arial', sans-serif;
        color: #374151; padding: 44px 52px; max-width: 780px; margin: 0 auto; line-height: 1.5; font-size: 10.5px;
      }
      .header { text-align: left; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #d1d5db; }
      .header .name { font-size: 28px; font-weight: 300; letter-spacing: 3px; text-transform: uppercase; color: #111; margin: 0 0 6px 0; }
      .header .contact { font-size: 9.5px; color: #6b7280; line-height: 1.8; }
      .header .contact .row { display: flex; flex-wrap: wrap; gap: 4px; }
      .header .contact .sep { margin: 0 10px; color: #d1d5db; }
      .section { margin-bottom: 14px; }
      .section-title { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px; color: #6b7280; margin-bottom: 8px; padding-bottom: 0; border: none; }
      .section-body { font-size: 10.5px; color: #374151; }
      .text-line { margin: 2px 0; line-height: 1.6; }
      .role-line { font-weight: 600; font-size: 10.5px; margin-top: 6px; color: #111; }
      .sub-heading { font-weight: 600; font-size: 10.5px; margin-top: 7px; color: #111; }
      .section-body ul { margin: 3px 0 3px 16px; padding: 0; list-style-type: '– '; }
      .section-body li { margin-bottom: 3px; font-size: 10px; line-height: 1.6; color: #4b5563; }
      strong { font-weight: 600; }
    `,

    // ── EXECUTIVE ──
    executive: `
      #resume-pdf-content {
        font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
        color: #1f2937; padding: 0; max-width: 780px; margin: 0 auto; line-height: 1.45; font-size: 11px;
      }
      .header { text-align: center; margin-bottom: 0; padding: 28px 44px 16px; background: #1e3a5f; color: white; }
      .header .name { font-size: 28px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: #fff; margin: 0 0 8px 0; }
      .header .contact { font-size: 10px; color: #bfdbfe; line-height: 1.7; }
      .header .contact .row { display: flex; justify-content: center; flex-wrap: wrap; gap: 4px; }
      .header .contact .sep { margin: 0 8px; color: #60a5fa; }
      .sections-wrap { padding: 16px 44px 36px; }
      .section { margin-bottom: 11px; }
      .section-title { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #1e3a5f; border-bottom: 2px solid #1e3a5f; padding-bottom: 3px; margin-bottom: 6px; }
      .section-body { font-size: 10.5px; color: #222; }
      .text-line { margin: 2px 0; line-height: 1.5; }
      .role-line { font-weight: 700; font-size: 11px; margin-top: 6px; color: #1e3a5f; }
      .sub-heading { font-weight: 700; font-size: 11px; margin-top: 7px; color: #1e3a5f; }
      .section-body ul { margin: 3px 0 3px 16px; padding: 0; list-style-type: '■ '; }
      .section-body li { margin-bottom: 2px; font-size: 10.5px; line-height: 1.5; }
      strong { font-weight: 700; color: #111; }
    `,

    // ── CREATIVE ──
    creative: `
      #resume-pdf-content {
        font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
        color: #1f2937; padding: 36px 44px; max-width: 780px; margin: 0 auto; line-height: 1.45; font-size: 11px;
      }
      .header { text-align: center; margin-bottom: 10px; padding-bottom: 14px; border-bottom: 3px solid transparent; border-image: linear-gradient(to right, #7c3aed, #ec4899, #f59e0b) 1; }
      .header .name { font-size: 30px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #7c3aed; margin: 0 0 6px 0; }
      .header .contact { font-size: 10px; color: #6b7280; line-height: 1.7; }
      .header .contact .row { display: flex; justify-content: center; flex-wrap: wrap; gap: 4px; }
      .header .contact .sep { margin: 0 8px; color: #c4b5fd; font-weight: 700; }
      .section { margin-bottom: 11px; }
      .section-title { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #7c3aed; border-left: 3px solid #8b5cf6; padding-left: 10px; margin-bottom: 6px; border-bottom: none; padding-bottom: 0; }
      .section-body { font-size: 10.5px; color: #1f2937; }
      .text-line { margin: 2px 0; line-height: 1.5; }
      .role-line { font-weight: 700; font-size: 10.5px; margin-top: 6px; color: #5b21b6; }
      .sub-heading { font-weight: 700; font-size: 11px; margin-top: 7px; color: #6d28d9; }
      .section-body ul { margin: 3px 0 3px 16px; padding: 0; list-style-type: '◆ '; }
      .section-body li { margin-bottom: 2px; font-size: 10.5px; line-height: 1.5; }
      strong { font-weight: 700; color: #111; }
    `,

    // ── ATS OPTIMIZED ──
    ats_optimized: `
      #resume-pdf-content {
        font-family: 'Arial', 'Helvetica', sans-serif;
        color: #000; padding: 36px 44px; max-width: 780px; margin: 0 auto; line-height: 1.5; font-size: 11px;
      }
      .header { text-align: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid #000; }
      .header .name { font-size: 24px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #000; margin: 0 0 6px 0; }
      .header .contact { font-size: 10px; color: #333; line-height: 1.7; }
      .header .contact .row { display: flex; justify-content: center; flex-wrap: wrap; gap: 4px; }
      .header .contact .sep { margin: 0 8px; color: #666; }
      .section { margin-bottom: 12px; }
      .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #000; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 6px; }
      .section-body { font-size: 11px; color: #000; }
      .text-line { margin: 2px 0; line-height: 1.55; }
      .role-line { font-weight: 700; font-size: 11px; margin-top: 6px; color: #000; }
      .sub-heading { font-weight: 700; font-size: 11px; margin-top: 7px; color: #000; }
      .section-body ul { margin: 3px 0 3px 18px; padding: 0; list-style-type: disc; }
      .section-body li { margin-bottom: 2px; font-size: 11px; line-height: 1.55; }
      strong { font-weight: 700; }
    `,
  };

  return styles[templateId] || styles.classic;
}

// ─────────────────────────────────────────────
// HTML BUILDER (per template)
// ─────────────────────────────────────────────

function buildResumeHTML(resumeText, templateId = 'classic') {
  const resume = parseResume(resumeText);
  const contactItems = [...new Set(resume.contactLines.map((c) => c.replace(/\*\*/g, '').trim()))].filter(Boolean);
  const css = getTemplateStyles(templateId);

  let sectionsHTML = '';
  for (const section of resume.sections) {
    sectionsHTML += `
      <div class="section">
        <div class="section-title">${section.title}</div>
        <div class="section-body">${buildSectionContent(section.entries)}</div>
      </div>
    `;
  }

  const contactHTML = contactItems.length > 0 ? `
    <div class="contact">
      <div class="row">
        ${contactItems.map((item, i) => `${i > 0 ? '<span class="sep">|</span>' : ''}${item}`).join('')}
      </div>
    </div>
  ` : '';

  // Executive template wraps sections separately
  const isExecutive = templateId === 'executive';

  return `
    <div id="resume-pdf-content">
      <style>${css}</style>
      <div class="header">
        <div class="name">${resume.name || 'RESUME'}</div>
        ${contactHTML}
      </div>
      ${isExecutive ? `<div class="sections-wrap">${sectionsHTML}</div>` : sectionsHTML}
    </div>
  `;
}

// ─────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────

/**
 * Generate and download a PDF from resume text using a specific template
 */
export async function downloadResumePDF(resumeText, filename = 'resume.pdf', templateId = 'classic') {
  if (!resumeText) throw new Error('No resume text provided');

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.background = '#fff';
  container.innerHTML = buildResumeHTML(resumeText, templateId);
  document.body.appendChild(container);

  const element = container.querySelector('#resume-pdf-content');

  const opt = {
    margin: [0, 0, 0, 0],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Generate a preview image (as data URL) for a template
 */
export async function generateTemplatePreview(resumeText, templateId) {
  const sampleText = resumeText || `JOHN DOE
john@email.com | linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years in full-stack development.

EXPERIENCE
Senior Software Engineer | Tech Corp | 2021-Present
- Led development of microservices architecture
- Improved system performance by 40%

EDUCATION
B.Tech Computer Science | State University | 2017-2021

SKILLS
JavaScript, Python, React, Node.js, SQL, AWS`;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.background = '#fff';
  container.innerHTML = buildResumeHTML(sampleText, templateId);
  document.body.appendChild(container);

  const element = container.querySelector('#resume-pdf-content');

  try {
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(element, { scale: 0.5, logging: false });
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  } finally {
    document.body.removeChild(container);
  }
}
