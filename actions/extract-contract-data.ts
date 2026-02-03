import { generateText, Output } from 'ai';
import { z } from 'zod';

// --- Types ---

export type ContractType = 'NDA' | 'ServiceAgreement' | 'LicenseAgreement' | 'Other';

export interface ExtractionOptions {
  model?: string;
  temperature?: number;
  systemPromptOverride?: string;
}

// --- Zod Schemas ---

// 1. NDA Schema
export const NDASchema = z.object({
  parties: z.array(z.string()).optional().describe('List of entity names found in the contract'),
  effectiveDate: z.string().nullable().optional().describe('ISO date or exact text found, null if missing'),
  confidentialityDuration: z.string().nullable().optional().describe('e.g., "2 years", "5 years", "Indefinite"'),
  jurisdiction: z.string().nullable().optional().describe('City/State/Country for disputes'),
  isMutual: z.boolean().optional().describe('True if both parties share confidential info, False if one-way'),
  riskFlags: z.object({
    hasNonSolicit: z.boolean().optional().describe('True if there is a restriction on hiring employees'),
    noIpTransfer: z.boolean().optional().describe('True if clause explicitly states no IP rights are transferred'),
    nonCompete: z.boolean().optional().describe('True if clause restricts working with competitors'),
  }).nullable().optional(),
});

// 2. Service Agreement / MSA Schema
export const ServiceAgreementSchema = z.object({
  parties: z.array(z.string()).optional().describe('List of entity names found'),
  effectiveDate: z.string().nullable().optional().describe('ISO date or exact text found'),
  termDuration: z.string().nullable().optional().describe('Contract length, e.g., "1 year", "auto-renewing"'),
  paymentTerms: z.string().nullable().optional().describe('e.g., "Net 30", "Net 60", "Upon receipt"'),
  ipOwnership: z.union([z.string(), z.record(z.string(), z.string())]).nullable().optional().describe('Who owns the created IP (e.g. Client, Provider, Mixed) or object with details'),
  terminationNoticePeriod: z.string().nullable().optional().describe('e.g., "30 days"'),
  liabilityCap: z.string().nullable().optional().describe('Specific amount OR formula (e.g., "12 months of fees")'),
  governingLaw: z.string().nullable().optional().describe('Jurisdiction or governing law'),
  indemnification: z.boolean().optional().describe('True if provider indemnifies client'),
});

// 3. License Agreement Schema
export const LicenseAgreementSchema = z.object({
  licensor: z.string().nullable().optional().describe('The entity granting the license'),
  licensee: z.string().nullable().optional().describe('The entity receiving the license'),
  softwareName: z.string().nullable().optional().describe('Name of the software or IP being licensed'),
  licenseType: z.string().nullable().optional().describe('Type of license (e.g. Perpetual, Subscription, Evaluation)'),
  exclusivity: z.string().nullable().optional().describe('Exclusivity status (e.g. Exclusive, Non-Exclusive)'),
  auditRights: z.object({
    canAudit: z.boolean().optional().describe('True if the licensor has the right to audit'),
    noticePeriod: z.string().nullable().optional().describe('Notice period for audit, e.g., "10 days prior notice"'),
    penaltyClause: z.string().nullable().optional().describe('e.g., "User pays costs if >5% error"'),
    liabilityCap: z.string().nullable().optional(),
    usageLimits: z.union([z.string(), z.record(z.string(), z.string())]).nullable().optional().describe('Summary of seats, cores, or users'),
  }).nullable().optional(),
});

// 4. General/Other Schema
export const GeneralContractSchema = z.object({
  parties: z.array(z.string()).optional().describe('List of entity names found'),
  documentTitle: z.string().nullable().optional().describe('Title of the document'),
  effectiveDate: z.string().nullable().optional().describe('ISO date or exact text found'),
  governingLaw: z.string().nullable().optional().describe('Jurisdiction or governing law'),
  hasRenewalClause: z.boolean().optional().describe('True if the contract mentions renewal'),
  terminationNotice: z.string().nullable().optional().describe('Notice period for termination'),
});

// Union Type for Return
export type ContractData = 
  | z.infer<typeof NDASchema>
  | z.infer<typeof ServiceAgreementSchema>
  | z.infer<typeof LicenseAgreementSchema>
  | z.infer<typeof GeneralContractSchema>;

// --- Helper: System Prompt Generator ---

function getSystemPrompt(contractType: ContractType): string {
  const basePrompt = `You are a Senior Legal AI specialized in contract analysis.
Your goal is to extract structured data from the provided contract text.
Be precise and factual.
Return null if a field is not explicitly stated (do not hallucinate).
For liabilityCap, if it's a formula (e.g., "fees paid in last 12 months"), extract the text of the formula, don't try to calculate a number.
IMPORTANT: You must generate a single JSON object that strictly matches the provided schema. Do not return an array. Do not add fields that are not in the schema.`;

  const structureWarning = `DO NOT nest fields under categories like "commercialTerms" or "terminationRights" unless the schema explicitly asks for it. Keep the JSON structure flat as per the schema.
  IMPORTANT: For fields defined as objects (like 'auditRights'), you MUST return a JSON object, not a string or boolean.`;

  switch (contractType) {
    case 'NDA':
      return `${basePrompt}
${structureWarning}
Focus on confidentiality terms, duration, and specific risk flags like non-solicit and non-compete clauses.`;
    
    case 'ServiceAgreement':
      return `${basePrompt}
${structureWarning}
Focus on commercial terms, IP ownership, liability caps, and termination rights.
Pay special attention to the Liability Cap - extract the exact wording if it's a formula.`;
    
    case 'LicenseAgreement':
      return `${basePrompt}
${structureWarning}
Focus on licensing terms, exclusivity, audit rights, and usage limits.
Identify the Licensor and Licensee clearly.`;
    
    case 'Other':
      return `${basePrompt}
${structureWarning}
Extract general contract metadata including parties, dates, and governing law.`;
      
    default:
      return basePrompt;
  }
}

// --- Main Extraction Function ---

export async function extractContractData(
  text: string, 
  contractType: ContractType, 
  options: ExtractionOptions = {}
) {
  // Use options or defaults
  // Default to a high-quality model if not provided
  const modelName = options.model || 'openai/gpt-4o';
  // If systemPromptOverride is present, use it completely. Otherwise, generate based on type.
  const systemPrompt = options.systemPromptOverride || getSystemPrompt(contractType);
  const temperature = options.temperature ?? 0;

  // Select the correct schema based on contractType
  let schema;
  switch (contractType) {
    case 'NDA':
      schema = NDASchema;
      break;
    case 'ServiceAgreement':
      schema = ServiceAgreementSchema;
      break;
    case 'LicenseAgreement':
      schema = LicenseAgreementSchema;
      break;
    case 'Other':
      schema = GeneralContractSchema;
      break;
    default:
      throw new Error(`Unsupported contract type: ${contractType}`);
  }

  try {
    const result = await generateText({
      model: modelName as any, // Cast to any to handle custom/new model strings
      system: systemPrompt,
      prompt: `Analyze the following contract text and extract the data according to the schema:\n\n${text}`,
      output: Output.object({
        schema: schema,
      }),
      temperature: temperature,
    });

    return {
      object: result.output,
      usage: result.usage
    };
  } catch (error) {
    console.error('Error in extractContractData:', error);
    throw error;
  }
}
