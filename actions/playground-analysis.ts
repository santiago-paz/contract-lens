'use server';

import { CONTRACT_TYPES, EXPERT_MODEL, FAST_MODEL } from '@/lib/constants';
import { extractText } from '@/lib/text-extractor';
import {
  LicenseAgreementSchema,
  NDASchema,
  ServiceAgreementSchema
} from '@/types/contract-analysis';
import { generateObject, generateText, Output } from 'ai';
import { z } from 'zod';

export async function analyzeContractPlayground(formData: FormData) {
  const startTime = performance.now();

  const file = formData.get('file') as File;
  const systemPromptOverride = formData.get('systemPrompt') as string;
  const expertModelName = formData.get('model') as string || 'meta/llama-3.1-70b'; // Default to a stronger model if not provided
  const temperature = parseFloat(formData.get('temperature') as string) || 0;

  if (!file) {
    throw new Error('No file provided');
  }

  // 1. Extract Text
  let text: string;
  try {
    text = await extractText(file);
  } catch (error) {
    console.error('Text extraction failed:', error);
    throw new Error('Failed to extract text from file');
  }

  const textExtractionTime = performance.now();
  const extractionLatency = Math.round(textExtractionTime - startTime);

  try {
    // --- Step 1: Router (Classification) ---
    const routerStartTime = performance.now();
    const routerPrompt = `Analyze the first 5000 chars of the document. Classify strictly into: ${CONTRACT_TYPES.join(', ')}. If unclear, choose Other.

    Document Text (First 5000 chars):
    
    ${text.slice(0, 5000)}`;

    const { object: routerResult, usage: routerUsage } = await generateObject({
      model: FAST_MODEL as any, // Using the fast model
      schema: z.object({
        classification: z.enum(['NDA', 'ServiceAgreement', 'LicenseAgreement', 'Other']),
      }),
      prompt: routerPrompt,
      temperature: 0, // Deterministic
    });

    const classification = routerResult.classification;

    const routerEndTime = performance.now();
    const routerLatency = Math.round(routerEndTime - routerStartTime);

    // Handle "Other" or low confidence if needed (though user said "IF 'Other': Return specific error")
    if (classification === 'Other') {
      return {
        success: false,
        error: "No pudimos definir el tipo de contrato automáticamente.",
        data: {
          rawText: text,
          parsed: null,
          latency: {
            extraction: extractionLatency,
            llm: routerLatency,
            total: Math.round(performance.now() - startTime)
          },
          classification // Return classification details for debugging if needed
        }
      };
    }

    // --- Step 2: Expert Analysis ---
    let schema;
    let systemPrompt;

    switch (classification) {
      case 'NDA':
        schema = NDASchema;
        systemPrompt = `You are a Confidentiality Expert.
        - Focus on DURATION: How long does the obligation last?
        - Focus on SCOPE: What is defined as Confidential Information?`;
        break;
      case 'ServiceAgreement':
        schema = ServiceAgreementSchema;
        systemPrompt = `You are a Commercial Auditor.
        - Focus on FINANCIALS: Exact amounts, currency, and payment triggers.
        - Focus on DATES: Start date, end date, and notice periods.`;
        break;
      case 'LicenseAgreement':
        schema = LicenseAgreementSchema;
        systemPrompt = `You are Klausel.ai, an IP Licensing Forensic Expert.
          - Look for 'Third Party Licensor' definitions (e.g., The LEGO Group).
          - SCAN FOR INTEGERS: specific numbers of samples (e.g., '6 samples'), days for audit notice.
          - TERRITORY: Explicitly list any excluded countries (e.g., Iran, Cuba).`;
        break;
      default:
        // Should be caught by the 'Other' check above, but for safety:
        throw new Error(`Unexpected contract type: ${classification}`);
    }

    // Allow override to replace the expert prompt if provided
    const finalSystemPrompt = systemPromptOverride || systemPrompt;

    const expertStartTime = performance.now();
    const { text: expertResult, usage: expertUsage } = await generateText({
      model: EXPERT_MODEL as any,
      output: Output.text(),
      system: finalSystemPrompt,
      prompt: `Analyze the full document text and extract the required information.\n\nDocument Text:\n${text}`,
      temperature: temperature,
    });
    const expertEndTime = performance.now();
    const expertLatency = Math.round(expertEndTime - expertStartTime);

    const totalLatency = Math.round(performance.now() - startTime);

    return {
      success: true,
      data: {
        rawText: text,
        parsed: expertResult,
        classification, // Include classification metadata
        usage: {
          router: routerUsage,
          expert: expertUsage,
          totalTokens: (routerUsage.totalTokens || 0) + (expertUsage.totalTokens || 0)
        },
        latency: {
          extraction: extractionLatency,
          router: routerLatency,
          expert: expertLatency,
          total: totalLatency
        }
      }
    };

  } catch (error: any) {
    console.error('Playground analysis failed:', error);
    return {
      success: false,
      error: error.message,
      errorDetails: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      data: {
        rawText: text,
        parsed: null,
        latency: {
          extraction: extractionLatency,
          llm: 0,
          total: Math.round(performance.now() - startTime)
        }
      }
    };
  }
}
