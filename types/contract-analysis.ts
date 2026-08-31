import { z } from 'zod';

// --- Router Schema ---
export const ClassificationSchema = z.object({
  contractType: z.enum(['NDA', 'ServiceAgreement', 'LicenseAgreement', 'Other']),
  confidence: z.number().describe('Confidence score between 0 and 1'),
  reasoning: z.string().describe('Brief explanation of why this category was chosen'),
});

export type ClassificationResult = z.infer<typeof ClassificationSchema>;

// --- Expert Schemas ---
// Re-exporting from the action file to maintain a single source of truth
export type { ContractData } from '@/actions/contract-extraction';

// Flat interface that includes all fields from every schema variant + sidebar metadata.
// Using an interface (instead of a union intersection) so we can access any field
// without narrowing — the sidebar displays whichever fields are present.
export interface ContractAnalysis {
  // ── Sidebar / app metadata ────────────────────────────────────────────────
  contractType?: string;
  title?: string;
  status?: string;
  category?: string | null;
  summary?: string;
  conditions?: string;
  comments?: string;
  contractOwner?: string | null;
  deputy?: string | null;
  contractManager?: string | null;
  externalReference?: string | null;
  organizationalUnit?: string | null;
  contractValue?: string | null;
  confidentiality?: string | null;
  contractPartner?: string | null;
  durationType?: string | null;
  contractStart?: string | null;
  riskAssessment?: string | null;
  liabilityAmount?: string | null;

  // ── Common schema fields ──────────────────────────────────────────────────
  parties?: string[] | null;
  suggestedTitle?: string;
  effectiveDate?: string | null;

  // ── NDA fields ────────────────────────────────────────────────────────────
  expirationDate?: string | null;
  confidentialityDuration?: string | null;
  isMutual?: boolean | null;
  jurisdiction?: string | null;
  riskFlags?: {
    nonSolicit?: boolean | null;
    nonCompete?: boolean | null;
    liquidatedDamages?: boolean | null;
  } | null;

  // ── Service Agreement fields ──────────────────────────────────────────────
  terminationDate?: string | null;
  autoRenewal?: boolean | null;
  paymentTerms?: {
    method?: string | null;
    timing?: string | null;
    currency?: string | null;
  } | null;
  ipOwnership?: string | null;
  terminationNoticePeriod?: string | null;
  liabilityCap?: string | null;
  indemnification?: string | null;

  // ── License Agreement fields ──────────────────────────────────────────────
  licensor?: string | null;
  licensee?: string | null;
  softwareName?: string | null;
  licenseType?: string | null;
  usageLimits?: string | null;
  exclusivity?: boolean | null;
  renewalDate?: string | null;
  auditRights?: {
    canAudit?: boolean | null;
    noticePeriod?: string | null;
  } | null;
  territory?: string | null;

  // ── General contract fields ───────────────────────────────────────────────
  documentTitle?: string;
  keyDates?: { label: string; date: string }[];
  governingLaw?: string | null;
}
