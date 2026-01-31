'use client';

import { hydrateContract } from '@/actions/hydrate-contract';
import { analyzeContractPlayground } from '@/actions/playground-analysis';
import { ContractAnalysis } from '@/types/contract-analysis';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  Copy,
  Cpu,
  Database,
  FileText,
  Layout,
  Play,
  Upload,
  Zap,
  Terminal,
  WrapText,
  Shield,
  Briefcase,
  Scale
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export default function PlaygroundPage() {
  // Inputs
  const [file, setFile] = useState<File | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [model, setModel] = useState<string>('meta/llama-3.1-70b');
  const [temperature, setTemperature] = useState<number>(0);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    rawText: string;
    parsed: ContractAnalysis | null;
    classification?: any;
    usage: any;
    latency: { extraction: number; router?: number; expert?: number; total: number };
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'parsed' | 'raw' | 'json'>('parsed');
  const [hydrateStatus, setHydrateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isAnalysisPopupOpen, setIsAnalysisPopupOpen] = useState(false);

  const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; message: string; details?: string } | null>(null);
  const [wrapLines, setWrapLines] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse validation errors from details
  const { validationErrors, failedObject } = errorPopup?.details ? (() => {
    try {
      const details = JSON.parse(errorPopup.details);
      let foundErrors = null;
      let foundObject = null;
      
      // Helper to traverse
      let current = details;
      while (current) {
        if (current.message && typeof current.message === 'string') {
           const valueMatch = current.message.match(/Type validation failed: Value: (\{.*\}). Error message:/s);
           if (valueMatch && valueMatch[1]) {
             try {
               foundObject = JSON.parse(valueMatch[1]);
             } catch {}
           }

           const errorMatch = current.message.match(/Error message: (\[.*\])/s);
           if (errorMatch && errorMatch[1]) {
             try {
               const parsed = JSON.parse(errorMatch[1]);
               if (Array.isArray(parsed)) foundErrors = parsed;
             } catch {}
           } else {
             try {
                const parsed = JSON.parse(current.message);
                if (Array.isArray(parsed)) foundErrors = parsed;
             } catch {}
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

  const getValueByPath = (obj: any, path: (string | number)[]) => {
    if (!obj) return undefined;
    let current = obj;
    for (const key of path) {
      if (current === undefined || current === null) return undefined;
      current = current[key];
    }
    return current;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setHydrateStatus('idle');
    }
  };

  const handleExecute = async () => {
    if (!file) return;

    setIsLoading(true);
    setResult(null);
    setHydrateStatus('idle');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('systemPrompt', systemPrompt);
      formData.append('model', model);
      formData.append('temperature', temperature.toString());

      const res = await analyzeContractPlayground(formData);

      if (res.success && res.data) {
        setResult(res.data as any);
      } else {
        console.error(res.error);
        setErrorPopup({ 
          isOpen: true, 
          message: 'Analysis failed: ' + res.error,
          details: (res as any).errorDetails
        });
      }
    } catch (err) {
      console.error(err);
      setErrorPopup({ 
        isOpen: true, 
        message: 'An unexpected error occurred.',
        details: JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHydrate = async () => {
    if (!result?.parsed || !result.rawText) return;

    setHydrateStatus('loading');
    try {
      const res = await hydrateContract(result.parsed, result.rawText);
      if (res.success) {
        setHydrateStatus('success');
      } else {
        console.error(res.error);
        setHydrateStatus('error');
      }
    } catch (err) {
      console.error(err);
      setHydrateStatus('error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const closeErrorPopup = () => {
    setErrorPopup(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeErrorPopup();
      }
    };

    if (errorPopup?.isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [errorPopup?.isOpen]);

  const JsonFormatter = ({ data }: { data: any }) => {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        return <span className="text-green-400">"{data}"</span>;
      }
    }

    if (data === null) return <span className="text-gray-500 font-bold">null</span>;
    if (typeof data === 'boolean') return <span className="text-purple-400 font-bold">{data.toString()}</span>;
    if (typeof data === 'number') return <span className="text-orange-400 font-bold">{data}</span>;
    
    if (Array.isArray(data)) {
      if (data.length === 0) return <span className="text-gray-400">[]</span>;
      return (
        <span>
          <span className="text-gray-400">[</span>
          <div className="pl-4 border-l border-gray-700">
            {data.map((item, i) => (
              <div key={i}>
                <JsonFormatter data={item} />
                {i < data.length - 1 && <span className="text-gray-500">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-400">]</span>
        </span>
      );
    }

    if (typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length === 0) return <span className="text-gray-400">{'{}'}</span>;
      return (
        <span>
          <span className="text-gray-400">{'{'}</span>
          <div className="pl-4 border-l border-gray-700">
            {keys.map((key, i) => (
              <div key={key}>
                <span className="text-sky-300 font-bold">"{key}"</span>: <JsonFormatter data={data[key]} />
                {i < keys.length - 1 && <span className="text-gray-500">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-400">{'}'}</span>
        </span>
      );
    }

    return <span className="text-green-400">"{String(data)}"</span>;
  };

  const renderParsedContent = () => {
    if (!result?.parsed) return null;
    const { parsed } = result;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Common Header */}
        <div className="col-span-2 bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow relative group">
          <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">Meta</div>
          <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Title</label>
          <h2 className="text-2xl font-black leading-tight group-hover:text-[#CCFF00] group-hover:bg-black transition-colors inline-block px-1 -ml-1 text-black">{parsed.title}</h2>
        </div>

        <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
          <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Type</label>
          <div className="flex items-center gap-2">
            {parsed.contractType === 'NDA' && <Shield className="w-5 h-5" />}
            {parsed.contractType === 'ServiceAgreement' && <Briefcase className="w-5 h-5" />}
            {parsed.contractType === 'LicenseAgreement' && <Scale className="w-5 h-5" />}
            <p className="font-bold text-lg border-b-4 border-[#CCFF00] inline-block text-black">{parsed.contractType}</p>
          </div>
        </div>

        {/* NDA Specifics */}
        {parsed.contractType === 'NDA' && (
          <>
            <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Duration</label>
              <p className="font-mono font-bold text-lg text-black">{parsed.duration}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Mutual?</label>
              <p className="font-bold text-lg text-black">{parsed.isMutual ? 'Yes' : 'No'}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Jurisdiction</label>
              <p className="font-bold text-lg text-black">{parsed.jurisdiction}</p>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-6">
               <div className="bg-white p-6 border-2 border-black shadow-hard">
                 <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Disclosing Party</label>
                 <p className="font-bold text-black">{parsed.disclosingParty}</p>
               </div>
               <div className="bg-white p-6 border-2 border-black shadow-hard">
                 <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Receiving Party</label>
                 <p className="font-bold text-black">{parsed.receivingParty}</p>
               </div>
            </div>
          </>
        )}

        {/* Service Agreement Specifics */}
        {parsed.contractType === 'ServiceAgreement' && (
          <>
            <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Value</label>
              <p className="font-mono font-bold text-lg text-black">{parsed.totalContractValue || 'N/A'}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Payment</label>
              <p className="font-bold text-sm text-black">{parsed.paymentSchedule}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Notice Period</label>
              <p className="font-bold text-lg text-black">{parsed.terminationNoticePeriod}</p>
            </div>
             <div className="col-span-3 grid grid-cols-2 gap-6">
               <div className="bg-white p-6 border-2 border-black shadow-hard">
                 <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Provider</label>
                 <p className="font-bold text-black">{parsed.providerName}</p>
               </div>
               <div className="bg-white p-6 border-2 border-black shadow-hard">
                 <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Client</label>
                 <p className="font-bold text-black">{parsed.clientName}</p>
               </div>
            </div>
            <div className="col-span-3 bg-white p-6 border-2 border-black shadow-hard">
                <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Deliverables</label>
                <ul className="list-disc list-inside space-y-1">
                    {parsed.deliverables.map((d, i) => (
                        <li key={i} className="text-sm font-medium text-black">{d}</li>
                    ))}
                </ul>
            </div>
          </>
        )}

        {/* License Agreement Specifics */}
        {parsed.contractType === 'LicenseAgreement' && (
          <>
             <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Territory</label>
              <p className="font-bold text-sm text-black">{parsed.territory}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Exclusivity</label>
              <p className="font-bold text-lg text-black">{parsed.exclusivity ? 'Exclusive' : 'Non-Exclusive'}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Samples</label>
              <p className="font-bold text-sm text-black">{parsed.productSamplesRequired || 'None'}</p>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-6">
               <div className="bg-white p-6 border-2 border-black shadow-hard">
                 <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Licensor</label>
                 <p className="font-bold text-black">{parsed.licensor}</p>
               </div>
               <div className="bg-white p-6 border-2 border-black shadow-hard">
                 <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Licensee</label>
                 <p className="font-bold text-black">{parsed.licensee}</p>
               </div>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-6">
                <div className="bg-white p-6 border-2 border-black shadow-hard">
                    <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Audit Rights</label>
                    <p className="text-sm text-black">{parsed.auditRights || 'None'}</p>
                </div>
                <div className="bg-white p-6 border-2 border-black shadow-hard">
                    <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Insurance</label>
                    <p className="text-sm text-black">{parsed.insuranceRequirements || 'None'}</p>
                </div>
            </div>
          </>
        )}

        {/* Summary (Common) */}
        {parsed.summary && (
            <div className="col-span-3 bg-white p-8 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#CCFF00] -mr-8 -mt-8 rotate-45 border-2 border-black"></div>
                <label className="text-[10px] uppercase font-black text-gray-600 mb-4 block tracking-wider">Executive Summary</label>
                <p className="leading-relaxed text-lg font-medium text-black">{parsed.summary}</p>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-mono text-sm flex bg-noise relative overflow-hidden">
      {/* Error Popup */}
      {errorPopup?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-black shadow-hard-lg max-w-5xl w-full relative animate-fade-in">
            <div className="bg-red-500 text-white p-3 border-b-2 border-black flex justify-between items-center">
              <div className="flex items-center gap-2 font-black uppercase tracking-wider">
                <AlertCircle className="w-5 h-5" />
                Error Occurred
              </div>
              <button 
                onClick={closeErrorPopup}
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
                <div className="mb-6 text-sm font-bold whitespace-pre-wrap break-words">{errorPopup.message}</div>
                
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

                {errorPopup.details && (
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
                      <JsonFormatter data={errorPopup.details} />
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => copyToClipboard(JSON.stringify({ message: errorPopup.message, details: errorPopup.details }, null, 2))}
                  className="px-4 py-2 border-2 border-black font-bold uppercase text-xs text-black flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-hard hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  <Copy className="w-4 h-4" /> Copy Error
                </button>
                <button
                  onClick={closeErrorPopup}
                  className="px-4 py-2 bg-black text-white border-2 border-black font-bold uppercase text-xs hover:bg-[#CCFF00] hover:text-black transition-colors shadow-hard hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Details Popup */}
      {isAnalysisPopupOpen && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-black shadow-hard-lg max-w-6xl w-full h-[90vh] flex flex-col relative animate-fade-in">
            {/* Header */}
            <div className="bg-black text-white p-4 border-b-2 border-black flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 font-black uppercase tracking-wider text-lg">
                <Cpu className="w-6 h-6 text-[#CCFF00]" />
                Analysis Process Details
              </div>
              <button 
                onClick={() => setIsAnalysisPopupOpen(false)}
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
                  <h3 className="font-black uppercase tracking-wider flex items-center gap-2">
                    <span className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs rounded-full">1</span>
                    Router (Classification)
                  </h3>
                  <div className="flex gap-4 text-xs font-mono">
                    <span className="bg-white px-2 py-1 border border-black shadow-sm">
                      Latency: <b>{result.latency.router}ms</b>
                    </span>
                    <span className="bg-white px-2 py-1 border border-black shadow-sm">
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
                  <h3 className="font-black uppercase tracking-wider flex items-center gap-2">
                    <span className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs rounded-full">2</span>
                    Expert Analysis
                  </h3>
                  <div className="flex gap-4 text-xs font-mono">
                    <span className="bg-white px-2 py-1 border border-black shadow-sm">
                      Latency: <b>{result.latency.expert}ms</b>
                    </span>
                    <span className="bg-white px-2 py-1 border border-black shadow-sm">
                      Tokens: <b>{result.usage.expert?.totalTokens || 'N/A'}</b>
                    </span>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block tracking-wider">Input (Full Text)</label>
                    <div className="bg-gray-50 border border-gray-200 p-3 h-64 overflow-y-auto font-mono text-xs text-gray-600 whitespace-pre-wrap">
                      {result.rawText}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block tracking-wider">Output (Parsed Data)</label>
                    <div className="bg-gray-900 border-2 border-black p-3 h-64 overflow-y-auto font-mono text-xs text-[#CCFF00]">
                      <JsonFormatter data={result.parsed} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Analysis Section (if applicable) */}
              {/* Since we only show this popup on success (result exists), we show the successful path. 
                  If there were errors in the process that didn't stop the flow (e.g. non-fatal), they would be here.
                  For now, we can show a "No Errors" state or simply omitted if strict success. 
                  However, the user asked for "All with error analysis". 
                  If the result is present, it means success. 
                  I will add a section for "Validation / Health" */}
               <div className="bg-white border-2 border-black shadow-hard">
                <div className="bg-gray-100 border-b-2 border-black p-4">
                  <h3 className="font-black uppercase tracking-wider flex items-center gap-2">
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
                        <div className="text-xl font-black">{result.latency.total}ms</div>
                      </div>
                      <div className="p-3 bg-gray-50 border border-gray-200">
                        <div className="text-[10px] uppercase font-bold text-gray-500">Extraction Latency</div>
                        <div className="text-xl font-black">{result.latency.extraction}ms</div>
                      </div>
                      <div className="p-3 bg-gray-50 border border-gray-200">
                        <div className="text-[10px] uppercase font-bold text-gray-500">Total Tokens</div>
                        <div className="text-xl font-black">{result.usage.totalTokens}</div>
                      </div>
                   </div>
                </div>
              </div>

            </div>
            
            {/* Footer */}
            <div className="p-4 border-t-2 border-black bg-white flex justify-end">
              <button
                onClick={() => setIsAnalysisPopupOpen(false)}
                className="px-6 py-2 bg-black text-white border-2 border-black font-bold uppercase text-xs hover:bg-[#CCFF00] hover:text-black transition-colors shadow-hard hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0"></div>

      {/* Sidebar Controls */}
      <div className="w-96 bg-white border-r-2 border-black flex flex-col h-screen sticky top-0 z-10 shadow-hard-lg">
        <div className="p-4 border-b-2 border-black bg-black text-white">
          <h1 className="font-black text-xl flex items-center gap-2 uppercase tracking-tighter">
            <Terminal className="w-5 h-5 text-[#CCFF00]" />
            Playground <span className="text-[#CCFF00] text-xs self-end mb-1">v2.0</span>
          </h1>
          <p className="text-[10px] text-gray-600 mt-1 font-bold uppercase tracking-widest">Router + Expert Architecture</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* File Input */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider bg-[#CCFF00] text-black px-2 py-1 border border-black inline-block shadow-hard-sm">Input Document</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-black p-8 text-center cursor-pointer transition-all group relative overflow-hidden
                ${file ? 'bg-[#CCFF00]/10' : 'bg-white hover:bg-gray-50'}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx"
              />
              <div className="relative z-10">
                <Upload className={`w-8 h-8 mx-auto mb-3 transition-transform group-hover:-translate-y-1 ${file ? 'text-black' : 'text-gray-600'}`} />
                {file ? (
                  <div className="font-bold text-black border-b-2 border-black inline-block pb-1 line-clamp-1">{file.name}</div>
                ) : (
                  <div className="text-xs font-bold text-black uppercase tracking-wide line-clamp-1">Drop PDF/DOCX here</div>
                )}
              </div>
            </div>
          </div>

          {/* Model Settings */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-1 inline-block shadow-hard-sm">Expert Model</label>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-3 border-2 border-black bg-white text-xs font-bold text-black appearance-none rounded-none shadow-hard-sm focus:shadow-hard transition-all focus:outline-none cursor-pointer"
                >
                  <option value="meta/llama-3.1-70b">Meta Llama 3.1 70B</option>
                  <option value="openai/gpt-4o">GPT-4o</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black"></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider flex justify-between items-center">
                <span className="bg-black text-white px-2 py-1 shadow-hard-sm">Temperature</span>
                <span className="font-mono font-bold text-lg border-b-2 border-[#CCFF00]">{temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-none appearance-none border border-black cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#CCFF00] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:shadow-hard-sm"
              />
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-3 flex-1 flex flex-col">
            <label className="text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-1 inline-block shadow-hard-sm w-max">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="OVERRIDE EXPERT PROMPT..."
              className="w-full flex-1 min-h-[150px] p-4 border-2 border-black bg-white text-xs text-black resize-none focus:outline-none shadow-hard-sm focus:shadow-hard transition-all placeholder:text-gray-500 font-mono"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t-2 border-black bg-white space-y-3">
          <button
            onClick={handleExecute}
            disabled={!file || isLoading}
            className={`w-full py-4 px-4 font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all border-2 border-black shadow-hard
              ${!file || isLoading
                ? 'bg-gray-100 text-gray-600 cursor-not-allowed shadow-none border-gray-300'
                : 'bg-black text-[#CCFF00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:bg-[#CCFF00] active:text-black'
              }`}
          >
            {isLoading ? <Clock className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
            {isLoading ? 'Processing...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Bar / Metrics */}
        <div className="h-16 border-b-2 border-black bg-white flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-black text-white p-1.5 border border-black shadow-hard-sm">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-gray-700 leading-none mb-1">Latency</span>
                <span className={`font-mono font-bold leading-none ${result ? 'text-black' : 'text-gray-500'}`}>
                  {result ? `${result.latency.total}ms` : '--'}
                </span>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200 rotate-12"></div>
            <div className="flex items-center gap-3">
              <div className="bg-black text-white p-1.5 border border-black shadow-hard-sm">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-gray-700 leading-none mb-1">Tokens</span>
                <span className={`font-mono font-bold leading-none ${result ? 'text-black' : 'text-gray-500'}`}>
                  {result?.usage?.totalTokens || '--'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsAnalysisPopupOpen(true)}
              disabled={!result}
              className={`px-4 py-2 border-2 border-black font-bold uppercase text-xs flex items-center gap-2 transition-all shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
                ${!result ? 'bg-gray-100 text-gray-400 border-gray-300 shadow-none cursor-not-allowed' : 'bg-white text-black hover:bg-black hover:text-[#CCFF00]'}
              `}
            >
              <FileText className="w-4 h-4" /> Process Details
            </button>
            <div className="flex border-2 border-black bg-white shadow-hard-sm p-1 gap-1">
              {[
                { id: 'parsed', icon: Layout, label: 'Parsed' },
                { id: 'raw', icon: FileText, label: 'Raw' },
                { id: 'json', icon: Code, label: 'JSON' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold uppercase flex items-center gap-2 transition-all
                    ${activeTab === tab.id 
                      ? 'bg-black text-[#CCFF00]' 
                      : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={handleHydrate}
              disabled={!result?.parsed || hydrateStatus === 'loading' || hydrateStatus === 'success'}
              className={`px-6 py-2.5 border-2 border-black font-bold uppercase text-xs flex items-center gap-2 transition-all shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
                 ${hydrateStatus === 'success' ? 'bg-[#CCFF00] text-black' :
                  !result?.parsed ? 'bg-gray-100 text-gray-600 border-gray-300 shadow-none cursor-not-allowed' : 'bg-white text-black hover:bg-black hover:text-white'}
               `}
            >
              {hydrateStatus === 'loading' && <Clock className="w-4 h-4 animate-spin" />}
              {hydrateStatus === 'success' && <CheckCircle className="w-4 h-4" />}
              {hydrateStatus === 'error' && <AlertCircle className="w-4 h-4" />}
              {hydrateStatus === 'idle' && <Database className="w-4 h-4" />}
              {hydrateStatus === 'success' ? 'Hydrated' : 'Hydrate DB'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {!result && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 select-none">
              <div className="border-4 border-gray-200 p-8 rounded-full mb-6">
                <Cpu className="w-24 h-24" />
              </div>
              <p className="uppercase font-black tracking-widest text-xl">System Ready</p>
              <p className="font-mono text-sm mt-2">Waiting for input stream...</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-black">
              <div className="w-24 h-24 border-8 border-gray-200 border-t-black rounded-full animate-spin mb-8"></div>
              <p className="uppercase font-black tracking-widest text-xl animate-pulse">Processing Contract</p>
              <div className="mt-4 font-mono text-xs bg-[#CCFF00] px-2 py-1 border border-black shadow-hard-sm">
                ROUTER_CLASSIFICATION_IN_PROGRESS...
              </div>
            </div>
          )}

          {result && (
            <div className="max-w-6xl mx-auto pb-12">
              {activeTab === 'parsed' && renderParsedContent()}

              {activeTab === 'raw' && (
                <div className="bg-white p-8 border-2 border-black shadow-hard h-full overflow-y-auto relative">
                   <div className="absolute top-0 left-0 bg-[#CCFF00] text-black text-[10px] font-bold px-3 py-1 border-r-2 border-b-2 border-black uppercase">
                      Raw Text Extraction
                   </div>
                  <pre className="whitespace-pre-wrap text-xs text-gray-600 leading-relaxed font-mono mt-4">
                    {result.rawText}
                  </pre>
                </div>
              )}

              {activeTab === 'json' && (
                <div className="bg-[#1a1a1a] p-8 border-2 border-black shadow-hard h-full overflow-y-auto relative group">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    className="absolute top-4 right-4 p-2 bg-black text-[#CCFF00] border border-[#CCFF00] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#CCFF00] hover:text-black"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <pre className="text-xs text-[#CCFF00] font-mono">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
