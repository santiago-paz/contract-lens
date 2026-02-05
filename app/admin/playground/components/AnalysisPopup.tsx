import { useEffect } from 'react';
import { CheckCircle, Cpu } from 'lucide-react';
import { JsonFormatter } from './JsonFormatter';

interface AnalysisPopupProps {
  isOpen: boolean;
  result: any;
  onClose: () => void;
}

export const AnalysisPopup = ({ isOpen, result, onClose }: AnalysisPopupProps) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white border-2 border-black shadow-hard-lg max-w-6xl w-full h-[90vh] flex flex-col relative animate-fade-in">
        {/* Header */}
        <div className="bg-black text-white p-4 border-b-2 border-black flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 font-black uppercase tracking-wider text-lg">
            <Cpu className="w-6 h-6 text-[#CCFF00]" />
            Analysis Process Details
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 transition-colors rounded-sm"
          >
            <div className="w-4 h-4 relative">
              <div className="absolute inset-0 rotate-45 bg-white h-0.5 top-1/2 -translate-y-1/2"></div>
              <div className="absolute inset-0 -rotate-45 bg-white h-0.5 top-1/2 -translate-y-1/2"></div>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-8">

          {/* Step 1: Router / Classification */}
          <div className="bg-white border-2 border-black shadow-hard">
            <div className="bg-gray-100 border-b-2 border-black p-4 flex justify-between items-center">
              <h3 className="text-black font-black uppercase tracking-wider flex items-center gap-2">
                <span className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs rounded-full">1</span>
                Router (Classification)
              </h3>
              <div className="flex gap-4 text-xs font-mono">
                <span className="text-black bg-white px-2 py-1 border border-black shadow-sm">
                  Latency: <b>{result.latency.router}ms ({(result.latency.router / 1000).toFixed(2)}s)</b>
                </span>
                <span className="text-black bg-white px-2 py-1 border border-black shadow-sm">
                  Tokens: <b>{result.usage.router?.totalTokens || 'N/A'}</b>
                </span>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block tracking-wider">Input (First 5000 chars)</label>
                <div className="bg-gray-50 border border-gray-200 p-3 h-40 overflow-y-auto font-mono text-xs text-gray-600 whitespace-pre-wrap">
                  {result.rawText.slice(0, 5000)}...
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block tracking-wider">Output (Classification)</label>
                <div className="bg-[#CCFF00]/10 border-2 border-[#CCFF00] p-4 h-40 flex items-center justify-center flex-col">
                  <div className="text-3xl font-black text-black mb-2">{result.classification}</div>
                  <div className="text-xs font-bold text-gray-600 uppercase tracking-widest">Detected Type</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Expert Analysis */}
          <div className="bg-white border-2 border-black shadow-hard">
            <div className="bg-gray-100 border-b-2 border-black p-4 flex justify-between items-center">
              <h3 className="text-black font-black uppercase tracking-wider flex items-center gap-2">
                <span className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs rounded-full">2</span>
                Expert Analysis
              </h3>
              <div className="flex gap-4 text-xs font-mono">
                <span className="text-black bg-white px-2 py-1 border border-black shadow-sm">
                  Latency: <b>{result.latency.expert}ms ({(result.latency.expert / 1000).toFixed(2)}s)</b>
                </span>
                <span className="text-black bg-white px-2 py-1 border border-black shadow-sm">
                  Tokens: <b>{result.usage.totalTokens - (result.usage.router?.totalTokens || 0)}</b>
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Sub-step 2.1: Initial Extraction */}
              <div className="border border-gray-200 bg-gray-50 p-4 relative">
                <div className="absolute -top-3 left-4 bg-white border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                  Step 2.1: Initial Extraction
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs text-gray-500 font-mono">
                     Latency: <b>{result.latency.expertExtraction || result.latency.expert}ms ({((result.latency.expertExtraction || result.latency.expert) / 1000).toFixed(2)}s)</b> | Tokens: <b>{result.usage.extraction?.totalTokens || 'N/A'}</b>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block tracking-wider">Input (Full Text)</label>
                    <div className="bg-white border border-gray-200 p-3 h-40 overflow-y-auto font-mono text-xs text-gray-600 whitespace-pre-wrap">
                      {result.rawText}
                    </div>
                  </div>
                  <div>
                    {/* If repaired, this was the draft. If not, this is final. */}
                    <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block tracking-wider">
                      {result.wasRepaired ? 'Draft Output (Pre-Repair)' : 'Final Output'}
                    </label>
                    <div className={`border-2 p-3 h-40 overflow-y-auto font-mono text-xs ${result.wasRepaired ? 'bg-yellow-50 border-yellow-200 text-black' : 'bg-gray-900 border-black text-[#CCFF00]'}`}>
                       <JsonFormatter data={result.wasRepaired && result.draft ? result.draft : result.parsed} theme={result.wasRepaired ? 'light' : 'dark'} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-step 2.2: Repair / Refinement */}
              {result.wasRepaired && (
                <div className="border border-[#CCFF00] bg-[#CCFF00]/5 p-4 relative animate-fade-in">
                  <div className="absolute -top-3 left-4 bg-[#CCFF00] border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                    Step 2.2: Refinement & Repair
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs text-black font-mono">
                       Latency: <b>{result.latency.expertRepair}ms ({(result.latency.expertRepair / 1000).toFixed(2)}s)</b> | Tokens: <b>{result.usage.repair?.totalTokens || 'N/A'}</b>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold bg-[#CCFF00] text-black px-2 py-1 rounded-sm">
                      <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                      REPAIR TRIGGERED
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-black/20 bg-white/50">
                       <div className="text-center">
                          <p className="text-xs font-bold text-black uppercase mb-2">Reason</p>
                          <p className="text-sm font-medium text-black">Schema Mismatch / Extra Keys Detected</p>
                       </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block tracking-wider">Final Output (Repaired)</label>
                      <div className="bg-gray-900 border-2 border-black p-3 h-40 overflow-y-auto font-mono text-xs text-[#CCFF00]">
                        <JsonFormatter data={result.parsed} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Process Health & Validation */}
          <div className="bg-white border-2 border-black shadow-hard">
            <div className="bg-gray-100 border-b-2 border-black p-4">
              <h3 className="text-black font-black uppercase tracking-wider flex items-center gap-2">
                <span className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs rounded-full">3</span>
                Process Health & Validation
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 text-green-800">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <div className="font-bold uppercase text-xs tracking-wider">Analysis Successful</div>
                  <div className="text-sm">Both Router and Expert steps completed without critical errors.</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <div className="text-[10px] uppercase font-bold text-gray-500">Total Latency</div>
                  <div className="text-black text-xl font-black">{result.latency.total}ms ({(result.latency.total / 1000).toFixed(2)}s)</div>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <div className="text-[10px] uppercase font-bold text-gray-500">Extraction Latency</div>
                  <div className="text-black text-xl font-black">{result.latency.extraction}ms ({(result.latency.extraction / 1000).toFixed(2)}s)</div>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <div className="text-[10px] uppercase font-bold text-gray-500">Total Tokens</div>
                  <div className="text-black text-xl font-black">{result.usage.totalTokens}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-black bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white border-2 border-black font-bold uppercase text-xs hover:bg-[#CCFF00] hover:text-black transition-colors shadow-hard hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
