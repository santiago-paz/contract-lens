import { z } from 'zod';

/**
 * General / Other Schema (General Terms and Conditions)
 * Focus: Quick classification for any unknown document.
 */
export const GeneralContractSchema = z.object({
  documentTitle: z.string().describe('The main heading of the document.'),
  summary: z.string().describe('A 2-sentence explanation of what this contract is about.'),
  parties: z.array(z.string()).describe('Names of all involved entities.'),
  keyDates: z
    .array(
      z.object({
        label: z.string().describe('e.g., "Expiration", "Payment Due", "Review Date".'),
        date: z.string().describe('YYYY-MM-DD.'),
      })
    )
    .describe('Any important dates found in the text for the calendar.'),
  governingLaw: z.string().nullable().describe('Which country/state laws apply.'),
});
