import { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Shield, 
  ChevronDown, 
  Search,
  PenLine,
  Save,
  Download,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Plus
} from 'lucide-react';
import { FilePreview } from '@/components/FilePreview';
import RichEditor from '@/components/RichEditor';
import { getFileType } from '@/lib/file-config';
import { ContractAnalysis } from '@/types/contract-analysis';
import { CONTRACT_TYPES } from '@/lib/constants';

interface EditorLayoutProps {
  children: React.ReactNode;
  fileName: string;
  contractType: string;
  onBack: () => void;
  uploadedFile?: File | null;
  initialData?: ContractAnalysis | null;
}

export function EditorLayout({ children, fileName, contractType, onBack, uploadedFile, initialData }: EditorLayoutProps) {
  const [activeTab, setActiveTab] = useState('documents');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [conditions, setConditions] = useState(initialData?.conditions || "");
  const [comments, setComments] = useState(initialData?.comments || "");

  // Check if preview is available
  const fileType = uploadedFile ? getFileType(uploadedFile) : 'unknown';
  const hasPreview = fileType !== 'unknown';

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] -m-6 md:-m-8">
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
        <div className={`w-96 bg-white border-r border-gray-200 flex flex-col overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-10 h-full'}`}>
           <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm">Data</button>
                 <button className="px-3 py-1.5 text-gray-500 text-sm hover:bg-gray-50 rounded-lg">Spo...</button>
              </div>
              <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg">
                <Search className="w-4 h-4" />
              </button>
           </div>

           <div className="p-4 space-y-6">
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
                 <div className="mt-0.5 text-green-600">
                   <div className="w-5 h-5 rounded-full border-2 border-green-600 flex items-center justify-center">
                     <span className="text-[10px] font-bold">✓</span>
                   </div>
                 </div>
                 <div className="text-sm text-green-800">
                   The contract document has been analyzed, and marked fields have been pre-filled.
                 </div>
              </div>

              {/* Section: Allgemeine Angaben */}
              <div>
                <button className="flex items-center gap-2 w-full text-left font-medium text-gray-700 mb-4">
                  <FileText className="w-4 h-4" />
                  General Information
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </button>
                
                  <div className="space-y-4 pl-1">
                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
                     <input 
                       type="text" 
                       defaultValue={initialData?.title || fileName.replace(/\.[^/.]+$/, "")}
                       className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Contract Owner *</label>
                     <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {initialData?.contractOwner || ''} <button className="hover:text-blue-900">×</button>
                        </span>
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Deputy</label>
                     <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {initialData?.deputy || ''} <button className="hover:text-blue-900">×</button>
                        </span>
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Contract Manager *</label>
                     <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {initialData?.contractManager || ''} <button className="hover:text-blue-900">×</button>
                        </span>
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">External Reference</label>
                     <input 
                       type="text" 
                       defaultValue={initialData?.externalReference || ""}
                       className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 outline-none"
                     />
                   </div>

                    <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Contract Category</label>
                     <div className="relative">
                       <select 
                         className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none appearance-none pr-8"
                         defaultValue={contractType || ''}
                       >
                          {CONTRACT_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                          ))}
                       </select>
                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Organizational Units *</label>
                     <div className="relative">
                       <select 
                         className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none appearance-none pr-8"
                         defaultValue={initialData?.organizationalUnit || ""}
                       >
                          <option value="">Select...</option>
                          {initialData?.organizationalUnit && <option value={initialData.organizationalUnit}>{initialData.organizationalUnit}</option>}
                       </select>
                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Contract Value</label>
                     <div className="relative">
                       <select 
                         className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none appearance-none pr-8"
                         defaultValue={initialData?.contractValue || ""}
                       >
                          <option value="">Select...</option>
                          {initialData?.contractValue && <option value={initialData.contractValue}>{initialData.contractValue}</option>}
                       </select>
                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Confidentiality</label>
                     <div className="relative">
                       <select 
                         className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none appearance-none pr-8"
                         defaultValue={initialData?.confidentiality || ""}
                       >
                          <option value="">Select...</option>
                          {initialData?.confidentiality && <option value={initialData.confidentiality}>{initialData.confidentiality}</option>}
                       </select>
                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Contract Partner</label>
                     <div className="relative mb-2">
                       <select 
                         className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none appearance-none pr-8"
                            defaultValue={initialData?.contractPartner || ""}
                       >
                          <option value="">Select...</option>
                          {initialData?.contractPartner && <option value={initialData.contractPartner}>{initialData.contractPartner}</option>}
                       </select>
                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                     </div>
                     <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                       <Plus className="w-4 h-4" />
                       New Partner
                     </button>
                   </div>

                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Contract Summary</label>
                     <RichEditor 
                       content={summary} 
                       onChange={setSummary} 
                     />
                   </div>
                </div>
              </div>

              {/* Section: Termine und Fristen */}
              <div>
                <button className="flex items-center gap-2 w-full text-left font-medium text-gray-700 mb-4 pt-4 border-t border-gray-100">
                  <Calendar className="w-4 h-4" />
                  Dates and Deadlines
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </button>
                 <div className="space-y-4 pl-1">
                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Status *</label>
                     <div className="flex items-center gap-2 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></div>
                        <select 
                           className="bg-transparent outline-none w-full appearance-none"
                           defaultValue={initialData?.status || "Review"}
                        >
                           <option value="Review">Review</option>
                           <option value="Draft">Draft</option>
                           <option value="Signed">Signed</option>
                           <option value="Active">Active</option>
                           <option value="Expired">Expired</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none flex-shrink-0" />
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Duration Type *</label>
                     <select 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none"
                        defaultValue={initialData?.durationType || "Fixed-term"}
                     >
                        <option value="One-time">One-time</option>
                        <option value="Fixed-term">Fixed-term</option>
                        <option value="Indefinite">Indefinite</option>
                     </select>
                   </div>

                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Contract Start *</label>
                     <input 
                       type="date"
                       defaultValue={initialData?.contractStart || ""}
                       className="w-full px-3 py-2 bg-white border border-blue-500 rounded-lg text-sm text-gray-900 outline-none shadow-sm ring-2 ring-blue-100"
                     />
                   </div>

                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Conditions</label>
                     <RichEditor 
                       content={conditions} 
                       onChange={setConditions} 
                     />
                   </div>
                </div>
              </div>

               {/* Section: Risiken und Compliance */}
              <div>
                <button className="flex items-center gap-2 w-full text-left font-medium text-gray-700 mb-4 pt-4 border-t border-gray-100">
                  <Shield className="w-4 h-4" />
                  Risks and Compliance
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </button>
                <div className="space-y-4 pl-1">
                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Risk Assessment</label>
                     <div className="relative">
                       <select 
                         className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none appearance-none pr-8"
                         defaultValue={initialData?.riskAssessment || ""}
                       >
                          <option value="">Select...</option>
                          {initialData?.riskAssessment && <option value={initialData.riskAssessment}>{initialData.riskAssessment}</option>}
                       </select>
                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Liability Amount</label>
                     <div className="flex gap-2">
                       <input 
                         type="text" 
                         defaultValue={initialData?.liabilityAmount || ""}
                         className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 outline-none"
                       />
                       <div className="relative w-32">
                         <select 
                           className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none appearance-none pr-8"
                         >
                            <option value="">Select...</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                       </div>
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Comments</label>
                     <RichEditor 
                       content={comments} 
                       onChange={setComments} 
                     />
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
           {/* Tabs */}
           <div className="bg-white border-b border-gray-200 px-6 pt-2 flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('documents')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <FileText className="w-4 h-4" />
                Documents
              </button>
              <button 
                onClick={() => setActiveTab('notes')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'notes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Notes
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
              
              <div className="flex items-center gap-3">
                 <div className="flex items-center text-sm text-gray-500">
                    <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="mx-2">1 of 4</span>
                    <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4" /></button>
                 </div>
                 <div className="w-px h-4 bg-gray-300"></div>
                 <div className="flex items-center gap-2 text-sm text-gray-500">
                    <button className="p-1 hover:bg-gray-100 rounded"><ZoomOut className="w-4 h-4" /></button>
                    <span>100%</span>
                    <button className="p-1 hover:bg-gray-100 rounded"><ZoomIn className="w-4 h-4" /></button>
                 </div>
              </div>
           </div>

           {/* Document Content - Scrollable */}
           <div className="flex-1 overflow-y-auto bg-gray-50/50">
             <div className={`bg-white shadow-sm border border-gray-200 relative ${
               activeTab === 'documents' && hasPreview && uploadedFile 
                 ? 'w-full h-full border-0' 
                 : 'max-w-4xl mx-auto min-h-[800px] p-8 md:p-12'
             }`}>
               {activeTab === 'documents' && hasPreview && uploadedFile ? (
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
