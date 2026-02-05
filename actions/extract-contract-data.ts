/**
 * @deprecated This file is maintained for backwards compatibility.
 * Please import from '@/actions/contract-extraction' instead.
 *
 * Example:
 *   import { extractContractData, ContractType, ContractData } from '@/actions/contract-extraction';
 */

// Re-export everything from the modularized contract-extraction module
export {
  // Main function
  extractContractData,

  // Types
  type ContractType,
  type ExtractionOptions,
  type ExtractionResult,
  type ContractData,
  type NDAData,
  type ServiceAgreementData,
  type LicenseAgreementData,
  type GeneralContractData,

  // Schemas
  NDASchema,
  ServiceAgreementSchema,
  LicenseAgreementSchema,
  GeneralContractSchema,

  // Prompts
  PROMPT_TEMPLATES,
  getSystemPrompt,

  // Utils
  zodSchemaToPromptString,
  getZodTypeInfo,
  extractThinkingContent,
  stripThinkingTags,
  stripToSchema,
} from './contract-extraction';
