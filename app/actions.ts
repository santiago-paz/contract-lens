'use server';

import { streamText, generateObject } from 'ai';
import { extractText } from '@/lib/text-extractor';
import { ContractSchema } from '@/types/contract-analysis';

export async function analyzeContract(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    const text = await extractText(file);
    
    const result = await generateObject({
      model: 'meta/llama-3.1-8b' as any,
      schema: ContractSchema,
      prompt: `Analyze the provided contract text and extract information to populate the following fields:
      - contractType: Choose the best match from the allowed list.
      - title: A concise title.
      - contractOwner: Owner/initiator name (optional).
      - contractManager: Manager name (optional).
      - status: Default to 'Review'.
      - durationType: One of 'One-time', 'Fixed-term', 'Indefinite'.
      - summary: A brief summary.

      Ensure the output is a single JSON object strictly adhering to the schema. Do NOT return an array or list of key-values.
      
      Contract Text:
      ${text.slice(0, 50000)}
      `,
    });

    return result.object;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze contract');
  }
}

export async function translateText(
  content: string, 
  targetLang: string, 
  sourceLang?: string
) {
  // Return empty string if content is empty
  if (!content || content.trim() === '') {
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
    3. Do not output any preamble, explanation, or notes. Return ONLY the translated text.
    4. If the text appears to be a fragment, translate it as such, maintaining grammatical consistency.

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
