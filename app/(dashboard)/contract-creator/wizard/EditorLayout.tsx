import { useState } from 'react';
import { 
  FileText, 
  Search,
  PenLine,
  Save,
  Download,
  ChevronLeft,
  Bug
} from 'lucide-react';
import { FilePreview } from '@/components/FilePreview';
import { getFileType } from '@/lib/file-config';
import { ContractAnalysis } from '@/types/contract-analysis';
import { DebugOverlay } from './DebugOverlay';

import { EditorSidebar } from './components/EditorSidebar';

interface EditorLayoutProps {
  children?: React.ReactNode;
  fileName: string;
  contractType: string;
  onBack: () => void;
  uploadedFile?: File | null;
  initialData?: ContractAnalysis | null;
}

export function EditorLayout({ children, fileName, contractType, onBack, uploadedFile, initialData }: EditorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [conditions, setConditions] = useState(initialData?.conditions || "");
  const [comments, setComments] = useState(initialData?.comments || "");
  const [contractOwner, setContractOwner] = useState<string[]>(initialData?.contractOwner ? [initialData.contractOwner] : []);
  const [deputy, setDeputy] = useState<string[]>(initialData?.deputy ? [initialData.deputy] : []);
  const [contractManager, setContractManager] = useState<string[]>(initialData?.contractManager ? [initialData.contractManager] : []);

  const [showDebug, setShowDebug] = useState(false);
  const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === 'true';

  // Check if preview is available
  const fileType = uploadedFile ? getFileType(uploadedFile) : 'unknown';
  const hasPreview = fileType !== 'unknown';

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] -m-6 md:-m-8">
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
             className="text-gray-400 hover:text-gray-600 transition-colors"
           >
             <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
               <span className="sr-only">Back</span>
               <ChevronLeft className="w-5 h-5" />
             </div>
           </button>
           <div>
             <div className="text-xs text-gray-500 mb-1">Contracts / New Contract Folder</div>
             <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
               New Contract
               <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full font-normal">Draft</span>
             </h1>
           </div>
        </div>

        <div className="flex items-center gap-3">
          {isDebugMode && (
            <button 
              onClick={() => setShowDebug(true)}
              className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-lg transition-colors"
              title="Debug AI Response"
            >
              <Bug className="w-5 h-5" />
            </button>
          )}
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Search className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-gray-50">
        {/* Left Sidebar - Metadata Form */}
        <EditorSidebar 
          isOpen={sidebarOpen}
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
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
           {/* Tabs */}
           <div className="bg-white border-b border-gray-200 px-6 pt-2 flex items-center gap-6">
              <button 
                className="pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 border-blue-600 text-blue-600"
              >
                <FileText className="w-4 h-4" />
                Documents
              </button>
           </div>

           {/* Toolbar */}
           <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <h2 className="text-sm font-medium text-gray-900 truncate max-w-md">{fileName}</h2>
                 <div className="flex gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600"><Download className="w-4 h-4" /></button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600"><PenLine className="w-4 h-4" /></button>
                 </div>
              </div>
           </div>

           {/* Document Content - Scrollable */}
           <div className="flex-1 overflow-y-auto bg-gray-50/50">
             <div className={`bg-white shadow-sm border border-gray-200 relative ${
               hasPreview && uploadedFile 
                 ? 'w-full h-full border-0' 
                 : 'max-w-4xl mx-auto min-h-[800px] p-8 md:p-12'
             }`}>
               {hasPreview && uploadedFile ? (
                 <div className="absolute inset-0 z-0">
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
