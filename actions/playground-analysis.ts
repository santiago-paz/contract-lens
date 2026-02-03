'use server';

import { CONTRACT_TYPES } from '@/lib/constants';
import { extractText } from '@/lib/text-extractor';
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { ContractType, extractContractData } from './extract-contract-data';

// Zod schema for form validation
const AnalysisFormSchema = z.object({
  file: z.instanceof(File, { message: 'Un archivo es requerido.' })
    .refine((file) => file.size > 0, 'El archivo no puede estar vacío.')
    .refine((file) => file.size < 10 * 1024 * 1024, 'El archivo debe ser menor a 10MB.'), // Example limit
  systemPrompt: z.string().optional(),
  model: z.string().optional(),
  temperature: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
});

export type AnalysisResult = {
  success: boolean;
  data?: {
    rawText: string;
    parsed: any;
    classification: string;
    usage?: any;
    latency: {
      extraction: number;
      router?: number;
      expert?: number;
      total: number;
    };
  };
  error?: string;
  errors?: Record<string, string[]>; // Validation errors
  errorDetails?: string;
};

export async function analyzeContractPlayground(formData: FormData): Promise<AnalysisResult> {
  const startTime = performance.now();

  // Validate form data
  const validatedFields = AnalysisFormSchema.safeParse({
    file: formData.get('file'),
    systemPrompt: formData.get('systemPrompt'),
    model: formData.get('model'),
    temperature: formData.get('temperature'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Error de validación',
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        rawText: '',
        parsed: null,
        classification: 'Unknown',
        latency: { extraction: 0, total: 0 }
      }
    };
  }

  const { file, systemPrompt, model: expertModelName, temperature } = validatedFields.data;

  // 1. Extract Text
  let text: string;
  try {
    text = await extractText(file);
  } catch (error) {
    console.error('Text extraction failed:', error);
    return {
      success: false,
      error: 'Falló la extracción de texto del archivo.',
      data: {
        rawText: '',
        parsed: null,
        classification: 'Unknown',
        latency: { extraction: 0, total: Math.round(performance.now() - startTime) }
      }
    };
  }

  const textExtractionTime = performance.now();
  const extractionLatency = Math.round(textExtractionTime - startTime);

  try {
    // --- Step 1: Router (Classification) ---
    const routerStartTime = performance.now();
    const routerPrompt = `Analyze the first 5000 chars of the document. Classify strictly into: ${CONTRACT_TYPES.join(', ')}. If unclear, choose Other.

    Document Text (First 5000 chars):
    
    ${text.slice(0, 5000)}`;

    const { output: routerResult, usage: routerUsage } = await generateText({
      model: 'meta/llama-3.1-8b' as any, // Using the fast model
      output: Output.object({
        schema: z.object({
          classification: z.enum(CONTRACT_TYPES),
        }),
      }),
      prompt: routerPrompt,
      temperature: 0, // Deterministic
    });

    const classification = routerResult.classification;

    const routerEndTime = performance.now();
    const routerLatency = Math.round(routerEndTime - routerStartTime);

    // Handle "Other" or low confidence if needed
    if (classification === 'Other') {
      return {
        success: false,
        error: "No pudimos definir el tipo de contrato automáticamente.",
        data: {
          rawText: text,
          parsed: null,
          latency: {
            extraction: extractionLatency,
            router: routerLatency,
            total: Math.round(performance.now() - startTime)
          },
          classification // Return classification details for debugging if needed
        }
      };
    }

    // --- Step 2: Expert Analysis (using new extractContractData) ---
    const expertStartTime = performance.now();

    // Call the new extraction function with options
    // We cast classification to ContractType because CONTRACT_TYPES in constants might be slightly different or just string[]
    const { object: expertResult, usage: expertUsage } = await extractContractData(
      text,
      classification as ContractType,
      {
        model: expertModelName,
        temperature: temperature,
        systemPromptOverride: systemPrompt
      }
    );

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
      error: error.message || 'Error desconocido durante el análisis.',
      errorDetails: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      data: {
        rawText: text,
        parsed: null,
        classification: 'Unknown',
        latency: {
          extraction: extractionLatency,
          total: Math.round(performance.now() - startTime)
        }
      }
    };
  }
}
