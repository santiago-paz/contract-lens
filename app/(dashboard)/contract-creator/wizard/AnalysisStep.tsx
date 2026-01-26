import { useState, useEffect } from 'react';
import { Check, FileText, Loader2, ArrowRight } from 'lucide-react';

interface AnalysisStepProps {
  fileName: string;
  onComplete: () => void;
  onCancel: () => void;
}

export function AnalysisStep({ fileName, onComplete, onCancel }: AnalysisStepProps) {
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  const steps = [
    { id: 'document', label: 'Document', description: 'Analyzing contract document structures' },
    { id: 'partner', label: 'Partner', description: 'Searching for contract partners' },
    { id: 'dates', label: 'Dates & Deadlines', description: 'Preparing relevant dates & deadlines' },
    { id: 'metadata', label: 'Metadata', description: 'Searching for additional contract-relevant data' },
    { id: 'finish', label: 'Finishing', description: 'Preparing final details' },
  ];

  useEffect(() => {
    // Simulate analysis progress
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800); // Slight delay before finishing
        return;
      }
      
      const stepId = steps[currentStep].id;
      setCompletedSteps(prev => [...prev, stepId]);
      currentStep++;
    }, 1200); // 1.2s per step

    return () => clearInterval(interval);
  }, [onComplete]);

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
            
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 max-w-[250px]">{fileName}</h3>
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
                <h3 className="text-lg font-semibold text-gray-900">We have highlighted the most likely contract types for you.</h3>
            </div>
            
            <div className="space-y-6">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
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
