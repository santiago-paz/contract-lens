'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, AlertCircle, Bug, CheckCircle2, Circle, ArrowRight, XCircle } from 'lucide-react';
import { ContractAnalysis } from '@/types/contract-analysis';
import { DebugOverlay } from './DebugOverlay';

// ── Types ────────────────────────────────────────────────────────────────────

interface AnalysisStepProps {
  file: File;
  onComplete: (data: ContractAnalysis) => void;
  onCancel: () => void;
}

type LineVariant = 'system' | 'info' | 'success' | 'error' | 'dim';

interface LogEntry {
  id: number;
  text: string;
  variant: LineVariant;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<LineVariant, { icon: 'circle' | 'arrow' | 'check' | 'x' | 'dot'; className: string }> = {
  system: { icon: 'circle', className: 'text-white font-medium' },
  info: { icon: 'arrow', className: 'text-[#00D4FF]' },
  success: { icon: 'check', className: 'text-white' },
  error: { icon: 'x', className: 'text-red-400 font-medium' },
  dim: { icon: 'dot', className: 'text-[#00D4FF]/40' },
};

function VariantIcon({ icon }: { icon: string }) {
  const base = 'w-3.5 h-3.5 shrink-0 mt-[1px]';
  switch (icon) {
    case 'check':
      return <CheckCircle2 className={`${base} text-[#00D4FF]`} />;
    case 'arrow':
      return <ArrowRight className={`${base} text-[#00D4FF]/60`} />;
    case 'x':
      return <XCircle className={`${base} text-red-400`} />;
    case 'circle':
      return <Circle className={`${base} text-white/60`} />;
    default:
      return <span className={`${base} text-[#00D4FF]/30 inline-block text-center`}>·</span>;
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export function AnalysisStep({ file, onComplete, onCancel }: AnalysisStepProps) {
  const [logLines, setLogLines] = useState<LogEntry[]>([]);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Debug
  const [showDebug, setShowDebug] = useState(false);
  const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === 'true';

  const logRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const totalSteps = 2;

  // ── Elapsed timer ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  // ── Auto-scroll ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logLines]);

  // (pid removed — not needed for simplified UI)

  // ── Stream consumer ────────────────────────────────────────────────────────

  useEffect(() => {
    let mounted = true;
    const abortController = new AbortController();
    startTimeRef.current = Date.now();

    // Add initial boot line
    const bootId = lineIdRef.current++;
    setLogLines([
      {
        id: bootId,
        text: 'Starting document analysis…',
        variant: 'system',
      },
    ]);

    const runAnalysis = async () => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Do not set Content-Type: fetch will set multipart/form-data with boundary automatically
        const response = await fetch('/api/analyze-contract', {
          method: 'POST',
          body: formData,
          signal: abortController.signal,
        });

        if (!response.ok) {
          let message = `Server error: ${response.status}`;
          try {
            const body = await response.json();
            if (body?.error) message = body.error;
            if (body?.detail) message += ` — ${body.detail}`;
          } catch {
            // ignore
          }
          throw new Error(message);
        }
        if (!response.body) {
          throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim() || !mounted) continue;

            try {
              const event = JSON.parse(line);

              switch (event.type) {
                case 'log':
                  if (mounted) {
                    setLogLines((prev) => [
                      ...prev,
                      {
                        id: lineIdRef.current++,
                        text: event.text,
                        variant: (event.variant as LineVariant) || 'info',
                      },
                    ]);
                  }
                  break;

                case 'step':
                  if (mounted && event.status === 'done') {
                    setCompletedSteps((prev) => prev + 1);
                  }
                  break;

                case 'result':
                  if (mounted) {
                    setIsRunning(false);
                    if (event.success && event.data) {
                      // Brief delay so user sees the final log lines
                      setTimeout(() => {
                        if (mounted) {
                          const parsed = event.data.parsed ?? {};
                          const classification = event.data.classification;

                          // Build counterparty string from parties or licensor/licensee
                          const counterparty =
                            parsed.parties?.filter(Boolean).join(' & ') ||
                            [parsed.licensor, parsed.licensee].filter(Boolean).join(' & ') ||
                            null;

                          // Derive duration type from parsed data
                          let durationType: string | null = null;
                          if (parsed.terminationDate || parsed.expirationDate) {
                            durationType = 'Fixed-term';
                          } else if (parsed.autoRenewal === true) {
                            durationType = 'Indefinite';
                          }

                          onComplete({
                            // Spread all raw schema fields so the sidebar can access them
                            ...parsed,
                            contractType: classification,
                            // Map schema fields → sidebar standard names
                            title: parsed.suggestedTitle || parsed.documentTitle || null,
                            contractPartner: counterparty,
                            contractStart: parsed.effectiveDate || null,
                            liabilityAmount: parsed.liabilityCap || null,
                            durationType,
                          });
                        }
                      }, 1200);
                    } else {
                      setError(event.error || 'Analysis failed');
                    }
                  }
                  break;

                case 'error':
                  if (mounted) {
                    setIsRunning(false);
                    setError(event.message || 'Unknown error');
                  }
                  break;
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }
      } catch (err: unknown) {
        if (mounted && err instanceof DOMException && err.name === 'AbortError') {
          return; // Expected on unmount
        }
        if (mounted) {
          setIsRunning(false);
          const message =
            err instanceof Error ? err.message : 'Failed to analyze contract. Please try again or skip.';
          setError(message);
        }
      }
    };

    runAnalysis();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [file]);

  // ── Error state ────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto animate-fade-in font-mono">
        <DebugOverlay
          isOpen={showDebug}
          onClose={() => setShowDebug(false)}
          error={error}
          context="AnalysisStep - Error"
        />

        <div className="mb-6">
          <h2 className="text-2xl font-black text-black flex items-center gap-3 uppercase tracking-tighter">
            <div className="p-2 bg-black text-[#00D4FF] border-2 border-black">
              <FileText className="w-6 h-6" />
            </div>
            Analysis Failed
          </h2>
        </div>
        <div className="bg-white border-2 border-black shadow-hard p-12 text-center">
          <div className="w-16 h-16 bg-red-600 text-white flex items-center justify-center mx-auto mb-4 border-2 border-black shadow-hard-sm">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-black uppercase mb-2">
            Process Terminated
          </h3>
          <p className="text-gray-600 mb-8 uppercase text-sm">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 border-2 border-black bg-white hover:bg-black hover:text-white uppercase font-bold text-sm transition-colors"
            >
              Abort
            </button>
            <button
              onClick={() => {
                onComplete({
                  contractType: 'General Terms and Conditions',
                  title: file.name.replace(/\.[^/.]+$/, ''),
                  status: 'Review',
                  durationType: 'Fixed-term',
                  summary: '',
                  contractOwner: null,
                  deputy: null,
                  contractManager: null,
                  externalReference: null,
                  organizationalUnit: null,
                  contractValue: null,
                  confidentiality: null,
                  contractPartner: null,
                  contractStart: null,
                  conditions: null,
                  riskAssessment: null,
                  liabilityAmount: null,
                  comments: null,
                } as any);
              }}
              className="px-6 py-3 bg-black text-[#00D4FF] border-2 border-black shadow-hard hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] uppercase font-bold text-sm transition-all"
            >
              Continue Manually
            </button>

            {isDebugMode && (
              <button
                onClick={() => setShowDebug(true)}
                className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2 font-mono text-xs uppercase"
              >
                <Bug className="w-4 h-4" />
                Debug
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────

  const elapsedSec = (elapsedMs / 1000).toFixed(1);
  const progressPct = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in font-mono">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-black flex items-center gap-3 uppercase tracking-tighter">
          <div className="p-2 bg-black text-[#00D4FF] border-2 border-black">
            <FileText className="w-6 h-6" />
          </div>
          Analyzing Document
        </h2>
      </div>

      <div className="bg-white border-2 border-black shadow-hard p-0 flex min-h-[500px]">
        {/* Left: Uploaded File Info */}
        <div className="w-1/3 border-r-2 border-black p-8 bg-gray-50 flex flex-col">
          <div className="mb-8">
            <span className="text-[10px] font-bold uppercase text-gray-500 block mb-2">
              Document
            </span>
            <div className="p-4 bg-white border-2 border-black shadow-hard-sm">
              <FileText className="w-8 h-8 text-black mb-2" />
              <h3 className="font-bold text-black text-xs uppercase line-clamp-2 leading-tight break-all">
                {file.name}
              </h3>
              <p className="text-[10px] text-gray-500 mt-1 uppercase">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase text-gray-500 block mb-2">
              Progress
            </span>
            <div className="w-full bg-gray-200 border border-black h-3">
              <div
                className="bg-[#00D4FF] border-r border-black h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-bold text-black uppercase">
                Step {completedSteps} of {totalSteps}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                {progressPct}%
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-4">
              {isRunning ? (
                <>
                  <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase text-black">
                    Processing…
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs font-bold uppercase text-black">
                    Complete
                  </span>
                </>
              )}
            </div>
            <button
              onClick={onCancel}
              className="text-xs font-bold text-red-600 hover:text-red-700 uppercase hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right: Activity Log */}
        <div className="w-2/3 p-0 bg-black text-[#00D4FF] font-mono relative overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 pt-6 pb-3 border-b border-[#00D4FF]/20 shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#00D4FF]">
              Activity Log
            </h3>
          </div>

          {/* Log area */}
          <div
            ref={logRef}
            className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-[#00D4FF]/20 scrollbar-track-transparent"
          >
            <div className="space-y-2">
              {logLines.map((line) => {
                const config = VARIANT_CONFIG[line.variant];
                return (
                  <div key={line.id} className="flex items-start gap-2.5 text-xs leading-relaxed animate-fade-in">
                    <VariantIcon icon={config.icon} />
                    <span className={config.className}>{line.text}</span>
                  </div>
                );
              })}

              {/* Blinking cursor */}
              {isRunning && (
                <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-[1px] text-[#00D4FF]/40" />
                  <span className="text-[#00D4FF] animate-pulse">█</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#00D4FF]/20 text-[10px] text-[#00D4FF]/40 uppercase flex justify-between shrink-0">
            <span>Step {completedSteps} of {totalSteps}</span>
            <span>{elapsedSec}s elapsed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
