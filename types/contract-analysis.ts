import { CONTRACT_TYPES } from '@/lib/constants';
import { z } from 'zod';

// Convertimos la constante a una tupla de lectura obligatoria para Zod
const CONTRACT_TYPE_ENUM = CONTRACT_TYPES as unknown as readonly [string, ...string[]];

export const ContractSchema = z.object({
  // 1. Basic identification
  title: z.string().describe('A concise, professional title for the contract (e.g., "Software License Agreement - Acme Corp")'),
  contractType: z.enum(CONTRACT_TYPE_ENUM).describe('The most accurate category for this legal document.'),

  // 2. Involved parties (Conceptually grouped for the LLM)
  contractOwner: z.string().nullable().describe('The primary party or legal entity initiating the contract'),
  contractPartner: z.string().nullable().describe('The counterparty or partner organization'),
  contractManager: z.string().nullable().describe('Specific person in charge mentioned in the document'),

  // 3. Chronology and Alerts (CRITICAL for your Feature 2)
  contractStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().describe('Start date in ISO YYYY-MM-DD format'),
  expirationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().describe('The specific end date or expiration date in ISO YYYY-MM-DD format'),
  durationType: z.enum(['One-time', 'Fixed-term', 'Indefinite']).describe("How the duration is defined in the text."),

  // 4. Financial and legal data
  contractValue: z.string().nullable().describe('The total monetary amount and currency (e.g., "50.000 EUR")'),
  liabilityAmount: z.string().nullable().describe('Liability limits or monetary caps if specified'),
  riskAssessment: z.enum(['Low', 'Medium', 'High']).describe('Overall risk level based on clauses and liability'),

  // 5. Content analysis (Changed to Array for better handling in UI)
  summary: z.string().describe('A 2-3 sentence overview of the purpose of the contract'),

  // Mantenemos como array puro para que tu UI pueda hacer un .map() fácilmente
  conditions: z.array(z.string())
    .describe('List of key obligations, terms, or critical clauses found in the text'),

  confidentiality: z.string().nullable().describe('Brief summary of the non-disclosure or confidentiality terms'),

  // 6. Management metadata
  externalReference: z.string().nullable().describe('Any unique ID, internal code, or reference number'),
  status: z.enum(['Review', 'Draft', 'Signed', 'Active', 'Expired']).nullable().describe('The status of the contract'),
});

export type ContractAnalysis = z.infer<typeof ContractSchema>;