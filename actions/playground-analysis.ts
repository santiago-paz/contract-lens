'use server';

import { z } from 'zod';
import { analyzeContract } from './analyze-contract';
import type { PlaygroundAnalysisResult } from './analyze-contract.types';

// Zod schema for playground-specific form validation
const PlaygroundFormSchema = z.object({
  file: z.instanceof(File, { message: 'A file is required' })
    .refine((file) => file.size > 0, 'The file cannot be empty.')
    .refine((file) => file.size < 10 * 1024 * 1024, 'The file must be less than 10MB.'),
  systemPrompt: z.string().optional(),
  model: z.string().optional(),
  temperature: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
});

/**
 * Playground-specific wrapper around analyzeContract.
 *
 * Adds:
 * - FormData parsing & validation (system prompt, model, temperature overrides)
 * - Validation error reporting
 *
 * The core analysis pipeline lives in `analyze-contract.ts`.
 */
export async function analyzeContractPlayground(formData: FormData): Promise<PlaygroundAnalysisResult> {
  // Validate playground-specific form data
  const validatedFields = PlaygroundFormSchema.safeParse({
    file: formData.get('file'),
    systemPrompt: formData.get('systemPrompt'),
    model: formData.get('model'),
    temperature: formData.get('temperature'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Validation error',
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        rawText: '',
        parsed: null,
        classification: 'Unknown',
        latency: { extraction: 0, total: 0 },
      },
    };
  }

  const { file, systemPrompt, model, temperature } = validatedFields.data;

  // Delegate to the shared pipeline with playground overrides
  return analyzeContract(file, {
    model: model || undefined,
    temperature,
    systemPromptOverride: systemPrompt || undefined,
  });
}
