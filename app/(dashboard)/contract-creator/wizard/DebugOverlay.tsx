import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Code, AlertTriangle, CheckCircle } from 'lucide-react';
import { ContractAnalysis } from '@/types/contract-analysis';

interface DebugOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  data?: ContractAnalysis | null;
  error?: string | null;
  context?: string;
}

export function DebugOverlay({ isOpen, onClose, data, error, context }: DebugOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${error ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Response Debugger</h2>
              <p className="text-sm text-gray-500">Context: {context || 'Unknown'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-900">Analysis Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {data ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                 <CheckCircle className="w-4 h-4 text-green-600" />
                 <span className="text-sm font-medium text-gray-700">Successfully extracted data</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Field Mapping</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                          <th className="px-4 py-2">Field</th>
                          <th className="px-4 py-2">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {Object.entries(data).map(([key, value]) => (
                          <tr key={key} className="hover:bg-gray-50/50">
                            <td className="px-4 py-2 font-medium text-gray-700 font-mono text-xs">{key}</td>
                            <td className="px-4 py-2 text-gray-600 break-words max-w-xs">
                              {value === null ? <span className="text-gray-400 italic">null</span> : String(value).slice(0, 100) + (String(value).length > 100 ? '...' : '')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Raw JSON Response</h3>
                   <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-inner">
                     <pre className="p-4 text-xs font-mono text-blue-300 overflow-x-auto">
                       {JSON.stringify(data, null, 2)}
                     </pre>
                   </div>
                </div>
              </div>
            </div>
          ) : !error ? (
            <div className="text-center py-12 text-gray-500">
              No data available to debug yet.
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close Debugger
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
