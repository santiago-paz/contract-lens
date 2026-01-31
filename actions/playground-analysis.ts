'use server';

import { extractText } from '@/lib/text-extractor';
import { ContractSchema } from '@/types/contract-analysis';
import { generateText, Output } from 'ai';
import { z } from 'zod';

// We'll use the default provider configuration if possible, 
// but we might need to instantiate specific providers if the user wants to switch between them.
// For now, we'll assume the environment variables are set for the default provider used in the app.

export async function analyzeContractPlayground(formData: FormData) {
  const startTime = performance.now();

  const file = formData.get('file') as File;
  const systemPromptOverride = formData.get('systemPrompt') as string;
  const modelName = formData.get('model') as string || 'meta/llama-3.1-8b';
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

  // 2. Prepare Prompt
  const truncatedText = text.slice(0, 200000); // Token limit safety

  // Use override if provided, otherwise default (simplified version of the one in actions.ts)
  const effectivePrompt = systemPromptOverride
    ? `${systemPromptOverride}\n\nIMPORTANT: Return a single JSON object matching the schema, not an array.\n\nContract Text:\n${truncatedText}`
    : `Analyze the provided contract text and extract information according to the schema.
       IMPORTANT: Return a single JSON object matching the schema, not an array.
       Contract Text:
       ${truncatedText}`;

  // 3. Call LLM
  try {
    const llmStartTime = performance.now();

    // Define a flexible schema that accepts either the object or an array containing the object
    // This handles cases where some models return an array even when asked for an object
    const FlexibleContractSchema = z.union([
      ContractSchema,
      z.array(ContractSchema)
    ]);

    // We cast the model string to any to bypass strict type checks if using a generic provider
    const { output, usage } = await generateText({
      model: modelName as any,
      output: Output.object({ schema: FlexibleContractSchema }),
      prompt: effectivePrompt,
      temperature: temperature,
    });

    // Normalize output: if it's an array, take the first element
    let finalOutput = output;
    if (Array.isArray(output)) {
      if (output.length > 0) {
        finalOutput = output[0];
      } else {
        throw new Error('Model returned an empty array');
      }
    }

    const llmEndTime = performance.now();
    const llmLatency = Math.round(llmEndTime - llmStartTime);
    const totalLatency = Math.round(llmEndTime - startTime);

    return {
      success: true,
      data: {
        rawText: text,
        parsed: finalOutput,
        usage: usage,
        latency: {
          extraction: extractionLatency,
          llm: llmLatency,
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
