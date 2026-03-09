import { useState } from 'react';
import {
  FileText,
  Search,
  PenLine,
  Save,
  Download,
  ChevronLeft,
  Eye,
  Check,
  Loader2,
  Terminal
} from 'lucide-react';
import { FilePreview } from '@/components/FilePreview';
import { getFileType } from '@/lib/file-config';
import { ContractAnalysis } from '@/types/contract-analysis';

import { EditorSidebar } from './components/EditorSidebar';

import { saveContract } from '@/app/actions/save-contract';
import { useRouter } from 'next/navigation';

interface EditorLayoutProps {
  children?: React.ReactNode;
  fileName: string;
  contractType: string;
  onBack: () => void;
  uploadedFile?: File | null;
  initialData?: ContractAnalysis | null;
  contractId?: string;
}

export function EditorLayout({ children, fileName, contractType, onBack, uploadedFile, initialData, contractId }: EditorLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isSaved, setIsSaved] = useState(!!contractId);
  const [isSaving, setIsSaving] = useState(false);
  const [savedContractId, setSavedContractId] = useState<string | undefined>(contractId);

  const [contractTitle, setContractTitle] = useState(initialData?.title || fileName.replace(/\.[^/.]+$/, ""));
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [conditions, setConditions] = useState(initialData?.conditions || "");
  const [comments, setComments] = useState(initialData?.comments || "");
  // Helper to split string into array
  const splitString = (val: string | null | undefined) => val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];

  const [contractOwner, setContractOwner] = useState<string[]>(splitString(initialData?.contractOwner));
  const [deputy, setDeputy] = useState<string[]>(splitString(initialData?.deputy));
  const [contractManager, setContractManager] = useState<string[]>(splitString(initialData?.contractManager));
  const [contractPartner, setContractPartner] = useState<string[]>(splitString(initialData?.contractPartner));
  const [status, setStatus] = useState<string>(initialData?.status || "Review");

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const formData = new FormData();

      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      const metadata = {
        ...initialData, // Include all analysis data as base
        title: contractTitle,
        contractType,
        contractOwner: contractOwner.length > 0 ? contractOwner.join(', ') : null,
        deputy: deputy.length > 0 ? deputy.join(', ') : null,
        contractManager: contractManager.length > 0 ? contractManager.join(', ') : null,
        contractPartner: contractPartner.length > 0 ? contractPartner.join(', ') : null,
        // Overwrite with current state
        summary: summary,
        conditions: conditions,
        comments: comments,
        status: status,
      };

      formData.append('metadata', JSON.stringify(metadata));

      // If we had editable content text, we would append it here
      // formData.append('content', content);

      if (savedContractId) {
        formData.append('contractId', savedContractId);
      }

      const result = await saveContract(formData);

      if (result.success) {
        setIsSaved(true);
        if (result.contractId) {
          setSavedContractId(result.contractId);
        }
      } else {
        console.error('Save failed:', result.error);
        alert('Failed to save contract: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  // Check if preview is available
  const fileType = uploadedFile ? getFileType(uploadedFile) : 'unknown';
  const hasPreview = fileType !== 'unknown';

  // Workflow steps (same order as reference: Draft → Review → Active → Completed → Archived)
  const workflowSteps = [
    { id: 'draft', label: 'Draft' },
    { id: 'review', label: 'Review' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'archived', label: 'Archived' },
  ];
  const statusToStepId: Record<string, string> = {
    Draft: 'draft',
    Review: 'review',
    Active: 'active',
    Signed: 'completed',
    Expired: 'completed',
    Completed: 'completed',
    Archived: 'archived',
  };
  const currentStepId = statusToStepId[status] || 'review';

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -m-6 md:-m-8 font-mono">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-black transition-colors p-1"
            >
              <div className="flex items-center justify-center">
                <span className="sr-only">Back</span>
                <ChevronLeft className="w-5 h-5" />
              </div>
            </button>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {isSaved ? `Contracts / ${initialData?.externalReference || 'ID:10023'} / ${initialData?.title || fileName.replace(/\.[^/.]+$/, "")}` : `System / New Contract / ${contractTitle.trim() || 'Draft'}`}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSaved && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-black text-white text-sm font-bold uppercase hover:bg-[#CCFF00] hover:text-black transition-all shadow-sm rounded-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Record
                  </>
                )}
              </button>
            )}
            {isSaved && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-black text-white text-xs font-bold uppercase hover:bg-[#CCFF00] hover:text-black transition-all shadow-sm rounded-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update
                    </>
                  )}
                </button>
                <button className="px-3 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold uppercase hover:bg-gray-50 hover:text-black transition-colors rounded-sm shadow-sm">
                  Actions
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between gap-8">
          <div className="min-w-0 flex-1">
            {isSaved ? (
              <h1 className="text-xl font-bold text-black flex items-center gap-2 uppercase min-w-0" title={contractTitle || initialData?.title || fileName.replace(/\.[^/.]+$/, "")}>
                <span className="truncate min-w-0" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contractTitle.trim() || initialData?.title || fileName.replace(/\.[^/.]+$/, "")}</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-widest rounded-sm shrink-0">{status}</span>
              </h1>
            ) : (
              <h1 className="text-xl font-bold text-black flex items-center gap-2 uppercase min-w-0" title={contractTitle || 'New Contract'}>
                <span className="truncate min-w-0" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contractTitle.trim() || 'New Contract'}</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-sm shrink-0">Draft Mode</span>
              </h1>
            )}
          </div>

          {isSaved && (
            <div className="flex items-center pb-1 shrink-0">
              {/* Workflow Steps - Stepper (Draft → Review → Active → Completed → Archived) */}
              <div className="flex items-center gap-1">
                {workflowSteps.map((step, index, array) => {
                  const currentIndex = workflowSteps.findIndex(s => s.id === currentStepId);
                  const stepStatus = step.id === currentStepId ? 'current' : currentIndex > index ? 'completed' : 'upcoming';
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`px-3 py-1 text-xs font-bold uppercase rounded-sm transition-colors ${stepStatus === 'current' ? 'bg-[#CCFF00] text-black' : stepStatus === 'completed' ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </div>
                      {index < array.length - 1 && (
                        <div className="w-4 h-px bg-gray-200 mx-1"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-white relative">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none z-0"></div>

        {/* Left Sidebar - Metadata Form */}
        <div className="relative z-10 h-full border-r border-gray-200 bg-white">
          <EditorSidebar
            isOpen={sidebarOpen}
            isSaved={isSaved}
            initialData={initialData}
            fileName={fileName}
            contractType={contractType}
            contractTitle={contractTitle}
            setContractTitle={setContractTitle}
            contractPartner={contractPartner}
            setContractPartner={setContractPartner}
            contractOwner={contractOwner}
            setContractOwner={setContractOwner}
            deputy={deputy}
            setDeputy={setDeputy}
            contractManager={contractManager}
            setContractManager={setContractManager}
            summary={summary}
            setSummary={setSummary}
            conditions={conditions}
            setConditions={setConditions}
            comments={comments}
            setComments={setComments}
            status={status}
            setStatus={setStatus}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 px-6 pt-2 flex items-center gap-1">
            <button
              className="px-4 py-2 text-xs font-bold uppercase border-b-2 border-[#CCFF00] text-black"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3" />
                Document Source
              </div>
            </button>
            <button
              className="px-4 py-2 text-xs font-bold uppercase border-b-2 border-transparent text-gray-400 hover:text-black transition-colors"
            >
              Versions
            </button>
          </div>

          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-sm">FILE</div>
              <h2 className="text-xs font-bold text-gray-700 uppercase truncate max-w-md">{fileName}</h2>
              <div className="flex gap-1 border-l border-gray-200 pl-2 ml-2">
                <button className="p-1 hover:bg-gray-100 text-gray-400 hover:text-black transition-colors rounded-sm"><Download className="w-3 h-3" /></button>
                <button className="p-1 hover:bg-gray-100 text-gray-400 hover:text-black transition-colors rounded-sm"><PenLine className="w-3 h-3" /></button>
              </div>
            </div>
          </div>

          {/* Document Content - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className={`bg-white border border-gray-200 shadow-sm relative ${hasPreview && uploadedFile
                ? 'w-full h-full border border-gray-200'
                : 'max-w-4xl mx-auto min-h-[800px] p-8 md:p-12'
              }`}>
              {hasPreview && uploadedFile ? (
                <div className="absolute inset-0 z-0 bg-white">
                  <FilePreview file={uploadedFile} className="h-full w-full" />
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
