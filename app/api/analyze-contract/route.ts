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

        // ── Step 2: Expert analysis ─────────────────────────────────────────

        emit({ type: 'step', id: 'analysis', status: 'running' });
        emit({
          type: 'log',
          text: 'Extracting contract details…',
          variant: 'info',
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

        emit({ type: 'step', id: 'analysis', status: 'done' });
        emit({
          type: 'log',
          text: 'Contract analysis complete',
          variant: 'success',
        });

        // ── Finalize (log-only, not a tracked step) ─────────────────────────

        const fieldCount = expertParsedData
          ? Object.values(expertParsedData).filter(
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
