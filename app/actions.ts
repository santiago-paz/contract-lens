'use server';

import { CONTRACT_TYPES } from '@/lib/constants';
import { extractText } from '@/lib/text-extractor';
import { ContractSchema } from '@/types/contract-analysis';
import { generateObject } from 'ai';

export async function analyzeContract(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    throw new Error('No file provided');
  }

  // Extract text first
  let text: string;
  try {
    text = await extractText(file);
  } catch (error) {
    console.error('Text extraction failed:', error);
    throw new Error('Failed to extract text from file');
  }

  const truncatedText = text.slice(0, 200000);

  const prompt = `Analyze the provided contract text and extract information to populate the following fields:
  - contractType: Choose the best match from the following allowed list: ${CONTRACT_TYPES.join(', ')}.
  - title: A concise title.
  - contractOwner: Owner/initiator name (optional).
  - deputy: Deputy or secondary contact (optional).
  - contractManager: Manager name (optional).
  - externalReference: Any reference code/number (optional).
  - organizationalUnit: Department/Unit name (optional).
  - contractValue: Total value/amount (optional).
  - confidentiality: Confidentiality level (optional).
  - contractPartner: Partner/Counterparty name (optional).
  - status: Default to 'Review'.
  - durationType: One of 'One-time', 'Fixed-term', 'Indefinite'.
  - contractStart: Start date in YYYY-MM-DD (optional).
  - summary: A brief summary.
  - conditions: Key conditions/terms (optional).
  - riskAssessment: Risk level (Low/Medium/High) (optional).
  - liabilityAmount: Liability limit/cap (optional).
  - comments: General observations (optional).

  Ensure the output is a single JSON object strictly adhering to the schema. Do NOT return an array or list of key-values.
  
  Contract Text:
  ${truncatedText}
  `;

  try {
    const result = await generateObject({
      model: 'meta/llama-3.1-8b' as any,
      schema: ContractSchema,
      prompt,
    });

    return result.object;
  } catch (error) {
    console.warn('First analysis attempt failed, retrying...', error);

    try {
      // Retry with explicit instruction to fix potential format issues
      const result = await generateObject({
        model: 'meta/llama-3.1-8b' as any,
        schema: ContractSchema,
        prompt: `Previous analysis failed. Please analyze the contract again and ensure valid JSON output matching the schema.
        
        ${prompt}`,
      });

      return result.object;
    } catch (retryError) {
      console.error('Final analysis error:', retryError);
      throw new Error('Failed to analyze contract');
    }
  }
}
