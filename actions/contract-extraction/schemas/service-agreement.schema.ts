import { z } from 'zod';

/**
 * Service Agreement / MSA Schema (Provision of Services)
 * Focus: Money, deliverables and legal responsibility.
 */
export const ServiceAgreementSchema = z.object({
  parties: z
    .array(z.string())
    .describe(
      'Full legal names of the parties. First element = Client, Second element = Provider. PRO TIP: If a party is generic, use the Defined Term. If Provider varies by region, include BOTH separated by " / ".'
    )
    .default([])
    .nullable(),
  suggestedTitle: z
    .string()
    .describe(
      'A clear, generated title based on the contract content (e.g., "Master Service Agreement - Acme Corp").'
    )
    .default(''),
  summary: z
    .string()
    .describe('A 2-sentence explanation of what this contract is about.')
    .default(''),
  effectiveDate: z
    .string()
    .nullable()
    .describe(
      'Start date of the agreement. Extract the date as written in the contract (e.g., "March 12, 2024", "2024-03-12"). Do NOT reformat.'
    )
    .default(null),
  terminationDate: z
    .string()
    .nullable()
    .describe(
      'Fixed end date OR initial term duration. Extract the date (e.g., "December 31, 2025") OR the duration text (e.g., "1 year", "12 months") if explicitly stated. Return null if contract is indefinite/ongoing from the start (e.g., "until terminated").'
    )
    .default(null),
  autoRenewal: z
    .boolean()
    .nullable()
    .describe(
      'BOOLEAN: true = contract explicitly states it auto-renews (e.g., "shall automatically renew"). false = contract explicitly states it does NOT auto-renew or is a one-time engagement. null = no auto-renewal clause mentioned (ongoing/indefinite contracts without renewal language should return null).'
    )
    .default(null),
  paymentTerms: z
    .object({
      method: z
        .string()
        .nullable()
        .describe(
          'How payment is made. Examples: "Bank Transfer", "Wire Transfer", "Credit Card", "ACH", "Check". Return null if not specified.'
        ),
      timing: z
        .string()
        .nullable()
        .describe(
          'When payment is due. Examples: "Net 30", "Net 60", "Due upon receipt", "Monthly", "Upfront", "50% upfront, 50% on completion". Return null if not specified.'
        ),
      currency: z
        .string()
        .nullable()
        .describe(
          'ISO currency code if explicitly stated. Examples: "USD", "EUR", "GBP". Return null if currency is not explicitly mentioned (do NOT infer from $ or € symbols alone).'
        ),
    })
    .nullable()
    .describe(
      'Payment terms object. Return the object with individual null fields for missing info. Only return null for the entire object if NO payment information exists.'
    )
    .default(null),
  ipOwnership: z
    .enum(['client', 'provider', 'joint', 'split', 'other'])
    .nullable()
    .describe(
      'Who owns the work product/deliverables? "client" = work product assigned to client. "provider" = provider retains ownership. "joint" = shared ownership. "split" = different ownership for different components (e.g., client owns deliverables, provider retains pre-existing tools). "other" = unclear or complex arrangement. Return null if not mentioned.'
    )
    .default(null),
  terminationNoticePeriod: z
    .string()
    .nullable()
    .describe(
      'Notice period for termination WITHOUT CAUSE (convenience termination). Extract as written, e.g., "30 days", "90 days", "60 days written notice". Ignore cure periods for termination for cause. Return null if not specified.'
    )
    .default(null),
  liabilityCap: z
    .string()
    .nullable()
    .describe(
      'Maximum liability amount. Extract the text content exactly as written. Normalize whitespace. If cap differs by region, concatenate both separated by " | ".'
    )
    .default(null),
  indemnification: z
    .enum(['client_indemnifies', 'provider_indemnifies', 'mutual', 'none'])
    .nullable()
    .describe(
      'Indemnification structure: "mutual" = BOTH parties have indemnification obligations (most common in MSAs). "provider_indemnifies" = ONLY provider indemnifies client. "client_indemnifies" = ONLY client indemnifies provider. "none" = contract explicitly states no indemnification. Return null if no indemnification clauses found.'
    )
    .default(null),
});
