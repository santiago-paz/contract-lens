import { useCallback, useRef, useState } from 'react';
import { hydrateContract } from '@/actions/hydrate-contract';
import { ContractAnalysis, ContractData } from '@/types/contract-analysis';

export interface AnalysisResult {
  rawText: string;
  parsed: ContractAnalysis | null;
  draft?: any;
  classification?: any;
  usage: any;
  wasRepaired?: boolean;
  modelReasoning?: string | null;
  latency: {
    extraction: number;
    router?: number;
    expert?: number;
    expertExtraction?: number;
    expertRepair?: number;
    total: number;
  };
}

export type StreamPhase =
  | 'idle'
  | 'extracting'
  | 'classifying'
  | 'analyzing'
  | 'done'
  | 'error';

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

  // Streaming state
  const [streamPhase, setStreamPhase] = useState<StreamPhase>('idle');
  const [streamMessage, setStreamMessage] = useState<string>('');
  const [reasoning, setReasoning] = useState<string>('');
  const [classification, setClassification] = useState<string | null>(null);

  // Ref for accumulating reasoning (avoids stale closure issues)
  const reasoningRef = useRef('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setHydrateStatus('idle');
      setStreamPhase('idle');
      setReasoning('');
      setClassification(null);
    }
  };

  const handleExecute = useCallback(async () => {
    if (!file) return;

    // Reset state
    setIsLoading(true);
    setResult(null);
    setHydrateStatus('idle');
    setStreamPhase('extracting');
    setStreamMessage('Reading document…');
    setReasoning('');
    setClassification(null);
    reasoningRef.current = '';

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('systemPrompt', systemPrompt);
      formData.append('model', model);
      formData.append('temperature', temperature.toString());

      const response = await fetch('/api/playground-stream', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines (NDJSON)
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;

          let event: any;
          try {
            event = JSON.parse(line);
          } catch {
            console.warn('Failed to parse stream event:', line);
            continue;
          }

          switch (event.type) {
            case 'status':
              setStreamPhase(event.phase || 'extracting');
              setStreamMessage(event.message || '');
              break;

            case 'classification':
              setClassification(event.result);
              setStreamMessage(`Contract type: ${event.result}`);
              break;

            case 'reasoning':
              reasoningRef.current += event.text;
              setReasoning(reasoningRef.current);
              break;

            case 'result':
              if (event.success && event.data) {
                setResult(event.data as AnalysisResult);
                setStreamPhase('done');
                setIsAnalysisPopupOpen(true);
              } else {
                setStreamPhase('error');
                setErrorPopup({
                  isOpen: true,
                  message: 'Analysis failed: ' + (event.error || 'Unknown error'),
                });
              }
              break;

            case 'error':
              setStreamPhase('error');
              setErrorPopup({
                isOpen: true,
                message: event.message || 'Unknown error',
              });
              break;
          }
        }
      }
    } catch (err) {
      console.error(err);
      setStreamPhase('error');
      setErrorPopup({
        isOpen: true,
        message: 'An unexpected error occurred.',
        details: JSON.stringify(err, Object.getOwnPropertyNames(err as Error), 2),
      });
    } finally {
      setIsLoading(false);
    }
  }, [file, systemPrompt, model, temperature]);

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
    closeErrorPopup,
    // Streaming state
    streamPhase,
    streamMessage,
    reasoning,
    classification,
  };
}
