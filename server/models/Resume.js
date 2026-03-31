const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  originalText: { type: String, required: true },
  optimizedText: { type: String },
  jobDescription: { type: String, required: true },
  jobTitle: { type: String, default: '' },
  company: { type: String, default: '' },
  atsScore: {
    overall: { type: Number, default: 0 },
    keywordMatch: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
    impactMetrics: { type: Number, default: 0 },
    atsCompatibility: { type: Number, default: 0 }
  },
  keywords: {
    present: [String],
    missing: [String],
    technical: [String],
    softSkills: [String],
    tools: [String]
  },
  bulletImprovements: [{
    original: String,
    improved: String,
    section: String
  }],
  skillGap: [{
    skill: String,
    category: String,
    importance: { type: String, enum: ['critical', 'important', 'nice-to-have'] },
    inResume: Boolean
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
