// @ts-ignore
const pdf = require('pdf-parse/lib/pdf-parse.js');
import mammoth from 'mammoth';

export async function extractText(file: File): Promise<string> {
  // Use Buffer.from (not deprecated); any Buffer() deprecation warning comes from pdf-parse/pdf.js
  const buffer = Buffer.from(await file.arrayBuffer());
  
  if (file.type === 'application/pdf') {
    const data = await pdf(buffer);
    return data.text;
  }
  
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  
  throw new Error('Unsupported file type');
}
