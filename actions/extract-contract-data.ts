import { generateText, Output } from 'ai';
import { z } from 'zod';

// --- Types ---

export type ContractType = 'NDA' | 'ServiceAgreement' | 'LicenseAgreement' | 'Other';

export interface ExtractionOptions {
  model?: string;
  temperature?: number;
  systemPromptOverride?: string;
}

// --- Optimized Schemas for Split Berlin ---

// 1. NDA Schema (Confidentiality)
// Focus: When can we talk? How aggressive is the contract?
export const NDASchema = z.object({
  parties: z.array(z.string()).describe('Full legal names of the entities...').default([]).nullable(),
  effectiveDate: z.string().nullable().describe('YYYY-MM-DD or null').default(null),
  expirationDate: z.string().nullable().describe('YYYY-MM-DD or null').default(null),
  confidentialityDuration: z.string().nullable().describe('Duration text or null').default(null),
  isMutual: z.boolean().nullable().describe('True if both share info, False if one-way, null if unclear').default(null),
  jurisdiction: z.string().nullable().describe('City/Country or null').default(null),
  riskFlags: z.object({
    nonSolicit: z.boolean().nullable().describe('True if non-solicitation clause exists').default(null),
    nonCompete: z.boolean().nullable().describe('True if non-compete clause exists').default(null),
    liquidatedDamages: z.boolean().nullable().describe('True if liquidated damages clause exists').default(null),
  }).nullable().describe('Risk flags found in the contract').default(null),
});

// 2. Service Agreement / MSA Schema (Provision of Services)
// Focus: Money, deliverables and legal responsibility.
export const ServiceAgreementSchema = z.object({
  parties: z.array(z.string()).describe('Names of the Client and the Service Provider.').default([]).nullable(),
  effectiveDate: z.string().nullable().describe('Start date of the services. Format: YYYY-MM-DD.').default(null),
  terminationDate: z.string().nullable().describe('Final date of the service period. If auto-renewing, leave null but set autoRenewal to true. Format: YYYY-MM-DD.').default(null),
  autoRenewal: z.boolean().nullable().describe('True if the contract automatically extends unless someone cancels it.').default(null),
  paymentTerms: z.object({
    method: z.string().describe('e.g., "Bank Transfer", "Credit Card", "Stripe".'),
    timing: z.string().describe('e.g., "Net 30", "Upfront", "Monthly".'),
    currency: z.string().describe('e.g., "EUR", "USD".'),
  }).nullable().describe('Payment terms').default(null),
  ipOwnership: z.string().nullable().describe('Who owns the final work? Look for "Work made for hire" (Client) or "Provider retains ownership".').default(null),
  terminationNoticePeriod: z.string().nullable().describe('How much time in advance must a party notify to cancel (e.g., "30 days notice").').default(null),
  liabilityCap: z.string().nullable().describe('The maximum amount one party can sue the other for (e.g., "Equal to fees paid in last 12 months", "1.000.000€").').default(null),
  indemnification: z.enum(['client_indemnifies', 'provider_indemnifies', 'mutual', 'none']).nullable().describe('Who protects whom from third-party legal claims.').default(null),
});

// 3. License Agreement Schema (Software / Software as a Service)
// Focus: Usage rights, audits and scale limits.
export const LicenseAgreementSchema = z.object({
  licensor: z.string().describe('The owner/seller of the software.'),
  licensee: z.string().describe('The user/buyer of the software.'),
  softwareName: z.string().nullable().describe('The specific product or platform being licensed.'),
  licenseType: z.enum(['perpetual', 'subscription', 'evaluation', 'open_source']).describe('The model of the license.'),
  usageLimits: z.string().describe('Constraints like "Max 50 users", "1 server instance", or "Unlimited".'),
  exclusivity: z.boolean().describe('True if the licensee is the ONLY one allowed to use this specific implementation.'),
  renewalDate: z.string().nullable().describe('The next date the user has to pay to keep access. Crucial for SaaS logic. Format: YYYY-MM-DD.'),
  auditRights: z.object({
    canAudit: z.boolean().describe('True if the licensor can inspect the licensee’s systems to check usage.'),
    noticePeriod: z.string().nullable().describe('Minimum days of warning before an audit.'),
  }).nullable(),
  territory: z.string().describe('Geographic restriction (e.g., "Worldwide", "European Union Only").'),
});

// 4. General / Other Schema (General Terms and Conditions)
// Focus: Quick classification for any unknown document.
export const GeneralContractSchema = z.object({
  documentTitle: z.string().describe('The main heading of the document.'),
  summary: z.string().describe('A 2-sentence explanation of what this contract is about.'),
  parties: z.array(z.string()).describe('Names of all involved entities.'),
  keyDates: z.array(z.object({
    label: z.string().describe('e.g., "Expiration", "Payment Due", "Review Date".'),
    date: z.string().describe('YYYY-MM-DD.'),
  })).describe('Any important dates found in the text for the calendar.'),
  governingLaw: z.string().nullable().describe('Which country/state laws apply.'),
});

// Union Type for Return
export type ContractData =
  | z.infer<typeof NDASchema>
  | z.infer<typeof ServiceAgreementSchema>
  | z.infer<typeof LicenseAgreementSchema>
  | z.infer<typeof GeneralContractSchema>;

// --- Helper: System Prompt Generator ---

const PROMPT_TEMPLATES: Record<ContractType, string> = {
  NDA: `Focus on confidentiality terms, specifically:
- Mutual vs Unilateral: Determine if obligations are one-way or reciprocal.
- Definition of Confidential Information: What is covered?
- Exclusions: What is NOT confidential?
- Specific risk flags: Non-solicit, non-compete, and liquidated damages.`,

  ServiceAgreement: `Focus on the service relationship:
- Standard of Care: What is the quality expectation?
- Payment Terms: Exact mechanisms, timing, and currency.
- Indemnification: Who protects whom (Client vs Provider vs Mutual).
- Liability Cap: Critical. If a formula (e.g., "12 months fees"), extract the EXACT wording.`,

  LicenseAgreement: `Focus on the licensing model:
- Scope of License: What is being licensed and how?
- Sublicensing rights: Can the licensee resell or sublicense?
- Territory: Geographic restrictions.
- Audit Rights: Can the licensor inspect usage?`,

  Other: `Focus on general contract metadata:
- Identify all Parties involved.
- Extract key dates (Effective, Expiration).
- Determine Governing Law and Jurisdiction.`
};

function getSystemPrompt(contractType: ContractType): string {
  const specificInstructions = PROMPT_TEMPLATES[contractType] || PROMPT_TEMPLATES.Other;

  return `You are a Senior Legal AI specialized in contract analysis.
Your goal is to extract structured data from the provided contract text.

<system_instructions>
1.  **Input Structure**: The contract text will be enclosed in <contract_text> tags. Search strictly within these tags.
2.  **Chain of Thought (CoT)**: Before generating the final JSON, perform a mental "step-by-step" analysis for each field in the schema. Ensure every extracted value is backed by the text.
3.  **Zero Hallucination**:
    - If a field is not explicitly stated, return 'null'.
    - Do NOT infer or guess values.
    - If a value is missing, it is 'null'.
4.  **Formulas & Liability**: For fields like 'liabilityCap', if the value is a formula (e.g., "fees paid in the last 12 months"), extract the *exact literal sentence*. Do NOT calculate a number.
5.  **Strict Schema Compliance**:
    - You must generate a single JSON object that strictly matches the provided Zod schema.
    - **No nesting** unless the schema defines an object (e.g., 'riskFlags', 'paymentTerms').
    - Do not add fields that are not in the schema.
</system_instructions>

<contract_type_focus>
${specificInstructions}
</contract_type_focus>

<structure_warning>
CRITICAL: Respect the JSON hierarchy.
- DO NOT nest fields under categories like "commercialTerms" or "terminationRights" unless the schema explicitly asks for it.
- Keep the JSON structure flat where the schema is flat.
- For fields defined as objects (like 'auditRights'), you MUST return a valid JSON object, not a string.
- Do not add fields that are not in the schema.
- Do not add default values to the fields.
</structure_warning>`;
}

// --- Helper: Strip Extra Keys ---

/**
 * Recursively strips keys from an object that are not defined in the Zod schema.
 * This ensures we never return properties that weren't requested.
 */
function stripToSchema<T extends z.ZodObject<any>>(
  data: unknown,
  schema: T
): z.infer<T> {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data as z.infer<T>;
  }

  const schemaShape = schema.shape;
  const schemaKeys = Object.keys(schemaShape);
  const result: Record<string, unknown> = {};

  for (const key of schemaKeys) {
    if (key in (data as Record<string, unknown>)) {
      const value = (data as Record<string, unknown>)[key];
      const fieldSchema = schemaShape[key];

      // Handle nested objects: if the field schema is a ZodObject, recurse
      if (fieldSchema instanceof z.ZodObject) {
        result[key] = value !== null ? stripToSchema(value, fieldSchema) : null;
      } else if (fieldSchema instanceof z.ZodNullable) {
        // Check if the inner type is an object
        const innerType = fieldSchema._def.innerType;
        if (innerType instanceof z.ZodObject) {
          result[key] = value !== null ? stripToSchema(value, innerType) : null;
        } else {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    } else {
      // Key not in data, set to null or use default
      result[key] = null;
    }
  }

  return result as z.infer<T>;
}

// --- Repair / Refinement Step ---

async function repairContractData(
  draftData: any,
  targetSchema: z.ZodObject<any>,
  modelName: string,
  originalTextSummary?: string // Optional context if needed
) {
  try {
    const repairSystemPrompt = `You are a Data Normalization Expert.
Your task is to map an existing JSON object (which may have incorrect property names or structure) to a Strict Target Schema.

<instructions>
1. **Input**: You will receive a "Draft JSON" and a "Target Schema".
2. **Goal**: Create a new JSON object that strictly adheres to the "Target Schema".
3. **Mapping Strategy**:
   - Look for data in the "Draft JSON" that corresponds to fields in the "Target Schema".
   - If a field in the Draft JSON has a different name but the same meaning as a Target Schema field, map its value.
   - Example: If Draft has "client_name": "Acme" and Target has "parties": ["Acme"], map it.
   - Example: If Draft has "confidentiality_period" and Target has "confidentialityDuration", map it.
4. **Strictness**:
   - Do NOT include any fields from the Draft JSON that do not exist in the Target Schema.
   - Do NOT invent new data. Use only what is provided in the Draft JSON.
   - If a required field in the Target Schema is missing in the Draft JSON, set it to null (or default) as per the schema definition.
</instructions>`;

    const repairResult = await generateText({
      model: modelName as any,
      system: repairSystemPrompt,
      prompt: `Target Schema:
${JSON.stringify(targetSchema.shape, null, 2)} 
(Note: Interpret specific Zod constraints from context)

Draft JSON:
${JSON.stringify(draftData, null, 2)}

Please fix the JSON to match the Target Schema.`,
      output: Output.object({
        schema: targetSchema, // Use the strict schema here to enforce structure
      }),
      temperature: 0,
    });

    // Strip any extra keys that slipped through despite the schema
    const strippedObject = stripToSchema(repairResult.output, targetSchema);

    return {
      object: strippedObject,
      usage: repairResult.usage
    };
  } catch (error) {
    console.warn('Repair step failed, returning original draft data:', error);
    // Even on fallback, strip to schema to ensure consistency
    const strippedFallback = stripToSchema(draftData, targetSchema);
    return { object: strippedFallback, usage: null };
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
  const modelName = options.model || 'meta/llama-3.1-70b';
  // If systemPromptOverride is present, use it completely. Otherwise, generate based on type.
  const systemPrompt = options.systemPromptOverride || getSystemPrompt(contractType);
  const temperature = options.temperature ?? 0;

  // Select the correct schema based on contractType
  let schema: z.ZodObject<any>;
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
    // Step 2: Extraction with Passthrough
    // We use .passthrough() to capture hallucinated keys instead of stripping them.
    // This allows the Repair step to see the "wrong" keys and map them.
    const looseSchema = schema.passthrough();

    let draftObject: any;
    let usage: any;
    let needsRepair = false;

    try {
      const result = await generateText({
        model: modelName as any, // Cast to any to handle custom/new model strings
        system: systemPrompt,
        prompt: `Analyze the following contract text and extract the data according to the schema:\n\n<contract_text>\n${text}\n</contract_text>`,
        output: Output.object({
          schema: looseSchema as any,
        }),
        temperature: temperature,
      });

      draftObject = result.output;
      usage = result.usage;

      // Check for extra keys in the successful response (hallucinated fields)
      const strictKeys = Object.keys(schema.shape);
      const resultKeys = Object.keys(draftObject as object);
      const hasExtraKeys = resultKeys.some((k) => !strictKeys.includes(k));

      if (hasExtraKeys) {
        console.log('Detected extra keys in extraction. Flagging for repair...');
        needsRepair = true;
      }
    } catch (error: any) {
      // Handle Validation Error (structure mismatch, type mismatch) provided by AI SDK
      // If the model generated text but it didn't match the schema, the SDK throws but provides the 'text'
      if (error.message?.includes('No object generated') || error.name === 'AI_NoObjectGeneratedError' || error.text) {
        if (error.text) {
          console.warn('Extraction validation failed. Attempting repair from raw output.');
          try {
            draftObject = JSON.parse(error.text);
            usage = error.usage || {};
            needsRepair = true; // Force repair because validation failed
          } catch (e) {
            console.error('Failed to parse raw text from validation error:', e);
            throw error; // JSON parse failed, fatal
          }
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }

    // Step 3: Repair / Refinement
    let finalObject = draftObject;
    let repairUsage: any = null;
    let repairLatency = 0;

    if (needsRepair) {
      console.log('Triggering Repair Step...');
      const repairStartTime = performance.now();
      const repairResult = await repairContractData(draftObject, schema, modelName);
      const repairEndTime = performance.now();

      finalObject = repairResult.object;
      repairUsage = repairResult.usage;
      repairLatency = Math.round(repairEndTime - repairStartTime);
    }

    // Final safety: always strip to schema to ensure no extra properties leak through
    const strippedFinalObject = stripToSchema(finalObject, schema);

    return {
      object: strippedFinalObject,
      usage: usage, // Main extraction usage
      extractionUsage: usage,
      repairUsage: repairUsage,
      wasRepaired: needsRepair,
      repairLatency,
      draftObject: needsRepair ? draftObject : null
    };
  } catch (error) {
    console.error('Error in extractContractData:', error);
    throw error;
  }
}
