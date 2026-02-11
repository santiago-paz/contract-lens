import React, { useEffect, useRef } from 'react';
import { Cpu, Brain, FileSearch, Tag, Sparkles, ArrowRight } from 'lucide-react';
import type { StreamPhase } from './usePlayground';

export const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center text-gray-400 select-none">
    <div className="border border-gray-200 p-8 rounded-full mb-6">
      <Cpu className="w-20 h-20 text-gray-300" />
    </div>
    <p className="uppercase font-bold tracking-widest text-sm text-gray-400">System Ready</p>
    <p className="font-mono text-xs mt-2 text-gray-300">Waiting for input stream...</p>
  </div>
);

export const LoadingState = () => (
  <div className="h-full flex flex-col items-center justify-center text-black">
    <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-8"></div>
    <p className="uppercase font-bold tracking-widest text-sm animate-pulse">Processing Contract</p>
    <div className="mt-4 font-mono text-[10px] text-gray-400 uppercase">
      Router classification in progress...
    </div>
  </div>
);

// ── Phase indicator pill ────────────────────────────────────────────────────

const PHASE_CONFIG: Record<
  Exclude<StreamPhase, 'idle' | 'done' | 'error'>,
  { icon: React.ElementType; label: string; color: string }
> = {
  extracting: {
    icon: FileSearch,
    label: 'Extracting Text',
    color: 'bg-blue-500',
  },
  classifying: {
    icon: Tag,
    label: 'Classifying Contract',
    color: 'bg-amber-500',
  },
  analyzing: {
    icon: Brain,
    label: 'DeepSeek R1 Reasoning',
    color: 'bg-purple-500',
  },
};

// ── Streaming reasoning state ───────────────────────────────────────────────

interface StreamingStateProps {
  phase: StreamPhase;
  message: string;
  reasoning: string;
  classification: string | null;
  /** When phase is 'done', called when user clicks "Next" to go to results */
  onContinue?: () => void;
}

export const StreamingState = ({
  phase,
  message,
  reasoning,
  classification,
  onContinue,
}: StreamingStateProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as reasoning streams in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [reasoning]);

  const isAnalyzing = phase === 'analyzing';
  const isDone = phase === 'done';
  const showReasoningPanel = isAnalyzing || isDone;
  const phaseConfig =
    phase !== 'idle' && phase !== 'done' && phase !== 'error'
      ? PHASE_CONFIG[phase]
      : null;

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      {/* Phase header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {phaseConfig && (
            <div
              className={`${phaseConfig.color} text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-sm`}
            >
              <phaseConfig.icon className="w-3.5 h-3.5" />
              {phaseConfig.label}
            </div>
          )}
          {classification && (
            <div className="bg-gray-100 text-gray-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm border border-gray-200">
              Type: {classification}
            </div>
          )}
        </div>
        {(isAnalyzing || isDone) && reasoning && (
          <div className="text-[10px] font-mono text-gray-400">
            {reasoning.length.toLocaleString()} chars
          </div>
        )}
      </div>

      {/* Status message for extracting/classifying only (not analyzing, not done) */}
      {!showReasoningPanel && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-6"></div>
          <p className="uppercase font-bold tracking-widest text-sm text-black animate-pulse">
            {message || 'Processing…'}
          </p>
          <p className="font-mono text-[10px] text-gray-400 mt-2 uppercase">
            {phase === 'extracting' && 'Reading document content…'}
            {phase === 'classifying' && 'Running router model…'}
          </p>
        </div>
      )}

      {/* Reasoning stream (analyzing = live stream, done = full text + Next) */}
      {showReasoningPanel && (
        <div className="flex-1 flex flex-col min-h-0 gap-4">
          {/* Reasoning content area */}
          <div
            ref={scrollRef}
            className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-sm overflow-y-auto relative min-h-0"
          >
            {/* Header bar */}
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-gray-800 px-4 py-2 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-purple-400">
                <Brain className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Chain of Thought
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-gray-500">streaming…</span>
                  </>
                ) : (
                  <span className="text-[10px] font-mono text-green-500/80">complete</span>
                )}
              </div>
            </div>

            {/* Reasoning text */}
            <div className="p-6">
              {reasoning ? (
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {reasoning}
                  {isAnalyzing && (
                    <span className="inline-block w-2 h-4 bg-purple-400 ml-0.5 animate-pulse align-middle" />
                  )}
                </pre>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-purple-400 rounded-full animate-spin"></div>
                  <span className="text-xs font-mono">Waiting for model reasoning…</span>
                </div>
              )}
            </div>
          </div>

          {/* Next button when reasoning is done */}
          {isDone && onContinue && (
            <div className="flex justify-end shrink-0">
              <button
                type="button"
                onClick={onContinue}
                className="px-6 py-3 bg-black text-white border border-black font-bold uppercase text-sm tracking-wider flex items-center gap-2 rounded-sm hover:bg-[#00D4FF] hover:text-black active:translate-y-[1px] transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
