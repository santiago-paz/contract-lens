import React, { useEffect, useState } from 'react';
import { AlertCircle, Copy, WrapText } from 'lucide-react';
import { JsonFormatter } from './JsonFormatter';

interface ErrorPopupProps {
  isOpen: boolean;
  message: string;
  details?: string;
  onClose: () => void;
}

export const ErrorPopup = ({ isOpen, message, details, onClose }: ErrorPopupProps) => {
  const [wrapLines, setWrapLines] = useState(true);

  // Helper to traverse
  const getValueByPath = (obj: any, path: (string | number)[]) => {
    if (!obj) return undefined;
    let current = obj;
    for (const key of path) {
      if (current === undefined || current === null) return undefined;
      current = current[key];
    }
    return current;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Parse validation errors from details
  const { validationErrors, failedObject } = details ? (() => {
    try {
      const parsedDetails = JSON.parse(details);
      let foundErrors = null;
      let foundObject = null;

      // Helper to traverse
      let current = parsedDetails;
      while (current) {
        if (current.message && typeof current.message === 'string') {
          const valueMatch = current.message.match(/Type validation failed: Value: (\{[\s\S]*}). Error message:/);
          if (valueMatch && valueMatch[1]) {
            try {
              foundObject = JSON.parse(valueMatch[1]);
            } catch { }
          }

          const errorMatch = current.message.match(/Error message: (\[[\s\S]*])/);
          if (errorMatch && errorMatch[1]) {
            try {
              const parsed = JSON.parse(errorMatch[1]);
              if (Array.isArray(parsed)) foundErrors = parsed;
            } catch { }
          } else {
            try {
              const parsed = JSON.parse(current.message);
              if (Array.isArray(parsed)) foundErrors = parsed;
            } catch { }
          }
        }

        if (foundErrors) break;

        if (current.cause) {
          current = current.cause;
        } else {
          break;
        }
      }
      return { validationErrors: foundErrors, failedObject: foundObject };
    } catch {
      return { validationErrors: null, failedObject: null };
    }
  })() : { validationErrors: null, failedObject: null };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white border-2 border-black shadow-hard-lg max-w-5xl w-full relative animate-fade-in">
        <div className="bg-red-500 text-white p-3 border-b-2 border-black flex justify-between items-center">
          <div className="flex items-center gap-2 font-black uppercase tracking-wider">
            <AlertCircle className="w-5 h-5" />
            Error Occurred
          </div>
          <button
            onClick={onClose}
            className="hover:bg-black/20 p-1 transition-colors"
          >
            <div className="w-4 h-4 relative">
              <div className="absolute inset-0 rotate-45 bg-white h-0.5 top-1/2 -translate-y-1/2"></div>
              <div className="absolute inset-0 -rotate-45 bg-white h-0.5 top-1/2 -translate-y-1/2"></div>
            </div>
          </button>
        </div>
        <div className="p-6">
          <div className="bg-gray-100 border-2 border-black p-4 font-mono text-xs text-black overflow-auto max-h-[70vh] mb-6">
            <div className="font-bold mb-2 uppercase tracking-wider text-red-600">Error Message:</div>
            <div className="mb-6 text-sm font-bold whitespace-pre-wrap break-words">{message}</div>

            {validationErrors && validationErrors.length > 0 && (
              <div className="mb-6 bg-white border-2 border-red-200 p-4 rounded-sm">
                <div className="font-bold mb-3 uppercase tracking-wider text-red-600 flex items-center gap-2 border-b border-red-100 pb-2">
                  <AlertCircle className="w-4 h-4" />
                  Schema Validation Errors ({validationErrors.length})
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-red-50 border-b border-red-100">
                      <tr>
                        <th className="p-2 font-bold uppercase text-red-800 w-1/4">Field</th>
                        <th className="p-2 font-bold uppercase text-red-800 w-1/4">Value</th>
                        <th className="p-2 font-bold uppercase text-red-800 w-1/4">Issue</th>
                        <th className="p-2 font-bold uppercase text-red-800 w-1/4">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-50">
                      {validationErrors.map((err: any, i: number) => {
                        const value = getValueByPath(failedObject, err.path);
                        return (
                          <tr key={i} className="hover:bg-red-50/50 transition-colors">
                            <td className="p-2 font-mono font-bold text-red-900 align-top">
                              {err.path?.join('.')}
                            </td>
                            <td className="p-2 font-mono text-gray-600 align-top text-[10px] break-all">
                              {value !== undefined ? (
                                typeof value === 'string' ? `"${value}"` : JSON.stringify(value)
                              ) : (
                                <span className="text-gray-400 italic">undefined</span>
                              )}
                            </td>
                            <td className="p-2 text-red-700 align-top font-medium">
                              {err.message}
                            </td>
                            <td className="p-2 font-mono text-red-600 text-[10px] align-top">
                              {err.code === 'invalid_format' && err.pattern && (
                                <div className="bg-red-100 px-1.5 py-0.5 rounded w-fit">Pattern: {err.pattern}</div>
                              )}
                              {err.code === 'invalid_type' && (
                                <div>Expected: {err.expected}, Received: {err.received}</div>
                              )}
                              {err.code === 'invalid_enum_value' && (
                                <div>Allowed: {err.options?.join(', ')}</div>
                              )}
                              <div className="opacity-50 mt-1">Code: {err.code}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {details && (
              <>
                <div className="flex justify-between items-end border-t-2 border-gray-200 pt-4 mb-2">
                  <div className="font-bold uppercase tracking-wider text-gray-500">Technical Details:</div>
                  <button
                    onClick={() => setWrapLines(!wrapLines)}
                    className="text-[10px] font-bold uppercase flex items-center gap-1 hover:bg-gray-200 px-2 py-1 rounded transition-colors border border-transparent hover:border-gray-300"
                  >
                    <WrapText className="w-3 h-3" />
                    {wrapLines ? 'Unwrap Lines' : 'Wrap Lines'}
                  </button>
                </div>
                <div className={`text-[10px] leading-relaxed opacity-100 bg-[#1a1a1a] border border-black p-3 rounded-sm shadow-inner ${wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre overflow-x-auto'}`}>
                  <JsonFormatter data={details} />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => copyToClipboard(JSON.stringify({ message: message, details: details }, null, 2))}
              className="px-4 py-2 border-2 border-black font-bold uppercase text-xs text-black flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-hard hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              <Copy className="w-4 h-4" /> Copy Error
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-white border-2 border-black font-bold uppercase text-xs hover:bg-[#CCFF00] hover:text-black transition-colors shadow-hard hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
