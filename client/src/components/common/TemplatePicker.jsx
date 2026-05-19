import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineX,
  HiOutlineDownload,
  HiOutlineCheck,
} from 'react-icons/hi';
import { TEMPLATES, downloadResumePDF } from '../../services/pdfExport';

const templatePreviews = {
  classic: {
    headerBg: '#1a1a1a',
    bodyLines: ['#555', '#777', '#777', '#888'],
    font: 'serif',
  },
  modern: {
    headerBg: '#2563eb',
    bodyLines: ['#1e40af', '#4b5563', '#4b5563', '#6b7280'],
    font: 'sans-serif',
  },
  minimal: {
    headerBg: '#9ca3af',
    bodyLines: ['#6b7280', '#9ca3af', '#9ca3af', '#d1d5db'],
    font: 'sans-serif',
  },
  executive: {
    headerBg: '#1e3a5f',
    bodyLines: ['#1e3a5f', '#374151', '#374151', '#6b7280'],
    font: 'sans-serif',
  },
  creative: {
    headerBg: '#7c3aed',
    bodyLines: ['#7c3aed', '#6b7280', '#6b7280', '#9ca3af'],
    font: 'sans-serif',
  },
  ats_optimized: {
    headerBg: '#000000',
    bodyLines: ['#000', '#333', '#333', '#555'],
    font: 'sans-serif',
  },
};

/**
 * Mini resume preview thumbnail (CSS-only, no html2canvas needed)
 */
function TemplateThumbnail({ templateId, isSelected }) {
  const preview = templatePreviews[templateId];
  const isExec = templateId === 'executive';

  return (
    <div className={`w-full aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all duration-300 ${
      isSelected ? 'border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.02]' : 'border-charcoal-200 hover:border-charcoal-300'
    }`}>
      <div className="w-full h-full bg-white flex flex-col p-3" style={{ fontFamily: preview.font }}>
        {/* Header area */}
        <div className={`mb-2 pb-2 ${isExec ? 'rounded-lg px-2 py-2' : ''}`}
          style={{
            borderBottom: isExec ? 'none' : `2px solid ${preview.headerBg}`,
            backgroundColor: isExec ? preview.headerBg : 'transparent',
          }}
        >
          <div className="h-2.5 rounded-full mx-auto mb-1" style={{
            width: '55%',
            backgroundColor: isExec ? '#fff' : preview.headerBg,
          }} />
          <div className="h-1 rounded-full mx-auto" style={{
            width: '70%',
            backgroundColor: isExec ? 'rgba(255,255,255,0.5)' : `${preview.headerBg}44`,
          }} />
        </div>

        {/* Section blocks */}
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="mb-2">
            <div className="h-1.5 rounded-full mb-1" style={{
              width: '35%',
              backgroundColor: preview.bodyLines[0],
              borderBottom: templateId === 'creative' ? 'none' : undefined,
              borderLeft: templateId === 'creative' ? `2px solid ${preview.headerBg}` : 'none',
              paddingLeft: templateId === 'creative' ? '4px' : '0',
            }} />
            {[0, 1].map((line) => (
              <div key={line} className="h-1 rounded-full mb-0.5" style={{
                width: `${85 - line * 15}%`,
                backgroundColor: preview.bodyLines[idx + 1] + '55',
              }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TemplatePicker({ isOpen, onClose, resumeText }) {
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadResumePDF(resumeText, 'hireboost_resume.pdf', selectedTemplate);
      onClose();
    } catch (err) {
      alert(`PDF download failed: ${err.message}`);
    }
    setDownloading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="bg-white rounded-3xl shadow-warm-xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-warm-border">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-warm-border bg-gradient-to-r from-amber-50 to-warm-bg">
                <div>
                  <h2 className="font-display text-xl font-bold text-charcoal-800">
                    Choose a Template ✨
                  </h2>
                  <p className="text-charcoal-500 text-sm mt-0.5">
                    Select your preferred resume design and download as PDF
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 transition-all"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              {/* Templates Grid */}
              <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {TEMPLATES.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    return (
                      <motion.button
                        key={template.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`relative text-left rounded-2xl p-3 transition-all duration-200 ${
                          isSelected
                            ? 'bg-amber-50 ring-2 ring-amber-400'
                            : 'bg-charcoal-50 hover:bg-charcoal-100 ring-1 ring-charcoal-200'
                        }`}
                      >
                        {/* Selected indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center z-10">
                            <HiOutlineCheck className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}

                        {/* Thumbnail preview */}
                        <TemplateThumbnail templateId={template.id} isSelected={isSelected} />

                        {/* Template info */}
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{template.preview}</span>
                            <h3 className={`font-semibold text-sm ${isSelected ? 'text-amber-700' : 'text-charcoal-700'}`}>
                              {template.name}
                            </h3>
                          </div>
                          <p className="text-charcoal-400 text-xs mt-1 line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-warm-border bg-charcoal-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{TEMPLATES.find((t) => t.id === selectedTemplate)?.preview}</span>
                  <span className="text-sm font-medium text-charcoal-700">
                    {TEMPLATES.find((t) => t.id === selectedTemplate)?.name} Template
                  </span>
                </div>
                <div className="flex gap-3">
                  <button onClick={onClose} className="btn-ghost text-sm py-2 px-5">
                    Cancel
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="btn-amber text-sm py-2 px-6 flex items-center gap-2"
                  >
                    <HiOutlineDownload className="w-4 h-4" />
                    {downloading ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
