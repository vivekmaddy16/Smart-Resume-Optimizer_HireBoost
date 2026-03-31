const { PDFParse } = require('pdf-parse');

/**
 * Extract text from a PDF buffer
 */
async function extractTextFromPDF(buffer) {
  let parser;

  try {
    parser = new PDFParse({ data: buffer });
    const data = await parser.getText({ pageJoiner: false });
    return cleanText(data.text);
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

/**
 * Clean extracted text — remove extra whitespace, normalize line breaks
 */
function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

module.exports = { extractTextFromPDF, cleanText };
