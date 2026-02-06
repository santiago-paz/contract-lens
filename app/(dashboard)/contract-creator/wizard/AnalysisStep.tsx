'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, AlertCircle, Bug, Terminal } from 'lucide-react';
import { ContractAnalysis } from '@/types/contract-analysis';
import { DebugOverlay } from './DebugOverlay';

// ── Types ────────────────────────────────────────────────────────────────────

interface AnalysisStepProps {
  file: File;
  onComplete: (data: ContractAnalysis) => void;
  onCancel: () => void;
}

type LineVariant = 'system' | 'info' | 'success' | 'error' | 'dim';

interface TerminalLine {
  id: number;
  text: string;
  variant: LineVariant;
  timestamp: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const VARIANT_STYLES: Record<LineVariant, { prefix: string; className: string }> = {
  system: { prefix: 'INIT', className: 'text-white font-bold' },
  info: { prefix: '>>>>', className: 'text-[#CCFF00]' },
  success: { prefix: ' [OK]', className: 'text-white' },
  error: { prefix: 'FAIL', className: 'text-red-400 font-bold' },
  dim: { prefix: '----', className: 'text-[#CCFF00]/40' },
};

// ── Component ────────────────────────────────────────────────────────────────

export function AnalysisStep({ file, onComplete, onCancel }: AnalysisStepProps) {
  const [logLines, setLogLines] = useState<TerminalLine[]>([]);
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
  const totalSteps = 5;

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

  // ── Stable PID (generated once) ───────────────────────────────────────────

  const [pid] = useState(() => Math.floor(Math.random() * 99999));

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
        text: 'Initializing analysis pipeline...',
        variant: 'system',
        timestamp: getTimestamp(),
      },
    ]);

    const runAnalysis = async () => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/analyze-contract', {
          method: 'POST',
          body: formData,
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`Server error: ${response.status}`);
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
                        timestamp: getTimestamp(),
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
                          onComplete({
                            ...event.data.parsed,
                            contractType: event.data.classification,
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
          setError('Failed to analyze contract. Please try again or skip.');
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
            <div className="p-2 bg-black text-[#CCFF00] border-2 border-black">
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
              className="px-6 py-3 bg-black text-[#CCFF00] border-2 border-black shadow-hard hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] uppercase font-bold text-sm transition-all"
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
          <div className="p-2 bg-black text-[#CCFF00] border-2 border-black">
            <Terminal className="w-6 h-6" />
          </div>
          System Processing
        </h2>
      </div>

      <div className="bg-white border-2 border-black shadow-hard p-0 flex min-h-[500px]">
        {/* Left: Uploaded File Info */}
        <div className="w-1/3 border-r-2 border-black p-8 bg-gray-50 flex flex-col">
          <div className="mb-8">
            <span className="text-[10px] font-bold uppercase text-gray-500 block mb-2">
              Target File
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
                className="bg-[#CCFF00] border-r border-black h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-bold text-black uppercase">
                {completedSteps}/{totalSteps}
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
                  <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase text-black">
                    Processing...
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
              Abort Operation
            </button>
          </div>
        </div>

        {/* Right: Terminal Output */}
        <div className="w-2/3 p-0 bg-black text-[#CCFF00] font-mono relative overflow-hidden flex flex-col">
          {/* CRT Effect Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />

          {/* Header */}
          <div className="px-6 pt-6 pb-3 relative z-20 border-b border-[#CCFF00]/30 flex justify-between items-end shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#CCFF00]">
              Analysis Protocol v2.4
            </h3>
            <span className="text-[10px] opacity-70">PID: {pid}</span>
          </div>

          {/* Log area */}
          <div
            ref={logRef}
            className="flex-1 overflow-y-auto px-6 py-4 relative z-20 scrollbar-thin scrollbar-thumb-[#CCFF00]/20 scrollbar-track-transparent"
          >
            <div className="space-y-1">
              {logLines.map((line) => {
                const style = VARIANT_STYLES[line.variant];
                return (
                  <div key={line.id} className="flex gap-2 text-xs leading-relaxed animate-fade-in">
                    <span className="text-[#CCFF00]/30 shrink-0 select-none">
                      [{line.timestamp}]
                    </span>
                    <span className="text-[#CCFF00]/50 shrink-0 w-10 text-right select-none">
                      {style.prefix}
                    </span>
                    <span className={style.className}>{line.text}</span>
                  </div>
                );
              })}

              {/* Blinking cursor */}
              {isRunning && (
                <div className="flex gap-2 text-xs leading-relaxed">
                  <span className="text-[#CCFF00]/30 shrink-0 select-none">
                    [{getTimestamp()}]
                  </span>
                  <span className="text-[#CCFF00]/50 shrink-0 w-10 text-right select-none">
                    {'>>>>'}
                  </span>
                  <span className="text-[#CCFF00] animate-pulse">█</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 relative z-20 border-t border-[#CCFF00]/30 text-[10px] text-[#CCFF00]/50 uppercase flex justify-between shrink-0">
            <span>Steps: {completedSteps}/{totalSteps}</span>
            <span>Elapsed: {elapsedSec}s</span>
            <span>Core: {isRunning ? 'Active' : 'Idle'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
