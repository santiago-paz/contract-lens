import type { ContractType } from '../types';

/**
 * Contract-type-specific prompt templates.
 * Each template provides focused extraction instructions for that contract type.
 */
export const PROMPT_TEMPLATES: Record<ContractType, string> = {
  NDA: `Focus on NDA-specific fields:

GENERAL FORMATTING RULES:
- For all string extraction, replace line breaks (newlines) and multiple spaces with a single space.
- Do NOT preserve original line breaks in the JSON output.

BOOLEAN FIELDS (isMutual):
- true = "Mutual NDA", "bilateral", both parties disclose AND receive confidential info
- false = "Unilateral", "one-way", only one party discloses to the other
- null = cannot determine from the contract text

RISK FLAGS (boolean):
- For nonSolicit, nonCompete, and liquidatedDamages:
  • Return true ONLY if the clause is explicitly present.
  • Return false if the clause is NOT mentioned or absent.
  • Do NOT return null for missing clauses; use false.

STRING FIELDS:
- confidentialityDuration: Extract verbatim duration, including start/end triggers if present (e.g., "5 years from Effective Date", "3 years after termination", "Perpetual").
- jurisdiction: The governing law location, e.g., "State of California", "New York"
- parties: Array of full legal entity names
- effectiveDate/expirationDate: Format as YYYY-MM-DD if possible`,

  ServiceAgreement: `Focus on the service relationship.

GENERAL FORMATTING RULES:
- For all string extraction, replace line breaks (newlines) and multiple spaces with a single space.
- Do NOT preserve original line breaks in the JSON output.

FIELD-BY-FIELD GUIDANCE:

PARTIES:
- Extract full legal entity names, e.g., ["ACME Corporation", "Tech Services LLC"]
- First element = Client (the party receiving services)
- Second element = Provider (the party providing services)

DATES:
- effectiveDate: The date the agreement becomes effective. Extract as written.
- terminationDate: Only extract if there's a FIXED end date. Return null for ongoing contracts.

AUTO-RENEWAL (boolean):
- true = Contract contains explicit auto-renewal language like "shall automatically renew", "will renew for successive periods"
- false = Contract explicitly states it does NOT auto-renew, OR is explicitly a one-time/single-project engagement
- null = Contract is ongoing/indefinite with termination on notice, but NO mention of auto-renewal. Most MSAs are terminable on notice without being "auto-renewal" - these should return null.

PAYMENT TERMS (object with 3 fields):
- method: The mechanism of payment (Bank Transfer, Wire, ACH, Credit Card, Check). Return null if not specified.
- timing: When payment is due (Net 30, Net 60, Monthly, Upon receipt, etc.). Extract if mentioned.
- currency: ONLY extract if explicitly stated as "USD", "EUR", etc. Do NOT infer from currency symbols.
- Return the object with null for missing individual fields. Only return null for the entire object if no payment info at all.

IP OWNERSHIP (enum):
- "client" = All work product/deliverables are assigned to client
- "provider" = Provider retains all IP
- "joint" = Explicit shared/joint ownership
- "split" = Mixed ownership (e.g., client owns deliverables BUT provider retains pre-existing tools/IP)
- "other" = Complex or unclear arrangement
- null = Not addressed in contract

TERMINATION NOTICE PERIOD:
- Extract the notice period for TERMINATION FOR CONVENIENCE (without cause)
- Ignore cure periods for breach/cause (those are NOT notice periods)
- Format: "30 days", "90 days", "60 days written notice"

LIABILITY CAP:
- Extract the EXACT wording describing the cap
- Normalize whitespace (single spaces only)
- Do NOT calculate, convert currencies, or paraphrase
- Include the full limitation description

INDEMNIFICATION (enum):
- "mutual" = BOTH parties have indemnification obligations to each other
- "provider_indemnifies" = Only provider indemnifies client (e.g., for IP infringement)
- "client_indemnifies" = Only client indemnifies provider (rare)
- "none" = Contract explicitly excludes indemnification
- null = No indemnification clauses present`,

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
