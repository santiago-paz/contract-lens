'use server';

import { CONTRACT_TYPES } from '@/lib/constants';
import { extractText } from '@/lib/text-extractor';
import { generateText, NoObjectGeneratedError, Output } from 'ai';
import { z } from 'zod';
import { extractContractData } from './contract-extraction';
import type { ContractType } from './contract-extraction';
import type { AnalysisOptions, AnalysisResult } from './analyze-contract.types';

import { getSession } from '@/lib/auth';

// Helper to parse router classification from raw text
function parseRouterClassification(text: string): string | null {
  // Try to extract JSON from the text
  const jsonMatch = text.match(/\{[\s\S]*?\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.classification && CONTRACT_TYPES.includes(parsed.classification)) {
        return parsed.classification;
      }
    } catch {
      // Fall through to text matching
    }
  }
  
  // Try to find contract type mentioned in text
  for (const type of CONTRACT_TYPES) {
    if (text.includes(type)) {
      return type;
    }
  }
  
  return null;
}

// ── Core pipeline ──────────────────────────────────────────────────────────────

/**
 * Shared contract analysis pipeline.
 *
 * 1. Extract text from the file (PDF / DOCX)
 * 2. Classify the contract type with a fast router model
 * 3. Run the expert extraction model for the detected type
 *
 * Both the playground and contract-creator call this function.
 */
export async function analyzeContract(
  file: File,
  options: AnalysisOptions = {}
): Promise<AnalysisResult> {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: 'Unauthorized',
      data: {
        rawText: '',
        parsed: null,
        classification: 'Unknown',
        latency: { extraction: 0, total: 0 },
      },
    };
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: 'File too large (max 10MB)',
      data: {
        rawText: '',
        parsed: null,
        classification: 'Unknown',
        latency: { extraction: 0, total: 0 },
      },
    };
  }

  const startTime = performance.now();

  // ── Step 0: Text extraction ──────────────────────────────────────────────

  let text: string;
  try {
    text = await extractText(file);
  } catch (error) {
    console.error('Text extraction failed:', error);
    return {
      success: false,
      error: 'Failed to extract text from the file.',
      data: {
        rawText: '',
        parsed: null,
        classification: 'Unknown',
        latency: { extraction: 0, total: Math.round(performance.now() - startTime) },
      },
    };
  }

  const textExtractionTime = performance.now();
  const extractionLatency = Math.round(textExtractionTime - startTime);

  try {
    // ── Step 1: Router (classification) ──────────────────────────────────

    const routerStartTime = performance.now();
    const routerPrompt = `Analyze the first 5000 chars of the document. Classify strictly into one of these types: ${CONTRACT_TYPES.join(', ')}.
    
Respond with ONLY a JSON object in this exact format: {"classification": "<TYPE>"}

If unclear or the document doesn't match any specific type, respond with: {"classification": "Other"}

Document Text (First 5000 chars):

${text.slice(0, 5000)}`;

    let classification: string;
    let routerUsage: any = { totalTokens: 0 };

    try {
      const routerResponse = await generateText({
        model: 'meta/llama-3.1-8b' as any,
        output: Output.object({
          schema: z.object({
            classification: z.enum(CONTRACT_TYPES),
          }),
        }),
        prompt: routerPrompt,
        temperature: 0,
      });
      
      classification = routerResponse.output.classification;
      routerUsage = routerResponse.usage;
    } catch (routerError: unknown) {
      // Handle case where model output doesn't match schema
      if (NoObjectGeneratedError.isInstance(routerError)) {
        console.warn('Router classification failed to match schema, attempting fallback parse:', routerError.text?.substring(0, 200));
        
        const fallbackClassification = parseRouterClassification(routerError.text || '');
        if (fallbackClassification) {
          classification = fallbackClassification;
          routerUsage = routerError.usage || { totalTokens: 0 };
        } else {
          // Default to "Other" if we can't parse the classification
          console.warn('Fallback parse failed, defaulting to Other');
          classification = 'Other';
        }
      } else {
        throw routerError;
      }
    }

    const routerEndTime = performance.now();
    const routerLatency = Math.round(routerEndTime - routerStartTime);

    // If the router can't decide, bail early
    if (classification === 'Other') {
      return {
        success: false,
        error: "We couldn't automatically define the contract type.",
        data: {
          rawText: text,
          parsed: null,
          classification,
          latency: {
            extraction: extractionLatency,
            router: routerLatency,
            total: Math.round(performance.now() - startTime),
          },
        },
      };
    }

    // ── Step 2: Expert analysis ──────────────────────────────────────────

    const expertStartTime = performance.now();

    const expertResultRaw = await extractContractData(
      text,
      classification as ContractType,
      {
        model: options.model,
        temperature: options.temperature,
        systemPromptOverride: options.systemPromptOverride,
      }
    );

    const expertEndTime = performance.now();
    const expertLatency = Math.round(expertEndTime - expertStartTime);

    const {
      object: expertParsedData,
      usage: expertUsage,
      modelReasoning,
    } = expertResultRaw;

    const totalLatency = Math.round(performance.now() - startTime);

    const totalTokens =
      (routerUsage.totalTokens || 0) + (expertUsage?.totalTokens || 0);

    return {
      success: true,
      data: {
        rawText: text,
        parsed: expertParsedData,
        classification,
        usage: {
          router: routerUsage,
          expert: expertUsage,
          totalTokens,
        },
        modelReasoning,
        latency: {
          extraction: extractionLatency,
          router: routerLatency,
          expert: expertLatency,
          total: totalLatency,
        },
      },
    };
  } catch (error: any) {
    console.error('Contract analysis failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error during analysis.',
      errorDetails: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      data: {
        rawText: text,
        parsed: null,
        classification: 'Unknown',
        latency: {
          extraction: extractionLatency,
          total: Math.round(performance.now() - startTime),
        },
      },
    };
  }
}
