import { z } from 'zod';
import { CONTRACT_TYPES } from '@/lib/constants';

// Schema for contract analysis
export const ContractSchema = z.object({
  contractType: z.enum(CONTRACT_TYPES as unknown as [string, ...string[]])
    .describe('The type of the contract. Choose the most appropriate one from the list.'),
  title: z.string().describe('A concise title for the contract derived from its content'),
  contractOwner: z.string().nullable().describe('The name of the party or person owning/initiating the contract'),
  deputy: z.string().nullable().describe('The name of the deputy or secondary contact person'),
  contractManager: z.string().nullable().describe('The name of the contract manager if mentioned'),
  externalReference: z.string().nullable().describe('Any external reference number or code found'),
  organizationalUnit: z.string().nullable().describe('The organizational unit or department involved'),
  contractValue: z.string().nullable().describe('The total value or monetary amount of the contract'),
  confidentiality: z.string().nullable().describe('Confidentiality level or clause summary'),
  contractPartner: z.string().nullable().describe('The name of the counterparty or partner organization'),
  status: z.enum(['Review', 'Draft', 'Signed', 'Active', 'Expired']).default('Review'),
  durationType: z.enum(['One-time', 'Fixed-term', 'Indefinite']).default('Fixed-term'),
  contractStart: z.string().nullable().describe('Start date of the contract in YYYY-MM-DD format'),
  summary: z.string().describe('A brief summary of the contract content'),
  conditions: z.union([z.string(), z.array(z.string())])
    .nullable()
    .describe('Key conditions, terms, or obligations extracted from the text')
    .transform(val => Array.isArray(val) ? val.map(v => `- ${v}`).join('\n') : val),
  riskAssessment: z.string().nullable().describe('Assessment of potential risks (Low, Medium, High) based on content'),
  liabilityAmount: z.string().nullable().describe('Liability limits or monetary caps mentioned'),
  comments: z.union([z.string(), z.array(z.string())])
    .nullable()
    .describe('General comments or observations about the contract')
    .transform(val => Array.isArray(val) ? val.join('\n') : val),
});

export type ContractAnalysis = z.infer<typeof ContractSchema>;
