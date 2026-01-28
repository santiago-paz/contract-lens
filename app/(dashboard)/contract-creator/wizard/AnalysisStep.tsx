import { useState, useEffect } from 'react';
import { Check, FileText, Loader2, AlertCircle, Bug } from 'lucide-react';
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
    { id: 'document', label: 'Document', description: 'Analyzing contract document structures' },
    { id: 'partner', label: 'Partner', description: 'Searching for contract partners' },
    { id: 'dates', label: 'Dates & Deadlines', description: 'Preparing relevant dates & deadlines' },
    { id: 'metadata', label: 'Metadata', description: 'Searching for additional contract-relevant data' },
    { id: 'finish', label: 'Finishing', description: 'Preparing final details' },
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
        <div className="w-full max-w-5xl mx-auto animate-fade-in">
             <DebugOverlay 
               isOpen={showDebug} 
               onClose={() => setShowDebug(false)} 
               error={error}
               context="AnalysisStep - Error"
             />
             
             <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                </div>
                New Contract
                </h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Failed</h3>
                <p className="text-gray-500 mb-8">{error}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                        Cancel
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Continue Manually
                    </button>
                    
                    {isDebugMode && (
                      <button 
                        onClick={() => setShowDebug(true)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                      >
                        <Bug className="w-4 h-4" />
                        Debug Error
                      </button>
                    )}
                </div>
            </div>
        </div>
    );
  }


  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          New Contract
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 min-h-[500px] flex">
        {/* Left: Uploaded File Info */}
        <div className="w-1/2 pr-12 border-r border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-red-50 rounded-xl flex items-center justify-center mb-4 relative group">
                <FileText className="w-10 h-10 text-red-500" />
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                    <Check className="w-3 h-3" />
                </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 max-w-[250px]">{file.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Main Contract Document</p>
            <div className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded mb-8">
                Data extractable
            </div>
            
            <button 
                onClick={onCancel}
                className="text-sm text-gray-500 hover:text-gray-900 underline"
            >
                Cancel
            </button>
        </div>

        {/* Right: Analysis Steps */}
        <div className="w-1/2 pl-12 flex flex-col justify-center">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">AI is analyzing your contract...</h3>
            </div>
            
            <div className="space-y-6">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    // Next is the one immediately after the last completed one, or the first one if none completed
                    const isNext = !isCompleted && (index === 0 || completedSteps.includes(steps[index-1].id));
                    
                    return (
                        <div key={step.id} className="flex items-start gap-4">
                            <div className={`
                                w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                                ${isCompleted ? 'bg-green-500 text-white' : isNext ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-300'}
                                transition-colors duration-500
                            `}>
                                {isCompleted ? (
                                    <Check className="w-3.5 h-3.5" />
                                ) : isNext ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-current" />
                                )}
                            </div>
                            <div>
                                <h4 className={`text-sm font-medium ${isCompleted || isNext ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.label}
                                </h4>
                                <p className={`text-xs ${isCompleted || isNext ? 'text-gray-500' : 'text-gray-300'}`}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}
