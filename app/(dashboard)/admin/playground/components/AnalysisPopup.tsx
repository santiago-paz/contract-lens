import { useEffect, useState } from 'react';
import { CheckCircle, Cpu, Brain, ChevronDown, ChevronRight, Copy, Check, X } from 'lucide-react';
import { JsonFormatter } from './JsonFormatter';

interface AnalysisPopupProps {
  isOpen: boolean;
  result: any;
  onClose: () => void;
}

export const AnalysisPopup = ({ isOpen, result, onClose }: AnalysisPopupProps) => {
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyReasoning = async () => {
    if (result?.modelReasoning) {
      await navigator.clipboard.writeText(result.modelReasoning);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white border border-gray-200 shadow-lg rounded-sm max-w-6xl w-full h-[90vh] flex flex-col relative animate-fade-in">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-black">
            <Cpu className="w-5 h-5 text-gray-500" />
            Analysis Process Details
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors rounded-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">

          {/* Step 1: Router / Classification */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <h3 className="text-black font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] rounded-full">1</span>
                Router (Classification)
              </h3>
              <div className="flex gap-3 text-[10px] font-mono">
                <span className="text-gray-500 bg-white px-2 py-1 border border-gray-200 rounded-sm">
                  Latency: <b className="text-black">{result.latency.router}ms ({(result.latency.router / 1000).toFixed(2)}s)</b>
                </span>
                <span className="text-gray-500 bg-white px-2 py-1 border border-gray-200 rounded-sm">
                  Tokens: <b className="text-black">{result.usage.router?.totalTokens || 'N/A'}</b>
                </span>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Input (First 5000 chars)</label>
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 h-40 overflow-y-auto font-mono text-xs text-gray-600 whitespace-pre-wrap">
                  {result.rawText.slice(0, 5000)}...
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Output (Classification)</label>
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 h-40 flex items-center justify-center flex-col">
                  <div className="text-3xl font-black text-black mb-2">{result.classification}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detected Type</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Expert Analysis */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <h3 className="text-black font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] rounded-full">2</span>
                Expert Analysis (DeepSeek)
              </h3>
              <div className="flex gap-3 text-[10px] font-mono">
                <span className="text-gray-500 bg-white px-2 py-1 border border-gray-200 rounded-sm">
                  Latency: <b className="text-black">{result.latency.expert}ms ({(result.latency.expert / 1000).toFixed(2)}s)</b>
                </span>
                <span className="text-gray-500 bg-white px-2 py-1 border border-gray-200 rounded-sm">
                  Tokens: <b className="text-black">{result.usage.expert?.totalTokens || 'N/A'}</b>
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Extraction Result */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Input (Contract Text)</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 h-48 overflow-y-auto font-mono text-xs text-gray-600 whitespace-pre-wrap">
                    {result.rawText}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Extracted Data</label>
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-sm p-3 h-48 overflow-y-auto font-mono text-xs text-green-400">
                    <JsonFormatter data={result.parsed} />
                  </div>
                </div>
              </div>

              {/* Model Reasoning (from <think> tags) */}
              {result.modelReasoning && (
                <div className="border border-purple-200 bg-purple-50/50 rounded-sm p-4 relative animate-fade-in">
                  <div className="absolute -top-3 left-4 bg-purple-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1 rounded-sm">
                    <Brain className="w-3 h-3" />
                    Model Reasoning
                  </div>
                  
                  <div
                    onClick={() => setIsReasoningExpanded(!isReasoningExpanded)}
                    className="w-full flex items-center justify-between p-2 hover:bg-purple-100 rounded-sm transition-colors mt-2 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsReasoningExpanded(!isReasoningExpanded);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {isReasoningExpanded ? (
                        <ChevronDown className="w-4 h-4 text-purple-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-purple-600" />
                      )}
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                        {isReasoningExpanded ? 'Hide' : 'Show'} Chain of Thought ({result.modelReasoning.length.toLocaleString()} chars)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-[10px] text-purple-400 font-mono">
                        DeepSeek Reasoning Mode
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyReasoning();
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200 rounded-sm transition-colors"
                        title="Copy reasoning to clipboard"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {isReasoningExpanded && (
                    <div className="mt-3 bg-white border border-purple-200 rounded-sm p-4 max-h-96 overflow-y-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                        {result.modelReasoning}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Process Health & Validation */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <h3 className="text-black font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] rounded-full">3</span>
                Process Health & Validation
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-sm">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <div className="font-bold uppercase text-xs tracking-wider">Analysis Successful</div>
                  <div className="text-sm">Both Router and Expert steps completed without critical errors.</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Total Latency</div>
                  <div className="text-black text-xl font-black">{result.latency.total}ms</div>
                  <div className="text-[10px] text-gray-400">{(result.latency.total / 1000).toFixed(2)}s</div>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Router</div>
                  <div className="text-black text-xl font-black">{result.latency.router}ms</div>
                  <div className="text-[10px] text-gray-400">{result.usage.router?.totalTokens || 0} tokens</div>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Expert</div>
                  <div className="text-black text-xl font-black">{result.latency.expert}ms</div>
                  <div className="text-[10px] text-gray-400">{result.usage.expert?.totalTokens || 0} tokens</div>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Total Tokens</div>
                  <div className="text-black text-xl font-black">{result.usage.totalTokens}</div>
                  <div className="text-[10px] text-gray-400">all steps</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-end rounded-b-sm">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black text-white border border-black font-bold uppercase text-xs rounded-sm hover:bg-[#CCFF00] hover:text-black transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
