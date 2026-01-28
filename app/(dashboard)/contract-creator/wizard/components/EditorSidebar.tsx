import { 
  FileText, 
  Calendar, 
  Shield, 
  ChevronDown, 
  Search,
  Plus
} from 'lucide-react';
import RichEditor from '@/components/RichEditor';
import { ContractAnalysis } from '@/types/contract-analysis';
import { CONTRACT_TYPES } from '@/lib/constants';
import { PillInput } from './PillInput';

interface EditorSidebarProps {
  isOpen: boolean;
  initialData?: ContractAnalysis | null;
  fileName: string;
  contractType: string;
  
  // Form State
  contractOwner: string[];
  setContractOwner: (val: string[]) => void;
  deputy: string[];
  setDeputy: (val: string[]) => void;
  contractManager: string[];
  setContractManager: (val: string[]) => void;
  summary: string;
  setSummary: (val: string) => void;
  conditions: string;
  setConditions: (val: string) => void;
  comments: string;
  setComments: (val: string) => void;
}

export function EditorSidebar({
  isOpen,
  initialData,
  fileName,
  contractType,
  contractOwner,
  setContractOwner,
  deputy,
  setDeputy,
  contractManager,
  setContractManager,
  summary,
  setSummary,
  conditions,
  setConditions,
  comments,
  setComments
}: EditorSidebarProps) {
  return (
    <div className={`w-96 bg-white border-r border-gray-200 flex flex-col overflow-y-auto transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full absolute z-10 h-full'}`}>
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
              <PillInput 
                value={contractOwner}
                onChange={setContractOwner}
                placeholder="Enter contract owner..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Deputy</label>
              <PillInput 
                value={deputy}
                onChange={setDeputy}
                placeholder="Enter deputy..."
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Contract Manager *</label>
              <PillInput 
                value={contractManager}
                onChange={setContractManager}
                placeholder="Enter contract manager..."
              />
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
  );
}
