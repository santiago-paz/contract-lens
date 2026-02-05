import { generateText, NoObjectGeneratedError, Output } from 'ai';
import { z } from 'zod';

import { getSystemPrompt } from './prompts';
import {
  GeneralContractSchema,
  LicenseAgreementSchema,
  NDASchema,
  ServiceAgreementSchema,
} from './schemas';
import type { ContractData, ContractType, ExtractionOptions, ExtractionResult } from './types';
import { extractThinkingContent, stripThinkingTags, stripToSchema } from './utils';

/**
 * Schema configuration for each contract type.
 */
interface SchemaConfig {
  schema: z.ZodObject<any>;
  name: string;
  description: string;
}

/**
 * Returns the schema configuration for the given contract type.
 */
function getSchemaConfig(contractType: ContractType): SchemaConfig {
  switch (contractType) {
    case 'NDA':
      return {
        schema: NDASchema,
        name: 'NDAExtraction',
        description:
          'Extract confidentiality agreement data including parties, dates, duration, and risk flags.',
      };
    case 'ServiceAgreement':
      return {
        schema: ServiceAgreementSchema,
        name: 'ServiceAgreementExtraction',
        description:
          'Extract service contract data including parties, payment terms, liability, and IP ownership.',
      };
    case 'LicenseAgreement':
      return {
        schema: LicenseAgreementSchema,
        name: 'LicenseAgreementExtraction',
        description:
          'Extract software license data including licensor, licensee, usage limits, and audit rights.',
      };
    case 'Other':
      return {
        schema: GeneralContractSchema,
        name: 'GeneralContractExtraction',
        description:
          'Extract general contract metadata including title, parties, key dates, and governing law.',
      };
    default:
      throw new Error(`Unsupported contract type: ${contractType}`);
  }
}

/**
 * Handles parsing of model output, including reasoning models that emit <think> tags.
 */
async function parseModelOutput(
  error: NoObjectGeneratedError
): Promise<{ extractedObject: any; usage: any; modelReasoning: string | null }> {
  if (!error.text) {
    throw error;
  }

  console.warn('Attempting to parse raw output (may contain thinking tags).');

  // Extract thinking content before stripping (for debugging/display)
  const modelReasoning = extractThinkingContent(error.text);

  // Strip thinking tags (e.g., <think>...</think>) that some models emit
  const cleanedText = stripThinkingTags(error.text);
  console.log('Cleaned text for parsing (first 200 chars):', cleanedText.substring(0, 200));

  try {
    const extractedObject = JSON.parse(cleanedText);
    return {
      extractedObject,
      usage: error.usage || {},
      modelReasoning,
    };
  } catch (parseError) {
    console.error('Failed to parse raw text from validation error:', parseError);
    console.error('Raw text (first 500 chars):', error.text?.substring(0, 500));
    throw error; // JSON parse failed, fatal
  }
}

/**
 * Main extraction function - analyzes contract text and extracts structured data.
 *
 * @param text - The contract text to analyze
 * @param contractType - The type of contract (NDA, ServiceAgreement, LicenseAgreement, Other)
 * @param options - Optional configuration (model, temperature, system prompt override)
 * @returns Extracted contract data with usage stats and optional model reasoning
 */
export async function extractContractData(
  text: string,
  contractType: ContractType,
  options: ExtractionOptions = {}
): Promise<ExtractionResult<ContractData>> {
  // Use options or defaults
  const modelName = options.model || 'deepseek/deepseek-r1';
  const temperature = options.temperature ?? 0;

  // Get schema configuration for this contract type
  const { schema, name: schemaName, description: schemaDescription } = getSchemaConfig(contractType);

  // Generate system prompt with schema included (or use override)
  const systemPrompt = options.systemPromptOverride || getSystemPrompt(contractType, schema);

  try {
    // Use passthrough to capture any extra keys, then strip them
    const looseSchema = schema.passthrough();

    let extractedObject: any;
    let usage: any;
    let modelReasoning: string | null = null;

    try {
      const result = await generateText({
        model: modelName as any,
        system: systemPrompt,
        prompt: `Analyze the following contract text and extract the data according to the schema:\n\n<contract_text>\n${text}\n</contract_text>`,
        output: Output.object({
          name: schemaName,
          description: schemaDescription,
          schema: looseSchema as any,
        }),
        temperature: temperature,
      });

      extractedObject = result.output;
      usage = result.usage;

      // Some models (like DeepSeek R1) include reasoning in the response
      // Try to extract it from various possible locations
      const resultAny = result as any;
      if (resultAny.reasoning) {
        // AI SDK returns reasoning as an array of { type: 'text', text: string }
        if (Array.isArray(resultAny.reasoning)) {
          modelReasoning = resultAny.reasoning
            .filter((r: any) => r.type === 'text' && r.text)
            .map((r: any) => r.text)
            .join('\n');
        } else if (typeof resultAny.reasoning === 'string') {
          modelReasoning = resultAny.reasoning;
        }
      } else if (resultAny.reasoningContent) {
        modelReasoning = resultAny.reasoningContent;
      } else if (resultAny.text) {
        // If there's raw text, try to extract <think> tags from it
        modelReasoning = extractThinkingContent(resultAny.text);
      }
    } catch (error: unknown) {
      // Handle reasoning models that output <think> tags before JSON
      if (NoObjectGeneratedError.isInstance(error)) {
        console.warn('NoObjectGeneratedError caught:', {
          cause: error.cause,
          hasText: !!error.text,
        });

        const parsed = await parseModelOutput(error);
        extractedObject = parsed.extractedObject;
        usage = parsed.usage;
        modelReasoning = parsed.modelReasoning;
      } else {
        throw error;
      }
    }

    // Strip any extra keys to ensure we only return schema-defined properties
    const finalObject = stripToSchema(extractedObject, schema);

    return {
      object: finalObject,
      usage: usage,
      modelReasoning,
    };
  } catch (error) {
    console.error('Error in extractContractData:', error);
    throw error;
  }
}
