import { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Shield, 
  ChevronDown, 
  Search,
  Plus,
  Info,
  Layers,
  Scale,
  Check,
  X
} from 'lucide-react';
import RichEditor from '@/components/RichEditor';
import { ContractAnalysis } from '@/types/contract-analysis';
import { CONTRACT_TYPES } from '@/lib/constants';
import { PillInput } from './PillInput';
import { Tooltip } from '@/components/Tooltip';

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Editable field for AI-extracted values that the user can override */
function EditableField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (val: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Not specified"}
        className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-sm"
      />
    </div>
  );
}

/** Boolean flag display (true/false/null) */
function BooleanFlag({ label, value }: { label: string; value: boolean | null | undefined }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
      <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${value ? 'text-green-600' : 'text-gray-400'}`}>
        {value ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
        {value ? 'Yes' : 'No'}
      </span>
    </div>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface EditorSidebarProps {
  isOpen: boolean;
  isSaved: boolean;
  initialData?: ContractAnalysis | null;
  fileName: string;
  contractType: string;
  
  // Form State
  contractTitle: string;
  setContractTitle: (val: string) => void;
  contractPartner: string[];
  setContractPartner: (val: string[]) => void;
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
  
  // Additional fields
  contractValue: string;
  setContractValue: (val: string) => void;
  confidentiality: string;
  setConfidentiality: (val: string) => void;
  durationType: string;
  setDurationType: (val: string) => void;
  contractStart: string;
  setContractStart: (val: string) => void;
  riskAssessment: string;
  setRiskAssessment: (val: string) => void;
  organizationalUnit: string;
  setOrganizationalUnit: (val: string) => void;

  // Contract Details (editable)
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  paymentTiming: string;
  setPaymentTiming: (val: string) => void;
  paymentCurrency: string;
  setPaymentCurrency: (val: string) => void;
  ipOwnership: string;
  setIpOwnership: (val: string) => void;
  indemnification: string;
  setIndemnification: (val: string) => void;
  liabilityCap: string;
  setLiabilityCap: (val: string) => void;
  terminationNoticePeriod: string;
  setTerminationNoticePeriod: (val: string) => void;
  confidentialityDuration: string;
  setConfidentialityDuration: (val: string) => void;
  jurisdiction: string;
  setJurisdiction: (val: string) => void;
  softwareName: string;
  setSoftwareName: (val: string) => void;
  licenseType: string;
  setLicenseType: (val: string) => void;
  licensor: string;
  setLicensor: (val: string) => void;
  licensee: string;
  setLicensee: (val: string) => void;
  usageLimits: string;
  setUsageLimits: (val: string) => void;
  territory: string;
  setTerritory: (val: string) => void;
  governingLaw: string;
  setGoverningLaw: (val: string) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function EditorSidebar({
  isOpen,
  isSaved,
  initialData,
  fileName,
  contractType,
  contractTitle,
  setContractTitle,
  contractPartner,
  setContractPartner,
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
  setStatus,
  contractValue,
  setContractValue,
  confidentiality,
  setConfidentiality,
  durationType,
  setDurationType,
  contractStart,
  setContractStart,
  riskAssessment,
  setRiskAssessment,
  organizationalUnit,
  setOrganizationalUnit,
  // Contract Details
  paymentMethod,
  setPaymentMethod,
  paymentTiming,
  setPaymentTiming,
  paymentCurrency,
  setPaymentCurrency,
  ipOwnership,
  setIpOwnership,
  indemnification,
  setIndemnification,
  liabilityCap,
  setLiabilityCap,
  terminationNoticePeriod,
  setTerminationNoticePeriod,
  confidentialityDuration,
  setConfidentialityDuration,
  jurisdiction,
  setJurisdiction,
  softwareName,
  setSoftwareName,
  licenseType,
  setLicenseType,
  licensor,
  setLicensor,
  licensee,
  setLicensee,
  usageLimits,
  setUsageLimits,
  territory,
  setTerritory,
  governingLaw,
  setGoverningLaw
}: EditorSidebarProps) {

  // The analysis contract type (determines which schema fields are available)
  const analysisType = initialData?.contractType;

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Draft': return 'bg-yellow-400';
      case 'Active': return 'bg-[#CCFF00]';
      case 'Signed': return 'bg-blue-400';
      case 'Expired': return 'bg-red-500';
      case 'Review': return 'bg-orange-400';
      case 'Completed': return 'bg-green-500';
      case 'Archived': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  // Expiration / termination date (varies by contract type)
  const endDate = initialData?.expirationDate || initialData?.terminationDate || initialData?.renewalDate || null;

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

        {/* ── Section: Core Attributes ─────────────────────────────────────── */}
        <div>
          {isSaved && (
            <button className="flex items-center gap-2 w-full text-left font-bold text-black text-xs uppercase mb-4 border-b border-gray-100 pb-2">
              <FileText className="w-3 h-3 text-gray-400" />
              Core Attributes
              <ChevronDown className="w-3 h-3 ml-auto text-gray-400" />
            </button>
          )}
          
          <div className="space-y-4 pl-1">
            {/* Title — always visible */}
            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Contract Title *
              </label>
              <input 
                type="text" 
                value={contractTitle}
                onChange={(e) => setContractTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-sm"
              />
            </div>

            {/* Counterparty — always visible, mapped from parties */}
            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Counterparty
              </label>
              <PillInput 
                value={contractPartner}
                onChange={setContractPartner}
                placeholder="Add Counterparty..."
              />
            </div>

            {/* Parties — read-only chips from extraction */}
            {initialData?.parties && initialData.parties.length > 0 && (
              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Extracted Parties
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {initialData.parties.map((party, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 border border-gray-200 text-[11px] font-medium text-black rounded-sm">
                      {party}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary — always visible */}
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

            {/* These fields are only visible after save */}
            {isSaved && (
              <>
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
                    defaultValue={initialData?.externalReference || ""}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-xs font-mono text-gray-500 outline-none rounded-sm"
                    readOnly={true}
                    placeholder="Auto-generated on save"
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
                      value={organizationalUnit}
                      onChange={(e) => setOrganizationalUnit(e.target.value)}
                    >
                      <option value="Sales">Sales</option>
                      <option value="Legal">Legal</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Section: Contract Details (type-specific) ────────────────────── */}
        {initialData && (
          <div>
            <button className="flex items-center gap-2 w-full text-left font-bold text-black text-xs uppercase mb-4 pt-4 border-t border-gray-100">
              <Layers className="w-3 h-3 text-gray-400" />
              Contract Details
              {analysisType && (
                <span className="ml-auto px-1.5 py-0.5 bg-gray-100 text-[9px] font-bold text-gray-500 rounded-sm uppercase">
                  {analysisType}
                </span>
              )}
            </button>
            <div className="space-y-3 pl-1">
              {/* ── NDA-specific fields ──────────────────────────────────────── */}
              {analysisType === 'NDA' && (
                <>
                  <BooleanFlag label="Mutual NDA" value={initialData.isMutual} />
                  <EditableField label="Confidentiality Duration" value={confidentialityDuration} onChange={setConfidentialityDuration} />
                  <EditableField label="Jurisdiction" value={jurisdiction} onChange={setJurisdiction} />
                  
                  {initialData.riskFlags && (
                    <div>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-2">
                        Risk Clauses
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 space-y-1">
                        <BooleanFlag label="Non-Solicitation" value={initialData.riskFlags.nonSolicit} />
                        <BooleanFlag label="Non-Compete" value={initialData.riskFlags.nonCompete} />
                        <BooleanFlag label="Liquidated Damages" value={initialData.riskFlags.liquidatedDamages} />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── ServiceAgreement-specific fields ────────────────────────── */}
              {analysisType === 'ServiceAgreement' && (
                <>
                  <div>
                    <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-2">
                      Payment Terms
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 space-y-2">
                      <EditableField label="Method" value={paymentMethod} onChange={setPaymentMethod} />
                      <EditableField label="Timing" value={paymentTiming} onChange={setPaymentTiming} />
                      <EditableField label="Currency" value={paymentCurrency} onChange={setPaymentCurrency} />
                    </div>
                  </div>
                  <EditableField label="IP Ownership" value={ipOwnership} onChange={setIpOwnership} />
                  <EditableField label="Indemnification" value={indemnification} onChange={setIndemnification} />
                  <EditableField label="Liability Cap" value={liabilityCap} onChange={setLiabilityCap} />
                  <EditableField label="Termination Notice" value={terminationNoticePeriod} onChange={setTerminationNoticePeriod} />
                  <BooleanFlag label="Auto-Renewal" value={initialData.autoRenewal} />
                </>
              )}

              {/* ── LicenseAgreement-specific fields ────────────────────────── */}
              {analysisType === 'LicenseAgreement' && (
                <>
                  <EditableField label="Software / Product" value={softwareName} onChange={setSoftwareName} />
                  <EditableField label="License Type" value={licenseType} onChange={setLicenseType} />
                  <EditableField label="Licensor" value={licensor} onChange={setLicensor} />
                  <EditableField label="Licensee" value={licensee} onChange={setLicensee} />
                  <EditableField label="Usage Limits" value={usageLimits} onChange={setUsageLimits} />
                  <BooleanFlag label="Exclusive License" value={initialData.exclusivity} />
                  <EditableField label="Territory" value={territory} onChange={setTerritory} />

                  {initialData.auditRights && (
                    <div>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-2">
                        Audit Rights
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 space-y-1">
                        <BooleanFlag label="Can Audit" value={initialData.auditRights.canAudit} />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── General contract fields ──────────────────────────────────── */}
              {(analysisType === 'Other' || analysisType === 'General Terms and Conditions') && (
                <>
                  <EditableField label="Governing Law" value={governingLaw} onChange={setGoverningLaw} />
                  {initialData.keyDates && initialData.keyDates.length > 0 && (
                    <div>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-2">
                        Key Dates
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 space-y-2">
                        {initialData.keyDates.map((kd, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">{kd.label}</span>
                            <span className="font-bold text-black">{kd.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Jurisdiction/Governing Law (show for any type if available and not already shown) */}
              {analysisType !== 'NDA' && analysisType !== 'Other' && analysisType !== 'General Terms and Conditions' && (
                <EditableField label="Governing Law" value={governingLaw} onChange={setGoverningLaw} />
              )}
            </div>
          </div>
        )}

        {/* ── Section: Financial ────────────────────────────────────────────── */}
        <div>
          <div className="space-y-4 pl-1">
            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Value
              </label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none focus:border-black rounded-sm transition-all"
                  value={contractValue}
                  onChange={(e) => setContractValue(e.target.value)}
                  placeholder="Not specified"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Confidentiality
              </label>
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none appearance-none pr-8 focus:border-black rounded-sm transition-all"
                  value={confidentiality}
                  onChange={(e) => setConfidentiality(e.target.value)}
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
          </div>
        </div>

        {/* ── Section: Lifecycle ────────────────────────────────────────────── */}
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
                  <option value="Draft">Draft</option>
                  <option value="Review">Review</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
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
                value={durationType}
                onChange={(e) => setDurationType(e.target.value)}
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
                  value={contractStart}
                  onChange={(e) => setContractStart(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none focus:border-black rounded-sm transition-all"
                />
              </div>
            </div>

            {/* End date — from expirationDate / terminationDate / renewalDate */}
            {endDate && (
              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                  {initialData?.renewalDate ? 'Renewal Date' : 'End Date'}
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    defaultValue={endDate}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-xs font-medium text-black outline-none rounded-sm"
                    readOnly
                  />
                </div>
              </div>
            )}

            {/* Auto-renewal indicator for service agreements */}
            {initialData?.autoRenewal !== null && initialData?.autoRenewal !== undefined && (
              <BooleanFlag label="Auto-Renewal" value={initialData.autoRenewal} />
            )}

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

        {/* ── Section: Risk Protocol ───────────────────────────────────────── */}
        {(isSaved || initialData?.riskFlags || initialData?.liabilityCap || initialData?.liabilityAmount) && (
          <div>
            <button className="flex items-center gap-2 w-full text-left font-bold text-black text-xs uppercase mb-4 pt-4 border-t border-gray-100">
              <Shield className="w-3 h-3 text-gray-400" />
              Risk Protocol
              <ChevronDown className="w-3 h-3 ml-auto text-gray-400" />
            </button>
            <div className="space-y-4 pl-1">
              {isSaved && (
                <div>
                  <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">Risk Level</label>
                  <div className="relative">
                    <select 
                      className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium uppercase text-black outline-none appearance-none pr-8 focus:border-black rounded-sm transition-all"
                      value={riskAssessment}
                      onChange={(e) => setRiskAssessment(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                      {initialData?.riskAssessment && !['Low', 'Medium', 'High', 'Critical'].includes(initialData.riskAssessment) && (
                        <option value={initialData.riskAssessment}>{initialData.riskAssessment}</option>
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}

              <EditableField label="Liability Amount" value={liabilityCap} onChange={setLiabilityCap} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
