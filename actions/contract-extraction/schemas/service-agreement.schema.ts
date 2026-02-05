import { z } from 'zod';

/**
 * Service Agreement / MSA Schema (Provision of Services)
 * Focus: Money, deliverables and legal responsibility.
 */
export const ServiceAgreementSchema = z.object({
  parties: z
    .array(z.string())
    .describe('Names of the Client and the Service Provider.')
    .default([])
    .nullable(),
  effectiveDate: z
    .string()
    .nullable()
    .describe('Start date of the services. Format: YYYY-MM-DD.')
    .default(null),
  terminationDate: z
    .string()
    .nullable()
    .describe(
      'Final date of the service period. Format: YYYY-MM-DD. Return null if auto-renewing or not specified.'
    )
    .default(null),
  autoRenewal: z
    .boolean()
    .nullable()
    .describe(
      'BOOLEAN: Return true if the contract auto-renews. Return false if it explicitly does not auto-renew. Return null if not mentioned.'
    )
    .default(null),
  paymentTerms: z
    .object({
      method: z
        .string()
        .describe('Payment method (e.g., "Bank Transfer", "Credit Card", "Stripe").'),
      timing: z.string().describe('Payment timing (e.g., "Net 30", "Upfront", "Monthly").'),
      currency: z.string().describe('Currency code (e.g., "EUR", "USD").'),
    })
    .nullable()
    .describe('Payment terms. Return null if not specified.')
    .default(null),
  ipOwnership: z
    .string()
    .nullable()
    .describe('Who owns the work product? (e.g., "Client", "Provider", "Joint").')
    .default(null),
  terminationNoticePeriod: z
    .string()
    .nullable()
    .describe('Notice period to cancel (e.g., "30 days", "90 days"). Return null if not specified.')
    .default(null),
  liabilityCap: z
    .string()
    .nullable()
    .describe(
      'Maximum liability. Extract the EXACT text (e.g., "fees paid in last 12 months", "€1,000,000"). Do NOT calculate.'
    )
    .default(null),
  indemnification: z
    .enum(['client_indemnifies', 'provider_indemnifies', 'mutual', 'none'])
    .nullable()
    .describe(
      'Map to enum: "client_indemnifies" (client protects provider), "provider_indemnifies" (provider protects client), "mutual" (both protect each other), "none" (no indemnification). Return null if unclear.'
    )
    .default(null),
});
