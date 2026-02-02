'use client';

import { ContractAnalysis } from '@/types/contract-analysis';
import { useState } from 'react';
import { AnalysisStep } from './wizard/AnalysisStep';
import { EditorLayout } from './wizard/EditorLayout';
import { TypeSelectionStep } from './wizard/TypeSelectionStep';
import { UploadStep } from './wizard/UploadStep';

type WizardStep = 'upload' | 'analyzing' | 'type-selection' | 'editor';

export default function ContractCreator() {

  // Wizard State
  const [step, setStep] = useState<WizardStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysis | null>(null);

  // Wizard Handlers
  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setStep('analyzing');
    // Reset previous analysis
    setAnalysisResult(null);
  };

  const handleAnalysisComplete = (data: ContractAnalysis) => {
    setAnalysisResult(data);
    setStep('type-selection');
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setStep('editor');
    // Here we could load a template based on the type
  };

  const handleBackToDashboard = () => {
    // Navigate back or reset
    if (confirm('Are you sure you want to cancel the process?')) {
      setStep('upload');
      setUploadedFile(null);
      setSelectedType('');
    }
  };

  // Render Logic
  if (step === 'upload') {
    return <UploadStep onFileSelect={handleFileSelect} />;
  }

  if (step === 'analyzing' && uploadedFile) {
    return (
      <AnalysisStep
        file={uploadedFile}
        onComplete={handleAnalysisComplete}
        onCancel={() => setStep('upload')}
      />
    );
  }

  if (step === 'type-selection') {
    return (
      <TypeSelectionStep
        onSelect={handleTypeSelect}
        onBack={() => setStep('analyzing')}
        suggestedType={analysisResult?.contractType}
      />
    );
  }

  return (
    <EditorLayout
      fileName={uploadedFile?.name || 'New Contract'}
      contractType={selectedType}
      onBack={handleBackToDashboard}
      uploadedFile={uploadedFile}
      initialData={analysisResult}
    />
  );
}
