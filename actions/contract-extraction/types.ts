import { z } from 'zod';
import {
  NDASchema,
  ServiceAgreementSchema,
  LicenseAgreementSchema,
  GeneralContractSchema,
} from './schemas';

// --- Contract Types ---

export type ContractType = 'NDA' | 'ServiceAgreement' | 'LicenseAgreement' | 'Other';

export interface ExtractionOptions {
  model?: string;
  temperature?: number;
  systemPromptOverride?: string;
}

// --- Inferred Types from Schemas ---

export type NDAData = z.infer<typeof NDASchema>;
export type ServiceAgreementData = z.infer<typeof ServiceAgreementSchema>;
export type LicenseAgreementData = z.infer<typeof LicenseAgreementSchema>;
export type GeneralContractData = z.infer<typeof GeneralContractSchema>;

// Union Type for Return
export type ContractData =
  | NDAData
  | ServiceAgreementData
  | LicenseAgreementData
  | GeneralContractData;

// --- Extraction Result ---

export interface ExtractionResult<T = ContractData> {
  object: T;
  usage: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  modelReasoning: string | null;
}
