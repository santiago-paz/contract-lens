import { useState } from 'react';
import {
  FileText,
  Search,
  PenLine,
  Save,
  Download,
  ChevronLeft,
  Bug,
  Eye,
  Check,
  Loader2,
  Terminal
} from 'lucide-react';
import { FilePreview } from '@/components/FilePreview';
import { getFileType } from '@/lib/file-config';
import { ContractAnalysis } from '@/types/contract-analysis';
import { DebugOverlay } from './DebugOverlay';

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

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [summary, setSummary] = useState(initialData?.summary || "");
  const [conditions, setConditions] = useState(initialData?.conditions || "");
  const [comments, setComments] = useState(initialData?.comments || "");
  const [contractOwner, setContractOwner] = useState<string[]>(initialData?.contractOwner ? [initialData.contractOwner] : []);
  const [deputy, setDeputy] = useState<string[]>(initialData?.deputy ? [initialData.deputy] : []);
  const [contractManager, setContractManager] = useState<string[]>(initialData?.contractManager ? [initialData.contractManager] : []);
  const [status, setStatus] = useState<string>(initialData?.status || "Review");

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const formData = new FormData();

      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      const metadata = {
        title: fileName,
        contractType,
        contractOwner: contractOwner[0] || null,
        deputy: deputy[0] || null,
        contractManager: contractManager[0] || null,
        ...initialData, // Include other initial analysis data
        // Overwrite with current state
        summary: summary,
        conditions: conditions,
        comments: comments,
        status: status, // Ensure status is spread last
      };

      formData.append('metadata', JSON.stringify(metadata));

      // If we had editable content text, we would append it here
      // formData.append('content', content);

      if (contractId) {
        formData.append('contractId', contractId);
      }

      const result = await saveContract(formData);

      if (result.success) {
        setIsSaved(true);
        // Optional: Redirect or show success
        // router.push('/dashboard/contracts');
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

  const [showDebug, setShowDebug] = useState(false);
  const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === 'true';

  // Check if preview is available
  const fileType = uploadedFile ? getFileType(uploadedFile) : 'unknown';
  const hasPreview = fileType !== 'unknown';

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -m-6 md:-m-8 font-mono">
      <DebugOverlay
        isOpen={showDebug}
        onClose={() => setShowDebug(false)}
        data={initialData}
        context="EditorLayout - Initial Data"
      />

      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
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
          <div className="min-w-0">
             <div className="text-[10px] font-bold text-gray-400 mb-1 truncate uppercase tracking-wider max-w-[400px]">
               {isSaved ? `Contracts / ${initialData?.externalReference || 'ID:10023'} / ${initialData?.title || fileName.replace(/\.[^/.]+$/, "")}` : 'System / New Contract / Draft'}
             </div>
            {isSaved ? (
              <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold text-black uppercase block truncate max-w-[400px]" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={initialData?.title || fileName.replace(/\.[^/.]+$/, "")}>
                   {initialData?.title || fileName.replace(/\.[^/.]+$/, "")}
                 </h1>
              </div>
            ) : (
              <h1 className="text-xl font-bold text-black flex items-center gap-2 uppercase">
                New Contract
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-sm">Draft Mode</span>
              </h1>
            )}
          </div>
        </div>

        {isSaved && (
          <div className="flex items-center">
            {/* Workflow Steps - Stepper Style */}
            <div className="flex items-center gap-1">
              {[
                { id: 'draft', label: 'Draft', status: 'completed' },
                { id: 'review', label: 'Review', status: 'current' },
                { id: 'active', label: 'Active', status: 'upcoming' },
                { id: 'completed', label: 'Completed', status: 'upcoming' },
              ].map((step, index, array) => (
                <div key={step.id} className="flex items-center">
                  <div className={`px-3 py-1 text-xs font-bold uppercase rounded-sm transition-colors ${step.status === 'current' ? 'bg-[#CCFF00] text-black' :
                      step.status === 'completed' ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                    {step.label}
                  </div>
                  {index < array.length - 1 && (
                    <div className="w-4 h-px bg-gray-200 mx-1"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {isDebugMode && (
            <button
              onClick={() => setShowDebug(true)}
              className="p-2 text-gray-400 hover:text-black transition-colors"
              title="Debug AI Response"
            >
              <Bug className="w-4 h-4" />
            </button>
          )}

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
              <button className="px-4 py-2 bg-black text-white text-xs font-bold uppercase hover:bg-[#CCFF00] hover:text-black transition-all shadow-sm rounded-sm flex items-center gap-2">
                <Save className="w-4 h-4" />
                Update
              </button>
              <button className="px-3 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold uppercase hover:bg-gray-50 hover:text-black transition-colors rounded-sm shadow-sm">
                Actions
              </button>
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
