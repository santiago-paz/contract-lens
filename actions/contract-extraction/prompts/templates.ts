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
- TEMPLATE RULE: If the contract is a generic template/form and a party is described generically (e.g., "the individual or entity accessing..."), use the Defined Term (e.g., "Customer", "Client") instead of the long description.
- MULTI-REGION RULE: If the Provider differs by region (e.g., "X Corp." for US, "Y Ltd." for EU), extract BOTH names separated by " / " or " or ". Do not waste time debating which one to pick; include both.

DATES:
- effectiveDate: The date the agreement becomes effective. Extract as written.
- terminationDate: Extract the fixed end date (e.g., "December 31, 2025") OR the initial term duration (e.g., "1 year") if specified. Return null ONLY if the contract is indefinite ("until terminated") without a fixed initial term.

AUTO-RENEWAL (boolean):
- true = Contract contains explicit auto-renewal language like "shall automatically renew", "will renew for successive periods"
- false = Contract has a fixed term (see terminationDate) AND NO auto-renewal clause is present.
- null = Contract is indefinite ("until terminated") with NO mention of auto-renewal.

PAYMENT TERMS (object with 3 fields):
- method: The mechanism of payment (Bank Transfer, Wire, ACH, Credit Card, Check). Return null if not specified.
- timing: When payment is due (Net 30, Net 60, Monthly, Upon receipt, etc.). Extract if mentioned.
- currency: ONLY extract if explicitly stated as "USD", "EUR", etc. Do NOT infer from currency symbols.
- MULTI-CURRENCY RULE: If multiple currencies are explicitly quoted (e.g. "USD or EUR"), return a single string with both separated by " or ".
- FREE SERVICE RULE: If the Terms are for a generally free service (e.g., social media, public platform) and only mention "paid features" generally without specific terms, return null for the entire object.
- Return the object with null for missing individual fields. Only return null for the entire object if no payment info at all.

IP OWNERSHIP (enum):
- "client" = All work product/deliverables are assigned to client
- "provider" = Provider retains all IP
- "joint" = Explicit shared/joint ownership
- "split" = Mixed ownership (e.g., client owns deliverables BUT provider retains pre-existing tools/IP)
- "other" = Complex or unclear arrangement
- null = Not addressed in contract
- SAAS/PLATFORM RULE: If the User retains ownership of their Content/Data, but the Provider retains ownership of the Platform/Services, return "split".

TERMINATION NOTICE PERIOD:
- Extract the notice period for TERMINATION FOR CONVENIENCE (without cause)
- Ignore cure periods for breach/cause (those are NOT notice periods)
- Format: Use concise standard format (e.g., "30 days", "90 days"). You may convert "thirty (30) days" to "30 days".
- ONE-WAY NOTICE RULE: If only one party has the right to terminate for convenience (e.g. "UNDP may terminate... upon 60 days notice"), extract that period. Do not return null just because it's not mutual.

LIABILITY CAP:
- Extract the EXACT wording describing the cap
- Normalize whitespace (single spaces only)
- Do NOT calculate, convert currencies, or paraphrase
- Include the full limitation description
- MULTI-REGION RULE: If the liability cap differs by region (e.g., specific amount for US vs. "max permissible" for EU), concatenate BOTH clauses separated by " | " or similar delimiter. Do NOT try to pick just one.

INDEMNIFICATION (enum):
- "mutual" = BOTH parties have indemnification obligations to each other
- "provider_indemnifies" = Only provider indemnifies client (e.g., for IP infringement)
- "client_indemnifies" = Only client indemnifies provider (rare)
- "none" = Contract explicitly excludes indemnification
- null = No indemnification clauses present`,

  LicenseAgreement: `Focus on the licensing model:

SUMMARY: Write 2 sentences only—no reasoning, no alternatives, no revisions. Output the summary directly in the JSON.

- licenseType: Map to enum value. "Annual/Monthly/Recurring" → "subscription", "Perpetual/Lifetime" → "perpetual", "Trial/Demo" → "evaluation", "Open Source" → "open_source".
  * APP STORE/ONE-TIME PURCHASE RULE: If the software is a "one-time purchase" (e.g., App Store apps like Logic Pro, Final Cut), map to "perpetual".
- exclusivity: Return boolean true if "exclusive", false if "non-exclusive".
  * CRITICAL: Do NOT infer the main license exclusivity from "Sell-Off", "Survival", or "Termination" clauses (e.g., "sell-off on a non-exclusive basis"). These describe a post-term state.
  * If a "Reservation of Rights" clause reserves specific rights to the Licensor, do NOT assume the license is Non-Exclusive (it often implies Exclusivity elsewhere).
  * If the main license grant is not explicitly in the text, return null.
- auditRights.canAudit: Return boolean true if licensor has audit/inspection rights.
- usageLimits: Extract the limit value (e.g., "50 users", "Unlimited", "1 device per user").
  * DEVICE LIMIT RULE: If the license allows installation on "Mac computers owned or controlled by you", explicitly extract that limit phrase. Do not return null just because it's not a number.
- Territory: Geographic restrictions (e.g., "Worldwide").`,

  Other: `Focus on general contract metadata:
- Identify all Parties involved.
- Extract key dates (Effective, Expiration).
- Determine Governing Law and Jurisdiction.`,
};
