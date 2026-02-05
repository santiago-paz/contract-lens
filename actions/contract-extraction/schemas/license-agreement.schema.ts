import { z } from 'zod';

/**
 * License Agreement Schema (Software / Software as a Service)
 * Focus: Usage rights, audits and scale limits.
 */
export const LicenseAgreementSchema = z.object({
  licensor: z
    .string()
    .nullable()
    .describe(
      'The owner/seller of the software (the party granting the license). Return null if not explicitly stated.'
    ),
  licensee: z
    .string()
    .nullable()
    .describe(
      'The user/buyer of the software (the party receiving the license). Return null if not explicitly stated.'
    ),
  summary: z
    .string()
    .describe('A 2-sentence explanation of what this contract is about.'),
  softwareName: z
    .string()
    .nullable()
    .describe('The specific product or platform being licensed. Return null if not named.'),
  licenseType: z
    .enum(['perpetual', 'subscription', 'evaluation', 'open_source'])
    .nullable()
    .describe(
      'Map to one of the allowed values: "perpetual" (permanent/lifetime), "subscription" (annual/monthly/recurring), "evaluation" (trial/demo), "open_source" (GPL/MIT/Apache). Return null if unclear.'
    ),
  usageLimits: z
    .string()
    .nullable()
    .describe(
      'Constraints like "50 users", "1 server instance", or "Unlimited". Extract the limit value. Return null if not specified.'
    ),
  exclusivity: z
    .boolean()
    .nullable()
    .describe(
      'BOOLEAN: Return true if the license is "exclusive". Return false if "non-exclusive". Return null if not mentioned or if inferred only from "Sell-Off" or "Survival" clauses.'
    ),
  renewalDate: z
    .string()
    .nullable()
    .describe(
      'The next renewal date. Format: YYYY-MM-DD. Return null if not explicitly specified (do not calculate).'
    ),
  auditRights: z
    .object({
      canAudit: z
        .boolean()
        .nullable()
        .describe(
          'BOOLEAN: Return true if the licensor has the right to audit/inspect. Return false if explicitly prohibited. Return null if not mentioned.'
        ),
      noticePeriod: z
        .string()
        .nullable()
        .describe(
          'The notice period before an audit (e.g., "10 business days", "30 days"). Return null if not specified.'
        ),
    })
    .nullable()
    .describe(
      'Audit rights information. Return null if audit rights are not mentioned in the contract.'
    ),
  territory: z
    .string()
    .nullable()
    .describe(
      'Geographic restriction (e.g., "Worldwide", "European Union Only"). Return null if not specified.'
    ),
});
