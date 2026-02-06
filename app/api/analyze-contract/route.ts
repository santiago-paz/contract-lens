import { CONTRACT_TYPES } from '@/lib/constants';
import { extractText } from '@/lib/text-extractor';
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { extractContractData } from '@/actions/contract-extraction';
import type { ContractType } from '@/actions/contract-extraction';

export const maxDuration = 120; // Allow up to 2 minutes for the full pipeline

// ── Helpers ──────────────────────────────────────────────────────────────────

type StreamEvent = Record<string, unknown>;

function createLine(data: StreamEvent): string {
  return JSON.stringify(data) + '\n';
}

// ── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const formData = await request.formData();
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
        // ── Step 1: Text extraction ─────────────────────────────────────────

        emit({
          type: 'log',
          text: `Loading target: ${file.name}`,
          variant: 'system',
        });
        emit({
          type: 'log',
          text: `Size: ${(file.size / 1024).toFixed(1)}KB | Type: ${file.type.split('/').pop()?.toUpperCase() ?? 'UNKNOWN'}`,
          variant: 'dim',
        });
        emit({ type: 'step', id: 'document', status: 'running' });
        emit({
          type: 'log',
          text: 'Parsing document structure...',
          variant: 'info',
        });

        let text: string;
        try {
          text = await extractText(file);
        } catch {
          emit({ type: 'step', id: 'document', status: 'error' });
          emit({
            type: 'log',
            text: 'ERR: Failed to extract text from document',
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
        emit({ type: 'step', id: 'document', status: 'done' });
        emit({
          type: 'log',
          text: `Text extracted: ${text.length.toLocaleString()} chars (${extractionMs}ms)`,
          variant: 'success',
        });

        // ── Step 2: Classification ──────────────────────────────────────────

        emit({ type: 'step', id: 'partner', status: 'running' });
        emit({
          type: 'log',
          text: 'Identifying contract type...',
          variant: 'info',
        });
        emit({
          type: 'log',
          text: 'Model: llama-3.1-8b | Mode: classification',
          variant: 'dim',
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

        emit({ type: 'step', id: 'partner', status: 'done' });
        emit({
          type: 'log',
          text: `Classified: ${classification} (${routerMs}ms)`,
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

        // ── Step 3: Expert analysis ─────────────────────────────────────────

        emit({ type: 'step', id: 'dates', status: 'running' });
        emit({
          type: 'log',
          text: 'Initializing expert extraction...',
          variant: 'info',
        });
        emit({
          type: 'log',
          text: 'Model: deepseek-r1 | Mode: structured output',
          variant: 'dim',
        });

        const expertStart = performance.now();

        const expertResultRaw = await extractContractData(
          text,
          classification as ContractType,
          {}
        );

        const expertMs = Math.round(performance.now() - expertStart);
        const {
          object: expertParsedData,
          usage: expertUsage,
          modelReasoning,
        } = expertResultRaw;

        emit({ type: 'step', id: 'dates', status: 'done' });
        emit({
          type: 'log',
          text: `Expert analysis complete (${(expertMs / 1000).toFixed(1)}s)`,
          variant: 'success',
        });

        // ── Step 4: Metadata compilation ────────────────────────────────────

        emit({ type: 'step', id: 'metadata', status: 'running' });
        emit({
          type: 'log',
          text: 'Compiling extracted metadata...',
          variant: 'info',
        });

        const fieldCount = expertParsedData
          ? Object.values(expertParsedData).filter(
              (v) => v !== null && v !== undefined && v !== ''
            ).length
          : 0;

        emit({ type: 'step', id: 'metadata', status: 'done' });
        emit({
          type: 'log',
          text: `${fieldCount} fields populated from document`,
          variant: 'success',
        });

        // ── Step 5: Finalize ────────────────────────────────────────────────

        emit({ type: 'step', id: 'finish', status: 'running' });
        emit({
          type: 'log',
          text: 'Compiling results object...',
          variant: 'info',
        });

        const totalMs = Math.round(performance.now() - startTime);

        emit({ type: 'step', id: 'finish', status: 'done' });
        emit({
          type: 'log',
          text: `Pipeline complete (${(totalMs / 1000).toFixed(1)}s)`,
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
            parsed: expertParsedData,
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
          text: `ERR: ${message}`,
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
