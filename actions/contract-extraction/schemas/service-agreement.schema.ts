import { z } from 'zod';

/**
 * Service Agreement / MSA Schema (Provision of Services)
 * Focus: Money, deliverables and legal responsibility.
 */
export const ServiceAgreementSchema = z.object({
  parties: z
    .array(z.string())
    .describe('Full legal names of the parties. First element = Client, Second element = Provider.')
    .default([])
    .nullable(),
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
      'Fixed end date of the agreement. Return null if: (a) contract is ongoing/indefinite, (b) terminable on notice, (c) auto-renewing, or (d) not specified.'
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
      'Maximum liability amount. Extract the EXACT text as written in the contract. Examples: "fees paid in last 12 months", "total amounts paid under the applicable SOW", "€1,000,000", "shall not exceed $50,000". Do NOT calculate, summarize, or paraphrase.'
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
