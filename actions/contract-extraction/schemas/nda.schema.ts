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
  suggestedTitle: z
    .string()
    .describe(
      'A clear, generated title based on the contract content (e.g., "Mutual NDA - Company A & Company B").'
    )
    .default(''),
  summary: z
    .string()
    .describe('A 2-sentence explanation of what this contract is about.')
    .default(''),
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
        .describe(
          'BOOLEAN: Return true if a non-solicitation clause exists. Return false if NOT found.'
        )
        .default(null),
      nonCompete: z
        .boolean()
        .nullable()
        .describe('BOOLEAN: Return true if a non-compete clause exists. Return false if NOT found.')
        .default(null),
      liquidatedDamages: z
        .boolean()
        .nullable()
        .describe(
          'BOOLEAN: Return true if a liquidated damages clause exists. Return false if NOT found.'
        )
        .default(null),
    })
    .nullable()
    .describe(
      'Risk flags object. Return { nonSolicit: false, nonCompete: false, liquidatedDamages: false } if no flags are found. Only return null if the entire section is impossible to evaluate.'
    )
    .default(null),
});
