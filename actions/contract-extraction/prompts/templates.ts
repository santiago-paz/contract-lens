import type { ContractType } from '../types';

/**
 * Contract-type-specific prompt templates.
 * Each template provides focused extraction instructions for that contract type.
 */
export const PROMPT_TEMPLATES: Record<ContractType, string> = {
  NDA: `Focus on NDA-specific fields:

BOOLEAN FIELDS (return true, false, or null):
- isMutual: 
  • true = "Mutual NDA", "bilateral", both parties disclose AND receive confidential info
  • false = "Unilateral", "one-way", only one party discloses to the other
  • null = cannot determine from the contract text

- riskFlags.nonSolicit: true if there's a non-solicitation clause (restricting hiring each other's employees)
- riskFlags.nonCompete: true if there's a non-compete clause (restricting competitive business activities)  
- riskFlags.liquidatedDamages: true if there's a predetermined damages amount for breach

STRING FIELDS:
- confidentialityDuration: Extract verbatim, e.g., "2 years after termination", "5 years", "perpetual"
- jurisdiction: The governing law location, e.g., "State of California", "New York"
- parties: Array of full legal entity names
- effectiveDate/expirationDate: Format as YYYY-MM-DD if possible`,

  ServiceAgreement: `Focus on the service relationship:
- autoRenewal: Return boolean true if contract auto-renews, false if explicitly one-time.
- indemnification: Map to enum value based on who protects whom.
- liabilityCap: Extract the EXACT wording, do not calculate or convert.
- paymentTerms: Extract method, timing, and currency as separate fields.`,

  LicenseAgreement: `Focus on the licensing model:
- licenseType: Map to enum value. "Annual/Monthly/Recurring" → "subscription", "Perpetual/Lifetime" → "perpetual", "Trial/Demo" → "evaluation".
- exclusivity: Return boolean true if "exclusive", false if "non-exclusive".
- auditRights.canAudit: Return boolean true if licensor has audit/inspection rights.
- usageLimits: Extract the limit value (e.g., "50 users", "Unlimited").
- Territory: Geographic restrictions (e.g., "Worldwide").`,

  Other: `Focus on general contract metadata:
- Identify all Parties involved.
- Extract key dates (Effective, Expiration).
- Determine Governing Law and Jurisdiction.`,
};
