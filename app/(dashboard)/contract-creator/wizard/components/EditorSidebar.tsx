import { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Shield, 
  ChevronDown, 
  Search,
  Plus,
  Info
} from 'lucide-react';
import RichEditor from '@/components/RichEditor';
import { ContractAnalysis } from '@/types/contract-analysis';
import { CONTRACT_TYPES } from '@/lib/constants';
import { PillInput } from './PillInput';
import { Tooltip } from '@/components/Tooltip';

interface EditorSidebarProps {
  isOpen: boolean;
  isSaved: boolean;
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
  isSaved,
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
  const [status, setStatus] = useState(initialData?.status || "Review");

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Draft': return 'bg-yellow-400';
      case 'Active': return 'bg-green-400';
      case 'Signed': return 'bg-blue-400';
      case 'Expired': return 'bg-red-400';
      case 'Review': return 'bg-orange-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className={`w-96 bg-white border-r border-gray-200 flex flex-col overflow-y-auto transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full absolute z-10 h-full'}`}>
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm">Data</button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-gray-600">Sponsorship</button>
        </div>
        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 font-medium">
          <Search className="w-3 h-3" />
          Expand
        </button>
      </div>

      <div className="p-4 space-y-6">
        {!isSaved && (
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
        )}

        {/* Section: Essentials (Only Visible After Save) */}
        {isSaved && (
          <div>
            <button className="flex items-center gap-2 w-full text-left font-medium text-gray-700 mb-4">
              <FileText className="w-4 h-4" />
              Essentials
              <ChevronDown className="w-4 h-4 ml-auto" />
            </button>
            
            <div className="space-y-4 pl-1">
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                  Title *
                  <Tooltip content="The official name of the contract document.">
                    <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                  </Tooltip>
                </label>
                <input 
                  type="text" 
                  defaultValue={initialData?.title || fileName.replace(/\.[^/.]+$/, "")}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                  Contract Owner *
                  <Tooltip content="The primary person or entity responsible for this contract.">
                    <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                  </Tooltip>
                </label>
                <PillInput 
                  value={contractOwner}
                  onChange={setContractOwner}
                  placeholder="Enter contract owner..."
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                  Owner Deputy
                  <Tooltip content="A secondary contact person who can act on behalf of the owner.">
                    <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                  </Tooltip>
                </label>
                <PillInput 
                  value={deputy}
                  onChange={setDeputy}
                  placeholder="Enter deputy..."
                />
              </div>
              
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                  Contract Manager *
                  <Tooltip content="The person responsible for the administrative management of the contract.">
                    <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                  </Tooltip>
                </label>
                <PillInput 
                  value={contractManager}
                  onChange={setContractManager}
                  placeholder="Enter contract manager..."
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                  External Reference
                  <Tooltip content="Unique identifier or code from an external system.">
                    <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                  </Tooltip>
                </label>
                <input 
                  type="text" 
                  defaultValue={initialData?.externalReference || "SO-25GCCGRCDAY01"}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none"
                  readOnly={true}
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                  Contract Category
                  <Tooltip content="Classification of the contract for reporting and organization.">
                    <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                  </Tooltip>
                </label>
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
                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                  Organizational Units *
                  <Tooltip content="The department or unit to which this contract belongs.">
                    <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                  </Tooltip>
                </label>
                <div className="relative">
                  <select 
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none appearance-none pr-8"
                    defaultValue={initialData?.organizationalUnit || "Swiss GRC AG"}
                  >
                    <option value="Swiss GRC AG">Swiss GRC AG</option>
                    <option value="Sales">Sales</option>
                    <option value="Legal">Legal</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section: Data / Creation Fields */}
        <div>
          {/* If isSaved, we might want a separator or another header, but typically it continues */}
          {/* Actually in the screenshot "Contract Value" etc seem to be just next in the list or under a section. */}
          {/* We'll put them in a section called "Contract Details" if isSaved, or just keep them top level if !isSaved */}
          
          <div className="space-y-4 pl-1">
            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                Contract Value
                <Tooltip content="Total monetary value of the contract.">
                  <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                </Tooltip>
              </label>
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 outline-none appearance-none pr-8"
                  defaultValue={initialData?.contractValue || ""}
                >
                  <option value="">Select...</option>
                  {initialData?.contractValue && <option value={initialData.contractValue}>{initialData.contractValue}</option>}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                Confidentiality
                <Tooltip content="Level of secrecy required for this document.">
                  <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                </Tooltip>
              </label>
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 outline-none appearance-none pr-8"
                  defaultValue={initialData?.confidentiality || ""}
                >
                  <option value="">Select...</option>
                  <option value="None">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Strict">Strict</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                Contractual Partners
                <Tooltip content="The external entity or counterparty involved in the contract.">
                  <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                </Tooltip>
              </label>
              <div className="relative mb-2">
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 outline-none"
                  defaultValue={initialData?.contractPartner || "Swiss GRC AG"}
                />
              </div>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded px-2 py-1 bg-blue-50">
                <Plus className="w-3 h-3" />
                New Partner
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Contract Summary</label>
              <div className="relative">
                <textarea 
                   className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 outline-none min-h-[100px] resize-y"
                   value={summary}
                   onChange={(e) => setSummary(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Lifecycle */}
        <div>
          <button className="flex items-center gap-2 w-full text-left font-medium text-gray-700 mb-4 pt-4 border-t border-gray-100">
            <Calendar className="w-4 h-4" />
            Lifecycle
            <ChevronDown className="w-4 h-4 ml-auto" />
          </button>
          <div className="space-y-4 pl-1">
            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                Status *
                <Tooltip content="Current lifecycle state of the contract.">
                  <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                </Tooltip>
              </label>
              <div className="flex items-center gap-2 w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status)} flex-shrink-0`}></div>
                <select 
                  className="bg-transparent outline-none w-full appearance-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
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
              <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                Duration Type *
                <Tooltip content="How the contract duration is defined (e.g., fixed or indefinite).">
                  <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                </Tooltip>
              </label>
              <select 
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 outline-none"
                defaultValue={initialData?.durationType || "Once-off"}
              >
                <option value="Once-off">Once-off</option>
                <option value="Fixed-term">Fixed-term</option>
                <option value="Indefinite">Indefinite</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                Start *
                <Tooltip content="The date on which the contract becomes effective.">
                  <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                </Tooltip>
              </label>
              <div className="relative">
                <input 
                  type="date"
                  defaultValue={initialData?.contractStart || "2025-09-02"}
                  className="w-full px-3 py-2 bg-white border border-blue-500 rounded-lg text-sm text-gray-900 outline-none shadow-sm ring-2 ring-blue-100"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Conditions</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-200">
                    <button className="p-1 hover:bg-gray-200 rounded font-bold text-xs">B</button>
                    <button className="p-1 hover:bg-gray-200 rounded italic text-xs">I</button>
                    <button className="p-1 hover:bg-gray-200 rounded underline text-xs">U</button>
                </div>
                <textarea 
                  className="w-full p-2 text-sm outline-none min-h-[80px]"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Risks and Compliance (Still relevant but maybe pushed down) */}
        {isSaved && (
          <div>
            <button className="flex items-center gap-2 w-full text-left font-medium text-gray-700 mb-4 pt-4 border-t border-gray-100">
              <Shield className="w-4 h-4" />
              Risks and Compliance
              <ChevronDown className="w-4 h-4 ml-auto" />
            </button>
            <div className="space-y-4 pl-1">
               {/* Keep existing risk fields... */}
               <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">Risk Assessment</label>
                  <div className="relative">
                    <select 
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 outline-none appearance-none pr-8"
                      defaultValue={initialData?.riskAssessment || ""}
                    >
                      <option value="">Select...</option>
                      {initialData?.riskAssessment && <option value={initialData.riskAssessment}>{initialData.riskAssessment}</option>}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
