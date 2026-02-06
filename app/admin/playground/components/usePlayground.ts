import { useState } from 'react';
import { hydrateContract } from '@/actions/hydrate-contract';
import { analyzeContractPlayground } from '@/actions/playground-analysis';
import { ContractAnalysis, ContractData } from '@/types/contract-analysis';

export interface AnalysisResult {
  rawText: string;
  parsed: ContractAnalysis | null;
  draft?: any; // Added draft
  classification?: any;
  usage: any;
  wasRepaired?: boolean; // Added flag
  modelReasoning?: string | null; // <think>...</think> content from reasoning models
  latency: { 
    extraction: number; 
    router?: number; 
    expert?: number; 
    expertExtraction?: number; // Added
    expertRepair?: number;     // Added
    total: number;
  };
}

export function usePlayground() {
  // Inputs
  const [file, setFile] = useState<File | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [model, setModel] = useState<string>('deepseek/deepseek-r1');
  const [temperature, setTemperature] = useState<number>(0);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'parsed' | 'raw' | 'json'>('parsed');
  const [hydrateStatus, setHydrateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isAnalysisPopupOpen, setIsAnalysisPopupOpen] = useState(false);
  const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; message: string; details?: string } | null>(null);

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
        setResult(res.data as AnalysisResult);
        setIsAnalysisPopupOpen(true);
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
      const res = await hydrateContract(result.parsed as ContractData, result.classification, result.rawText);
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

  const closeErrorPopup = () => {
    setErrorPopup(null);
  };

  return {
    file,
    setFile,
    systemPrompt,
    setSystemPrompt,
    model,
    setModel,
    temperature,
    setTemperature,
    isLoading,
    result,
    activeTab,
    setActiveTab,
    hydrateStatus,
    isAnalysisPopupOpen,
    setIsAnalysisPopupOpen,
    errorPopup,
    setErrorPopup,
    handleFileChange,
    handleExecute,
    handleHydrate,
    closeErrorPopup
  };
}
