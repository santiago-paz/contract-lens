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
  stripThinkingTags,
  stripToSchema,
} from '@/actions/contract-extraction';
import type { ContractType } from '@/actions/contract-extraction';

export const maxDuration = 120; // Allow up to 2 minutes for the full pipeline

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
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    return Response.json(
      {
        error: 'Content-Type must be multipart/form-data. Do not set Content-Type manually when sending FormData.',
      },
      { status: 400 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to parse body as FormData';
    return Response.json(
      {
        error: 'Invalid multipart body. Ensure the request is sent as FormData without custom headers.',
        detail: message,
      },
      { status: 400 }
    );
  }

  const file = formData.get('file') as File | null;

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 });
  }

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
        // ── Text extraction (pre-processing, not a tracked step) ────────────

        emit({
          type: 'log',
          text: `Opening document: ${file.name}`,
          variant: 'system',
        });
        emit({
          type: 'log',
          text: `${(file.size / 1024).toFixed(1)} KB · ${file.type.split('/').pop()?.toUpperCase() ?? 'UNKNOWN'}`,
          variant: 'dim',
        });
        emit({
          type: 'log',
          text: 'Reading document content…',
          variant: 'info',
        });

        let text: string;
        try {
          text = await extractText(file);
        } catch {
          emit({
            type: 'log',
            text: 'Could not extract text from this document',
            variant: 'error',
          });
          emit({
            type: 'error',
            message: 'Failed to extract text from document',
          });
          controller.close();
          return;
        }

        const extractionMs = Math.round(performance.now() - startTime);
        emit({
          type: 'log',
          text: 'Document content extracted successfully',
          variant: 'success',
        });

        // ── Step 1: Classification ──────────────────────────────────────────

        emit({ type: 'step', id: 'classification', status: 'running' });
        emit({
          type: 'log',
          text: 'Identifying contract type…',
          variant: 'info',
        });

        const routerStart = performance.now();

        const routerPrompt = `Analyze the first 5000 chars of the document. Classify strictly into: ${CONTRACT_TYPES.join(', ')}. If unclear, choose Other.

    Document Text (First 5000 chars):
    
    ${text.slice(0, 5000)}`;

        const { output: routerResult, usage: routerUsage } = await generateText({
          model: 'meta/llama-3.1-8b' as any,
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

        emit({ type: 'step', id: 'classification', status: 'done' });
        emit({
          type: 'log',
          text: `Contract type: ${classification}`,
          variant: 'success',
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

        // ── Step 2: Expert analysis (streaming) ────────────────────────────

        emit({ type: 'step', id: 'analysis', status: 'running' });
        emit({
          type: 'log',
          text: 'Extracting contract details…',
          variant: 'info',
        });

        const schema = getSchemaForType(classification as ContractType);
        const systemPrompt = getSystemPrompt(classification as ContractType, schema);

        const expertStart = performance.now();

        const streamResult = streamText({
          model: 'deepseek/deepseek-r1' as any,
          system: systemPrompt,
          prompt: `Analyze the following contract text and extract the data according to the schema:\n\n<contract_text>\n${text}\n</contract_text>`,
          temperature: 0,
        });

        let fullText = '';
        let fullReasoning = '';
        let reasoningStarted = false;
        let textStarted = false;
        let lastProgressEmit = 0;

        for await (const part of streamResult.fullStream) {
          if (part.type === 'reasoning-delta') {
            fullReasoning += part.text;

            if (!reasoningStarted) {
              reasoningStarted = true;
              emit({
                type: 'log',
                text: 'Model is reasoning…',
                variant: 'info',
              });
              lastProgressEmit = performance.now();
            }

            // Emit periodic progress updates every ~3 seconds
            const now = performance.now();
            if (now - lastProgressEmit > 3000) {
              lastProgressEmit = now;
              const elapsed = Math.round((now - expertStart) / 1000);
              emit({
                type: 'log',
                text: `Still analyzing… (${elapsed}s)`,
                variant: 'dim',
              });
            }
          } else if (part.type === 'text-delta') {
            fullText += part.text;

            if (!textStarted) {
              textStarted = true;
              emit({
                type: 'log',
                text: 'Generating structured output…',
                variant: 'info',
              });
            }
          }
        }

        const expertMs = Math.round(performance.now() - expertStart);

        // Parse the text output as JSON
        let expertParsedData: any = null;
        const textToParse = fullText || '';
        const cleanedText = stripThinkingTags(textToParse);

        try {
          expertParsedData = JSON.parse(cleanedText);
        } catch (parseError) {
          console.error('Failed to parse expert output as JSON:', parseError);
          console.error('Raw text (first 500 chars):', textToParse.substring(0, 500));
          console.error('Cleaned text (first 500 chars):', cleanedText.substring(0, 500));
        }

        // Extract reasoning from <think> tags if not captured from stream
        let modelReasoning: string | null = fullReasoning || null;
        if (!fullReasoning && textToParse) {
          const thinkMatch = textToParse.match(/<think>([\s\S]*?)<\/think>/i);
          if (thinkMatch && thinkMatch[1]) {
            modelReasoning = thinkMatch[1].trim();
          }
        }

        // Strip extra keys to match schema
        const finalObject = expertParsedData
          ? stripToSchema(expertParsedData, schema)
          : null;

        // Get usage from the completed stream
        const expertUsage = await streamResult.usage;

        // If JSON parsing failed, treat as an error
        if (!finalObject) {
          emit({ type: 'step', id: 'analysis', status: 'done' });
          emit({
            type: 'log',
            text: 'Failed to parse model output as valid JSON',
            variant: 'error',
          });
          emit({
            type: 'result',
            success: false,
            error: 'The model did not produce valid structured output. Please try again.',
            data: {
              rawText: text,
              parsed: null,
              classification,
              modelReasoning,
              latency: {
                extraction: extractionMs,
                router: routerMs,
                expert: expertMs,
                total: Math.round(performance.now() - startTime),
              },
            },
          });
          controller.close();
          return;
        }

        emit({ type: 'step', id: 'analysis', status: 'done' });
        emit({
          type: 'log',
          text: 'Contract analysis complete',
          variant: 'success',
        });

        // ── Finalize (log-only, not a tracked step) ─────────────────────────

        const fieldCount = finalObject
          ? Object.values(finalObject).filter(
              (v) => v !== null && v !== undefined && v !== ''
            ).length
          : 0;

        emit({
          type: 'log',
          text: `${fieldCount} data fields extracted from document`,
          variant: 'success',
        });

        const totalMs = Math.round(performance.now() - startTime);

        emit({
          type: 'log',
          text: 'Done — all steps complete',
          variant: 'success',
        });

        // ── Final result ────────────────────────────────────────────────────

        const totalTokens =
          (routerUsage.totalTokens || 0) + (expertUsage?.totalTokens || 0);

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
            modelReasoning,
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
        emit({
          type: 'log',
          text: message,
          variant: 'error',
        });
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
