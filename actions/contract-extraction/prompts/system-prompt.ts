import { z } from 'zod';
import type { ContractType } from '../types';
import { zodSchemaToPromptString } from '../utils';
import { loadPromptConfig, type PromptConfig } from './loader';

// Cache the default config in memory
let defaultConfig: PromptConfig | null = null;

function getDefaultConfig(): PromptConfig {
  if (!defaultConfig) {
    defaultConfig = loadPromptConfig('v1');
  }
  return defaultConfig;
}

/**
 * Generates a system prompt for the LLM based on the contract type and schema.
 * Reads base prompt and template instructions from the JSON config.
 *
 * @param contractType - The type of contract being analyzed
 * @param schema - The Zod schema for structured output
 * @param version - Optional prompt config version (defaults to 'v1')
 */
export function getSystemPrompt(
  contractType: ContractType,
  schema: z.ZodObject<any>,
  version?: string
): string {
  const config = version ? loadPromptConfig(version) : getDefaultConfig();
  const template = config.templates[contractType] || config.templates.Other;
  const schemaString = zodSchemaToPromptString(schema);

  // Build the specific instructions block
  let contractTypeFocus = template.instructions;

  // Append examples if any exist
  if (template.examples && template.examples.length > 0) {
    contractTypeFocus += '\n\nEXAMPLES:\n' + template.examples.join('\n\n');
  }

  // Append notes if present
  if (template.notes) {
    contractTypeFocus += '\n\nADDITIONAL NOTES:\n' + template.notes;
  }

  return `${config.base.role}

<target_schema>
Extract data into this exact JSON structure. The type after each field name is the expected JSON type:

{
${schemaString}
}

TYPE LEGEND:
${config.base.typeLegend}
</target_schema>

<extraction_rules>
${config.base.extractionRules}
</extraction_rules>

<contract_type_focus>
${contractTypeFocus}
</contract_type_focus>

<output_format>
${config.base.outputFormat}
</output_format>`;
}
