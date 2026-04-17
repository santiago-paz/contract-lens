import { CONTRACT_TYPES } from '@/lib/constants';
import { extractText } from '@/lib/text-extractor';
import { generateText, streamText, Output } from 'ai';
import { z } from 'zod';
import {
  getSystemPrompt,
  NDASchema,
  ServiceAgreementSchema,
  LicenseAgreementSchema,
  GeneralContractSchema,
} from '@/actions/contract-extraction';
import type { ContractType } from '@/actions/contract-extraction';
import { stripThinkingTags, stripToSchema } from '@/actions/contract-extraction';

import { getSession } from '@/lib/auth';

export const maxDuration = 120; // Allow up to 2 minutes for the full pipeline
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ── Helpers ──────────────────────────────────────────────────────────────────

type StreamEvent = Record<string, unknown>;

function createLine(data: StreamEvent): string {
  return JSON.stringify(data) + '\n';
}

/**
 * Returns the Zod schema for the given contract type.
 */
function getSchemaForType(contractType: ContractType) {
  switch (contractType) {
    case 'NDA':
      return NDASchema;
    case 'ServiceAgreement':
      return ServiceAgreementSchema;
    case 'LicenseAgreement':
      return LicenseAgreementSchema;
    case 'Other':
      return GeneralContractSchema;
    default:
      throw new Error(`Unsupported contract type: ${contractType}`);
  }
}

// ── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const systemPromptOverride = formData.get('systemPrompt') as string | null;
  const modelOverride = formData.get('model') as string | null;
  const temperatureStr = formData.get('temperature') as string | null;

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: 'File too large (max 10MB)' }, { status: 413 });
  }

  const temperature = temperatureStr ? parseFloat(temperatureStr) : 0;
  const modelName = modelOverride || 'deepseek/deepseek-r1';

  const encoder = new TextEncoder();
  const startTime = performance.now();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: StreamEvent) => {
        try {
          controller.enqueue(encoder.encode(createLine(event)));
        } catch {
          // Stream already closed — ignore
        }
      };

      try {
        // ── Step 0: Text extraction ──────────────────────────────────────

        emit({
          type: 'status',
          phase: 'extracting',
          message: `Reading document: ${file.name}`,
        });

        let text: string;
        try {
          text = await extractText(file);
        } catch {
          emit({
            type: 'error',
            message: 'Failed to extract text from document',
          });
          controller.close();
          return;
        }

        const extractionMs = Math.round(performance.now() - startTime);
        emit({
          type: 'status',
          phase: 'extracting',
          message: `Document extracted (${text.length.toLocaleString()} chars)`,
        });

        // ── Step 1: Classification ───────────────────────────────────────

        emit({
          type: 'status',
          phase: 'classifying',
          message: 'Classifying contract type…',
        });

        const routerStart = performance.now();

        const routerPrompt = `Analyze the first 5000 chars of the document. Classify strictly into: ${CONTRACT_TYPES.join(', ')}. If unclear, choose Other.

    Document Text (First 5000 chars):
    
    ${text.slice(0, 5000)}`;

        const { output: routerResult, usage: routerUsage } = await generateText({
          model: 'openai/gpt-4o-mini' as any,
          output: Output.object({
            schema: z.object({
              classification: z.enum(CONTRACT_TYPES),
            }),
          }),
          prompt: routerPrompt,
          temperature: 0,
        });

        const classification = routerResult.classification;
        const routerMs = Math.round(performance.now() - routerStart);

        emit({
          type: 'classification',
          result: classification,
          latency: routerMs,
          usage: routerUsage,
        });

        if (classification === 'Other') {
          emit({
            type: 'result',
            success: false,
            error: "Could not automatically determine contract type.",
            data: {
              rawText: text,
              parsed: null,
              classification,
              latency: {
                extraction: extractionMs,
                router: routerMs,
                total: Math.round(performance.now() - startTime),
              },
            },
          });
          controller.close();
          return;
        }

        // ── Step 2: Expert analysis with streaming ───────────────────────

        emit({
          type: 'status',
          phase: 'analyzing',
          message: 'DeepSeek R1 is analyzing the contract…',
        });

        const schema = getSchemaForType(classification as ContractType);
        const systemPrompt =
          systemPromptOverride || getSystemPrompt(classification as ContractType, schema);

        const expertStart = performance.now();

        const result = streamText({
          model: modelName as any,
          system: systemPrompt,
          prompt: `Analyze the following contract text and extract the data according to the schema:\n\n<contract_text>\n${text}\n</contract_text>`,
          temperature,
        });

        // Stream reasoning and text chunks to the client
        let fullText = '';
        let fullReasoning = '';

        for await (const part of result.fullStream) {
          if (part.type === 'reasoning-delta') {
            fullReasoning += part.text;
            emit({
              type: 'reasoning',
              text: part.text, // delta
            });
          } else if (part.type === 'text-delta') {
            fullText += part.text;
            // We don't emit text deltas to keep UI clean — the JSON output
            // will be parsed at the end once the stream finishes.
          }
        }

        const expertMs = Math.round(performance.now() - expertStart);

        // Parse the text output as JSON
        let extractedObject: any = null;

        // The model might output text with <think> tags if reasoning isn't
        // natively separated by the provider, so handle both cases
        const textToParse = fullText || '';
        const cleanedText = stripThinkingTags(textToParse);

        try {
          extractedObject = JSON.parse(cleanedText);
        } catch (parseError) {
          console.error('Failed to parse expert output as JSON:', parseError);
          console.error('Raw text (first 500 chars):', textToParse.substring(0, 500));
          console.error('Cleaned text (first 500 chars):', cleanedText.substring(0, 500));
        }

        // If we got reasoning from <think> tags but not from the stream
        if (!fullReasoning && textToParse) {
          const thinkMatch = textToParse.match(/<think>([\s\S]*?)<\/think>/i);
          if (thinkMatch && thinkMatch[1]) {
            fullReasoning = thinkMatch[1].trim();
          }
        }

        // Strip extra keys to match schema
        const finalObject = extractedObject
          ? stripToSchema(extractedObject, schema)
          : null;

        // Get usage from the completed stream
        const expertUsage = await result.usage;

        const totalMs = Math.round(performance.now() - startTime);
        const totalTokens =
          (routerUsage.totalTokens || 0) + (expertUsage?.totalTokens || 0);

        // ── Final result ─────────────────────────────────────────────────

        emit({
          type: 'result',
          success: true,
          data: {
            rawText: text,
            parsed: finalObject,
            classification,
            usage: {
              router: routerUsage,
              expert: expertUsage,
              totalTokens,
            },
            modelReasoning: fullReasoning || null,
            latency: {
              extraction: extractionMs,
              router: routerMs,
              expert: expertMs,
              total: totalMs,
            },
          },
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Unknown error during analysis';
        emit({ type: 'error', message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
