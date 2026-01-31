import { z } from 'zod';

// --- Router Schema ---
export const ClassificationSchema = z.object({
  contractType: z.enum(['NDA', 'ServiceAgreement', 'LicenseAgreement', 'Other']),
  confidence: z.number().describe('Confidence score between 0 and 1'),
  reasoning: z.string().describe('Brief explanation of why this category was chosen'),
});

export type ClassificationResult = z.infer<typeof ClassificationSchema>;

// --- Expert Schemas ---

export const NDASchema = z.object({
  contractType: z.literal('NDA'),
  title: z.string(),
  disclosingParty: z.string(),
  receivingParty: z.string(),
  duration: z.string().describe('e.g., "5 years from Effective Date"'),
  isMutual: z.boolean(),
  jurisdiction: z.string(),
  summary: z.string().optional(),
});

export const ServiceAgreementSchema = z.object({
  contractType: z.literal('ServiceAgreement'),
  title: z.string(),
  providerName: z.string(),
  clientName: z.string(),
  totalContractValue: z.string().nullable(),
  paymentSchedule: z.string().describe('e.g., "Monthly", "50% upfront"'),
  deliverables: z.array(z.string()),
  terminationNoticePeriod: z.string(),
  summary: z.string().optional(),
});

export const LicenseAgreementSchema = z.object({
  contractType: z.literal('LicenseAgreement'),
  title: z.string(),
  licensor: z.string().describe('IP Owner'),
  licensee: z.string(),
  territory: z.string().describe('Crucial: list excluded countries'),
  exclusivity: z.boolean(),
  auditRights: z.string().nullable().describe('Details on inspection rights'),
  productSamplesRequired: z.string().nullable().describe('e.g., "6 samples"'),
  insuranceRequirements: z.string().nullable(),
  summary: z.string().optional(),
});

// Union type for the expert result
export const ExpertSchema = z.discriminatedUnion('contractType', [
  NDASchema,
  ServiceAgreementSchema,
  LicenseAgreementSchema,
]);

export type ExpertAnalysis = z.infer<typeof ExpertSchema>;

// Alias for backward compatibility
export type ContractAnalysis = ExpertAnalysis;
