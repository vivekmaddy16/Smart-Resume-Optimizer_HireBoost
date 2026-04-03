# 🚀 HireBoost — AI-Powered Resume Optimizer

Transform your resume with AI. Upload your resume, paste a job description, and get instant ATS scoring, keyword analysis, bullet point optimization, and a fully optimized resume.

## Features

- 🔍 **Keyword Matching** — Find missing skills from job descriptions
- ✨ **Bullet Optimization** — Transform weak bullets into powerful statements
- 📊 **ATS Score (0-100)** — Detailed scoring breakdown
- 🧠 **Skill Gap Analysis** — Visual skill comparison
- 🚀 **Auto Resume Generator** — AI-generated optimized resume
- 🔗 **LinkedIn Import** — Import profile data from LinkedIn
- 🎯 **Multi-Job Targeting** — Compare scores across multiple jobs
- 🧾 **LaTeX Export** — Export to LaTeX with Overleaf integration
- 📥 **PDF Download** — Professional PDF export

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Backend | Node.js + Express |
| AI Engine | Google Gemini API (2.5 Flash) |
| Database | MongoDB Atlas |
| PDF Parse | pdf-parse |

## Quick Start

### 1. Clone & Setup

```bash
# Install backend dependencies
cd scerver && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Environment Variables

Edit `.env` in the root:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### 3. Run

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/resume/analyze` | Analyze resume + JD |
| POST | `/api/resume/optimize` | Generate optimized resume |
| POST | `/api/resume/multi-target` | Multi-job comparison |
| POST | `/api/resume/linkedin-import` | Parse LinkedIn profile |
| POST | `/api/resume/export/latex` | Generate LaTeX code |
| GET | `/api/resume/history` | Past analyses |

## License

MIT
