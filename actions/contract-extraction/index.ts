// Main barrel file for contract-extraction module

// Main function
export { extractContractData } from './extract-contract-data';

// Types
export type {
  ContractType,
  ExtractionOptions,
  ExtractionResult,
  ContractData,
  NDAData,
  ServiceAgreementData,
  LicenseAgreementData,
  GeneralContractData,
} from './types';

// Schemas (for consumers who need direct access)
export {
  NDASchema,
  ServiceAgreementSchema,
  LicenseAgreementSchema,
  GeneralContractSchema,
} from './schemas';

// Prompts (for consumers who need to customize)
export { PROMPT_TEMPLATES, getSystemPrompt } from './prompts';

// Utils (for consumers who need direct access)
export {
  zodSchemaToPromptString,
  getZodTypeInfo,
  extractThinkingContent,
  stripThinkingTags,
  stripToSchema,
} from './utils';
