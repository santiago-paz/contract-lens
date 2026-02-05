import { z } from 'zod';
import { ContractData } from '@/actions/extract-contract-data';

// --- Router Schema ---
export const ClassificationSchema = z.object({
  contractType: z.enum(['NDA', 'ServiceAgreement', 'LicenseAgreement', 'Other']),
  confidence: z.number().describe('Confidence score between 0 and 1'),
  reasoning: z.string().describe('Brief explanation of why this category was chosen'),
});

export type ClassificationResult = z.infer<typeof ClassificationSchema>;

// --- Expert Schemas ---
// Re-exporting from the action file to maintain a single source of truth
export type { ContractData } from '@/actions/extract-contract-data';

// Alias for backward compatibility
export type ContractAnalysis = ContractData & {
  contractType?: string;
  title?: string;
  status?: string;
  summary?: string;
  conditions?: string;
  comments?: string;
  contractOwner?: string | null;
  deputy?: string | null;
  contractManager?: string | null;
  externalReference?: string | null;
  organizationalUnit?: string | null;
  contractValue?: string | null;
  confidentiality?: string | null;
  contractPartner?: string | null;
  durationType?: string | null;
  contractStart?: string | null;
  riskAssessment?: string | null;
  liabilityAmount?: string | null;
};
