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
      <div className="bg-white border-b border-black px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-black hover:bg-[#CCFF00] transition-colors border border-black p-1 shadow-hard-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
          >
            <div className="flex items-center justify-center">
              <span className="sr-only">Back</span>
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>
          <div className="min-w-0">
             <div className="text-[10px] font-bold text-gray-500 mb-1 truncate uppercase tracking-wider max-w-[400px]">
               {isSaved ? `Contracts / ID:10023 / ${initialData?.title || fileName.replace(/\.[^/.]+$/, "")}` : 'System / New Contract / Draft'}
             </div>
            {isSaved ? (
              <div className="flex items-center gap-4">
             <h1 className="text-xl font-black text-black uppercase block truncate max-w-[400px]" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={initialData?.title || fileName.replace(/\.[^/.]+$/, "")}>
                   {initialData?.title || fileName.replace(/\.[^/.]+$/, "")}
                 </h1>
              </div>
            ) : (
              <h1 className="text-xl font-black text-black flex items-center gap-2 uppercase">
                New Contract
                <span className="px-2 py-0.5 bg-black text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest border border-black">Draft Mode</span>
              </h1>
            )}
          </div>
        </div>

        {isSaved && (
          <div className="flex items-center">
            {/* Workflow Steps - Stepper Style */}
            <div className="flex items-center gap-2">
              {[
                { id: 'draft', label: 'Draft', status: 'completed' },
                { id: 'review', label: 'Review', status: 'current' },
                { id: 'active', label: 'Active', status: 'upcoming' },
                { id: 'completed', label: 'Completed', status: 'upcoming' },
              ].map((step, index, array) => (
                <div key={step.id} className="flex items-center">
                  <div className={`px-3 py-1 border text-xs font-bold uppercase ${step.status === 'current' ? 'bg-[#CCFF00] text-black border-black shadow-hard-sm' :
                      step.status === 'completed' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'
                    }`}>
                    {step.label}
                  </div>
                  {index < array.length - 1 && (
                    <div className="w-4 h-px bg-black mx-1"></div>
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
              className="p-2 text-black hover:bg-[#CCFF00] border border-black transition-colors shadow-hard-sm"
              title="Debug AI Response"
            >
              <Bug className="w-4 h-4" />
            </button>
          )}

          {!isSaved && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-black text-white text-sm font-bold uppercase border-2 border-black hover:bg-[#CCFF00] hover:text-black transition-all shadow-hard flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
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
              <button className="px-4 py-2 bg-black text-white text-xs font-bold uppercase border-2 border-black hover:bg-[#CCFF00] hover:text-black transition-all shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center gap-2">
                <Save className="w-4 h-4" />
                Update
              </button>
              <button className="px-3 py-2 bg-white border-2 border-black text-black text-xs font-bold uppercase hover:bg-gray-50 transition-colors shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none">
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
        <div className="relative z-10 h-full border-r border-black bg-white">
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
          <div className="bg-white border-b border-black px-6 pt-2 flex items-center gap-1">
            <button
              className="px-4 py-2 text-xs font-bold uppercase border-t-2 border-l-2 border-r-2 border-black bg-[#CCFF00] text-black translate-y-[1px]"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3" />
                Document Source
              </div>
            </button>
            <button
              className="px-4 py-2 text-xs font-bold uppercase border-t-2 border-l-2 border-r-2 border-transparent text-gray-500 hover:text-black hover:border-black/20"
            >
              Versions
            </button>
          </div>

          {/* Toolbar */}
          <div className="bg-white border-b border-black px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 bg-black text-white text-[10px] font-bold uppercase">FILE</div>
              <h2 className="text-xs font-bold text-black uppercase truncate max-w-md">{fileName}</h2>
              <div className="flex gap-1 border-l border-black pl-2 ml-2">
                <button className="p-1 hover:bg-[#CCFF00] border border-transparent hover:border-black transition-colors"><Download className="w-3 h-3 text-black" /></button>
                <button className="p-1 hover:bg-[#CCFF00] border border-transparent hover:border-black transition-colors"><PenLine className="w-3 h-3 text-black" /></button>
              </div>
            </div>
          </div>

          {/* Document Content - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className={`bg-white border-2 border-black shadow-hard relative ${hasPreview && uploadedFile
                ? 'w-full h-full border-2 border-black'
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
