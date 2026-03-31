const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/resumeController');

// Main analysis
router.post('/analyze', upload.single('resume'), controller.analyze);

// Generate optimized resume
router.post('/optimize', controller.optimize);

// Multi-target analysis
router.post('/multi-target', upload.single('resume'), controller.multiTarget);

// LinkedIn import
router.post('/linkedin-import', controller.linkedinImport);

// LaTeX export
router.post('/export/latex', controller.exportLatex);

// History
router.get('/history', controller.getHistory);

module.exports = router;
