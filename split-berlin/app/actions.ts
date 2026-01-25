'use server';

import { streamText } from 'ai';

export async function translateText(
  content: string, 
  targetLang: string, 
  sourceLang?: string
) {
  // Return empty string if content is empty or just a placeholder paragraph
  if (!content || content.trim() === '' || content === '<p></p>') {
    return '';
  }

  // Map simple codes to descriptive names for the model
  const languageNames: Record<string, string> = {
    en: 'English',
    de: 'German',
    es: 'Spanish',
    fr: 'French',
    it: 'Italian',
    pt: 'Portuguese',
  };

  const target = languageNames[targetLang] || targetLang;
  const source = sourceLang ? (languageNames[sourceLang] || sourceLang) : 'auto-detect';

  // Construct a prompt specifically for legal translation
  const prompt = `
    You are an expert legal translator and contract law specialist.
    Your task is to translate the specific legal text provided below from ${source} to ${target}.
    
    Guidelines:
    1. Maintain the precise legal meaning and nuance of the original text.
    2. Use formal legal terminology appropriate for the target jurisdiction.
    3. Preserve the original formatting (HTML tags) if present.
    4. Do not output any preamble, explanation, or notes. Return ONLY the translated text.
    5. If the text appears to be a fragment, translate it as such, maintaining grammatical consistency.
    6. CRITICAL: Maintain the exact HTML structure. If the input is a single paragraph <p>...</p>, the output MUST be a single paragraph <p>...</p>. Do not split content into multiple blocks.

    Target Input Text:
    ${content}
  `;

  try {
    const result = streamText({
      model: 'meta/llama-3.1-8b',
      prompt: prompt,
    });

    // We await the full text response for now to integrate with the existing sync logic.
    // In a future update, we can stream this to the client.
    return await result.text;
  } catch (error) {
    console.error('Translation error:', error);
    // Throw error so the UI can handle it or show a notification
    throw new Error('Translation failed');
  }
}
