import { z } from 'zod';
import { CONTRACT_TYPES } from '@/lib/constants';

// Schema for contract analysis
export const ContractSchema = z.object({
  contractType: z.enum(CONTRACT_TYPES as unknown as [string, ...string[]])
    .describe('The type of the contract. Choose the most appropriate one from the list.'),
  title: z.string().describe('A concise title for the contract derived from its content'),
  contractOwner: z.string().optional().describe('The name of the party or person owning/initiating the contract'),
  contractManager: z.string().optional().describe('The name of the contract manager if mentioned'),
  status: z.enum(['Review', 'Draft', 'Signed', 'Active', 'Expired']).default('Review'),
  durationType: z.enum(['One-time', 'Fixed-term', 'Indefinite']).default('Fixed-term'),
  summary: z.string().describe('A brief summary of the contract content'),
});

export type ContractAnalysis = z.infer<typeof ContractSchema>;
