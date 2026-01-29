import { useState, useEffect } from 'react';
import { Check, FileText, Loader2, AlertCircle, Bug, Terminal } from 'lucide-react';
import { analyzeContract } from '@/app/actions';
import { ContractAnalysis } from '@/types/contract-analysis';
import { DebugOverlay } from './DebugOverlay';

interface AnalysisStepProps {
  file: File;
  onComplete: (data: ContractAnalysis) => void;
  onCancel: () => void;
}

export function AnalysisStep({ file, onComplete, onCancel }: AnalysisStepProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Debug related state
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysis | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === 'true';

  const steps = [
    { id: 'document', label: 'Document Structure', description: 'Parsing header, body, footer blocks' },
    { id: 'partner', label: 'Entity Detection', description: 'Identifying counter-parties' },
    { id: 'dates', label: 'Temporal Analysis', description: 'Extracting key dates & deadlines' },
    { id: 'metadata', label: 'Metadata Extraction', description: 'Classifying contract attributes' },
    { id: 'finish', label: 'Finalizing', description: 'Compiling results object' },
  ];

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;

    const runAnalysis = async () => {
      try {
        // Start showing progress simulation for UX while waiting
        let currentStepIndex = 0;
        
        interval = setInterval(() => {
          if (mounted && currentStepIndex < steps.length - 1) {
            const stepId = steps[currentStepIndex].id;
            setCompletedSteps(prev => {
                if (!prev.includes(stepId)) {
                    return [...prev, stepId];
                }
                return prev;
            });
            currentStepIndex++;
          }
        }, 1000);

        const formData = new FormData();
        formData.append('file', file);
        
        const result = await analyzeContract(formData);
        
        if (mounted) {
          clearInterval(interval);
          // Mark all steps as completed immediately upon success
          setCompletedSteps(steps.map(s => s.id));
          
          // Wait a bit to show 100% completion before moving on
          setTimeout(() => {
            if (mounted) {
                onComplete(result);
            }
          }, 800);
        }
        
      } catch (err) {
        console.error(err);
        if (mounted) {
            clearInterval(interval);
            setError('Failed to analyze contract. Please try again or skip.');
        }
      }
    };

    runAnalysis();

    return () => {
        mounted = false;
        clearInterval(interval);
    };
  }, [file]);

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
                <h3 className="text-lg font-bold text-black uppercase mb-2">Process Terminated</h3>
                <p className="text-gray-600 mb-8 uppercase text-sm">{error}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={onCancel} className="px-6 py-3 border-2 border-black bg-white hover:bg-black hover:text-white uppercase font-bold text-sm transition-colors">
                        Abort
                    </button>
                    {/* Fallback to manual entry if AI fails */}
                    <button 
                        onClick={() => {
                             // Create dummy empty analysis to proceed
                            onComplete({
                              contractType: 'General Terms and Conditions',
                              title: file.name.replace(/\.[^/.]+$/, ""),
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
                              comments: null
                            });
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
                <span className="text-[10px] font-bold uppercase text-gray-500 block mb-2">Target File</span>
                <div className="p-4 bg-white border-2 border-black shadow-hard-sm">
                    <FileText className="w-8 h-8 text-black mb-2" />
                    <h3 className="font-bold text-black text-xs uppercase line-clamp-2 leading-tight break-all">{file.name}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
            </div>
            
            <div className="mt-auto">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold uppercase text-black">Processing...</span>
                </div>
                <button 
                    onClick={onCancel}
                    className="text-xs font-bold text-red-600 hover:text-red-700 uppercase hover:underline"
                >
                    Abort Operation
                </button>
            </div>
        </div>

        {/* Right: Analysis Steps */}
        <div className="w-2/3 p-0 bg-black text-[#CCFF00] font-mono relative overflow-hidden">
            {/* CRT Effect Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
            
            <div className="p-8 relative z-20 h-full flex flex-col">
                <div className="border-b border-[#CCFF00]/30 pb-4 mb-6 flex justify-between items-end">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Analysis Protocol v2.4</h3>
                    <span className="text-[10px] opacity-70">PID: {Math.floor(Math.random() * 99999)}</span>
                </div>
                
                <div className="space-y-6 flex-1">
                    {steps.map((step, index) => {
                        const isCompleted = completedSteps.includes(step.id);
                        const isNext = !isCompleted && (index === 0 || completedSteps.includes(steps[index-1].id));
                        
                        return (
                            <div key={step.id} className="flex items-start gap-4 group">
                                <div className="w-4 flex justify-center mt-1">
                                    {isCompleted ? (
                                        <span className="text-[#CCFF00] font-bold">OK</span>
                                    ) : isNext ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-[#CCFF00]" />
                                    ) : (
                                        <span className="text-gray-600">..</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-baseline">
                                        <h4 className={`text-sm font-bold uppercase tracking-wide ${isCompleted || isNext ? 'text-white' : 'text-gray-600'}`}>
                                            {step.label}
                                        </h4>
                                        {(isCompleted || isNext) && (
                                            <span className="text-[10px] text-[#CCFF00] opacity-50 uppercase">
                                                {isCompleted ? 'Done' : 'Running'}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs mt-1 uppercase ${isCompleted || isNext ? 'text-[#CCFF00]/70' : 'text-gray-700'}`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-4 border-t border-[#CCFF00]/30 text-[10px] text-[#CCFF00]/50 uppercase flex justify-between">
                    <span>Mem: 4096KB OK</span>
                    <span>Core: Active</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
