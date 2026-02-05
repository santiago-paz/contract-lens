import { z } from 'zod';

/**
 * NDA Schema (Confidentiality)
 * Focus: When can we talk? How aggressive is the contract?
 */
export const NDASchema = z.object({
  parties: z
    .array(z.string())
    .describe('Full legal names of the entities involved.')
    .default([])
    .nullable(),
  effectiveDate: z
    .string()
    .nullable()
    .describe('Format: YYYY-MM-DD. Return null if not stated.')
    .default(null),
  expirationDate: z
    .string()
    .nullable()
    .describe('Format: YYYY-MM-DD. Return null if not stated.')
    .default(null),
  confidentialityDuration: z
    .string()
    .nullable()
    .describe('Duration text (e.g., "2 years", "perpetual"). Return null if not stated.')
    .default(null),
  isMutual: z
    .boolean()
    .nullable()
    .describe(
      'BOOLEAN: Return true if mutual/bilateral NDA (both parties share info). Return false if unilateral/one-way. Return null if unclear.'
    )
    .default(null),
  jurisdiction: z
    .string()
    .nullable()
    .describe('City/Country for legal disputes. Return null if not stated.')
    .default(null),
  riskFlags: z
    .object({
      nonSolicit: z
        .boolean()
        .nullable()
        .describe('BOOLEAN: Return true if a non-solicitation clause exists.')
        .default(null),
      nonCompete: z
        .boolean()
        .nullable()
        .describe('BOOLEAN: Return true if a non-compete clause exists.')
        .default(null),
      liquidatedDamages: z
        .boolean()
        .nullable()
        .describe('BOOLEAN: Return true if a liquidated damages clause exists.')
        .default(null),
    })
    .nullable()
    .describe('Risk flags found in the contract. Return null if none of these clauses exist.')
    .default(null),
});
