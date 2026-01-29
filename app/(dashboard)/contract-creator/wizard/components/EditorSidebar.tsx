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
  status: string;
  setStatus: (val: string) => void;
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
  setComments,
  status,
  setStatus
}: EditorSidebarProps) {

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Draft': return 'bg-yellow-400';
      case 'Active': return 'bg-[#CCFF00]';
      case 'Signed': return 'bg-blue-400';
      case 'Expired': return 'bg-red-500';
      case 'Review': return 'bg-orange-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className={`w-96 bg-white flex flex-col overflow-y-auto transition-all duration-300 font-mono h-full ${isOpen ? 'translate-x-0' : '-translate-x-full absolute z-10'}`}>
      <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex gap-4">
          <button className="pb-1 border-b-2 border-[#CCFF00] text-[10px] font-bold uppercase text-black">Metadata</button>
          <button className="pb-1 border-b-2 border-transparent text-[10px] font-bold uppercase text-gray-400 hover:text-black transition-colors">Relations</button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {!isSaved && (
           <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/50 p-4 flex items-start gap-3 rounded-sm">
             <div className="mt-0.5 text-black">
               <div className="w-4 h-4 flex items-center justify-center bg-[#CCFF00] rounded-full">
                 <span className="text-[10px] font-bold">✓</span>
               </div>
             </div>
             <div className="text-xs font-medium text-black uppercase leading-relaxed">
               Analysis Complete. Data pre-filled from source.
             </div>
           </div>
        )}

        {/* Section: Essentials (Only Visible After Save) */}
        {isSaved && (
          <div>
            <button className="flex items-center gap-2 w-full text-left font-bold text-black text-xs uppercase mb-4 border-b border-gray-100 pb-2">
              <FileText className="w-3 h-3 text-gray-400" />
              Core Attributes
              <ChevronDown className="w-3 h-3 ml-auto text-gray-400" />
            </button>
            
            <div className="space-y-4 pl-1">
              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Contract Title *
                </label>
                <input 
                  type="text" 
                  defaultValue={initialData?.title || fileName.replace(/\.[^/.]+$/, "")}
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-sm"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Owner *
                </label>
                <PillInput 
                  value={contractOwner}
                  onChange={setContractOwner}
                  placeholder="Add Owner..."
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Deputy
                </label>
                <PillInput 
                  value={deputy}
                  onChange={setDeputy}
                  placeholder="Add Deputy..."
                />
              </div>
              
              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Manager *
                </label>
                <PillInput 
                  value={contractManager}
                  onChange={setContractManager}
                  placeholder="Add Manager..."
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Ref. ID
                </label>
                <input 
                  type="text" 
                  defaultValue={initialData?.externalReference || "SO-25GCCGRCDAY01"}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-xs font-mono text-gray-500 outline-none rounded-sm"
                  readOnly={true}
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Category
                </label>
                <div className="relative">
                  <select 
                    className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none appearance-none pr-8 focus:border-black rounded-sm transition-all"
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
                <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Org Unit *
                </label>
                <div className="relative">
                  <select 
                    className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none appearance-none pr-8 focus:border-black rounded-sm transition-all"
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
          <div className="space-y-4 pl-1">
            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Value
              </label>
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none appearance-none pr-8 focus:border-black rounded-sm transition-all"
                  defaultValue={initialData?.contractValue || ""}
                >
                  <option value="">Select...</option>
                  {initialData?.contractValue && <option value={initialData.contractValue}>{initialData.contractValue}</option>}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Confidentiality
              </label>
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none appearance-none pr-8 focus:border-black rounded-sm transition-all"
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
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Counterparty
              </label>
              <div className="relative mb-2">
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none focus:border-black rounded-sm transition-all"
                  defaultValue={initialData?.contractPartner || "Swiss GRC AG"}
                />
              </div>
              <button className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-black font-bold border border-gray-200 rounded-sm px-2 py-1 bg-white hover:border-black uppercase transition-all">
                <Plus className="w-3 h-3" />
                Add Entity
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Summary</label>
              <div className="relative">
                <textarea 
                   className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-sans text-black outline-none min-h-[100px] resize-y focus:border-black rounded-sm transition-all"
                   value={summary}
                   onChange={(e) => setSummary(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Lifecycle */}
        <div>
          <button className="flex items-center gap-2 w-full text-left font-bold text-black text-xs uppercase mb-4 pt-4 border-t border-gray-100">
            <Calendar className="w-3 h-3 text-gray-400" />
            Lifecycle Control
            <ChevronDown className="w-3 h-3 ml-auto text-gray-400" />
          </button>
          <div className="space-y-4 pl-1">
            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Status *
              </label>
              <div className="flex items-center gap-2 w-full px-3 py-2 bg-white border border-gray-200 text-xs font-bold uppercase text-black rounded-sm">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status)} flex-shrink-0`}></div>
                <select 
                  className="bg-transparent outline-none w-full appearance-none uppercase text-xs font-medium"
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
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Duration Type *
              </label>
              <select 
                className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none focus:border-black rounded-sm transition-all"
                defaultValue={initialData?.durationType || "Once-off"}
              >
                <option value="Once-off">Once-off</option>
                <option value="Fixed-term">Fixed-term</option>
                <option value="Indefinite">Indefinite</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Effective Date *
              </label>
              <div className="relative">
                <input 
                  type="date"
                  defaultValue={initialData?.contractStart || "2025-09-02"}
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none focus:border-black rounded-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Conditions</label>
              <div className="border border-gray-200 bg-white overflow-hidden rounded-sm focus-within:border-black transition-all">
                <textarea 
                  className="w-full p-2 text-xs font-sans outline-none min-h-[80px]"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Risks and Compliance */}
        {isSaved && (
          <div>
            <button className="flex items-center gap-2 w-full text-left font-bold text-black text-xs uppercase mb-4 pt-4 border-t border-gray-100">
              <Shield className="w-3 h-3 text-gray-400" />
              Risk Protocol
              <ChevronDown className="w-3 h-3 ml-auto text-gray-400" />
            </button>
            <div className="space-y-4 pl-1">
               <div>
                  <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">Risk Level</label>
                  <div className="relative">
                    <select 
                      className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium uppercase text-black outline-none appearance-none pr-8 focus:border-black rounded-sm transition-all"
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
