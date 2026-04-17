import {
  FileText,
  Calendar,
  Shield,
  ChevronDown,
  Layers,
  Check,
  X
} from 'lucide-react';
import { ContractAnalysis } from '@/types/contract-analysis';
import { CONTRACT_TYPES } from '@/lib/constants';
import { PillInput } from './PillInput';
import type { ContractFormData } from '../hooks/use-contract-form';

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

/** Toggleable boolean flag */
function BooleanToggle({ label, value, onChange }: { label: string; value: boolean | null; onChange: (val: boolean) => void }) {
  if (value === null) return null;
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center justify-between py-1 w-full group"
    >
      <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
      <span className={`flex items-center gap-1 text-[10px] font-bold uppercase transition-colors group-hover:opacity-70 ${value ? 'text-green-600' : 'text-gray-400'}`}>
        {value ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
        {value ? 'Yes' : 'No'}
      </span>
    </button>
  );
}

// ── Helpers for field keys ────────────────────────────────────────────────────

type StringKey = {
  [K in keyof ContractFormData]: ContractFormData[K] extends string ? K : never;
}[keyof ContractFormData];

type ArrayKey = {
  [K in keyof ContractFormData]: ContractFormData[K] extends string[] ? K : never;
}[keyof ContractFormData];

type BooleanKey = {
  [K in keyof ContractFormData]: ContractFormData[K] extends boolean | null ? K : never;
}[keyof ContractFormData];

// ── Props ──────────────────────────────────────────────────────────────────────

interface EditorSidebarProps {
  isOpen: boolean;
  isSaved: boolean;
  initialData?: ContractAnalysis | null;
  fileName: string;
  contractType: string;
  formData: ContractFormData;
  updateField: (key: StringKey, value: string) => void;
  updateArrayField: (key: ArrayKey, value: string[]) => void;
  updateBooleanField: (key: BooleanKey, value: boolean | null) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function EditorSidebar({
  isOpen,
  isSaved,
  initialData,
  fileName,
  contractType,
  formData,
  updateField,
  updateArrayField,
  updateBooleanField,
}: EditorSidebarProps) {

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

  const endDate = initialData?.expirationDate || initialData?.terminationDate || initialData?.renewalDate || null;

  /** Shortcut: bind a BooleanToggle to a boolean key */
  const toggle = (label: string, key: BooleanKey) => (
    <BooleanToggle
      label={label}
      value={formData[key]}
      onChange={(val) => updateBooleanField(key, val)}
    />
  );

  /** Shortcut: bind an EditableField to a string key */
  const field = (label: string, key: StringKey, placeholder?: string) => (
    <EditableField
      label={label}
      value={formData[key]}
      onChange={(val) => updateField(key, val)}
      placeholder={placeholder}
    />
  );

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
            {field('Contract Title *', 'contractTitle')}

            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Counterparty
              </label>
              <PillInput
                value={formData.contractPartner}
                onChange={(val) => updateArrayField('contractPartner', val)}
                placeholder="Add Counterparty..."
              />
            </div>

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

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Summary</label>
              <div className="relative">
                <textarea
                   className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-sans text-black outline-none min-h-[100px] resize-y focus:border-black rounded-sm transition-all"
                   value={formData.summary}
                   onChange={(e) => updateField('summary', e.target.value)}
                />
              </div>
            </div>

            {isSaved && (
              <>
                <div>
                  <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Owner *
                  </label>
                  <PillInput
                    value={formData.contractOwner}
                    onChange={(val) => updateArrayField('contractOwner', val)}
                    placeholder="Add Owner..."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Deputy
                  </label>
                  <PillInput
                    value={formData.deputy}
                    onChange={(val) => updateArrayField('deputy', val)}
                    placeholder="Add Deputy..."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Manager *
                  </label>
                  <PillInput
                    value={formData.contractManager}
                    onChange={(val) => updateArrayField('contractManager', val)}
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
                      value={formData.organizationalUnit}
                      onChange={(e) => updateField('organizationalUnit', e.target.value)}
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
              {/* ── NDA ──────────────────────────────────────────────────────── */}
              {analysisType === 'NDA' && (
                <>
                  {toggle('Mutual NDA', 'isMutual')}
                  {field('Confidentiality Duration', 'confidentialityDuration')}
                  {field('Jurisdiction', 'jurisdiction')}

                  {initialData.riskFlags && (
                    <div>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-2">
                        Risk Clauses
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 space-y-1">
                        {toggle('Non-Solicitation', 'nonSolicit')}
                        {toggle('Non-Compete', 'nonCompete')}
                        {toggle('Liquidated Damages', 'liquidatedDamages')}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── ServiceAgreement ─────────────────────────────────────────── */}
              {analysisType === 'ServiceAgreement' && (
                <>
                  <div>
                    <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-2">
                      Payment Terms
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 space-y-2">
                      {field('Method', 'paymentMethod')}
                      {field('Timing', 'paymentTiming')}
                      {field('Currency', 'paymentCurrency')}
                    </div>
                  </div>
                  {field('IP Ownership', 'ipOwnership')}
                  {field('Indemnification', 'indemnification')}
                  {field('Liability Cap', 'liabilityCap')}
                  {field('Termination Notice', 'terminationNoticePeriod')}
                  {toggle('Auto-Renewal', 'autoRenewal')}
                </>
              )}

              {/* ── LicenseAgreement ─────────────────────────────────────────── */}
              {analysisType === 'LicenseAgreement' && (
                <>
                  {field('Software / Product', 'softwareName')}
                  {field('License Type', 'licenseType')}
                  {field('Licensor', 'licensor')}
                  {field('Licensee', 'licensee')}
                  {field('Usage Limits', 'usageLimits')}
                  {toggle('Exclusive License', 'exclusivity')}
                  {field('Territory', 'territory')}

                  {initialData.auditRights && (
                    <div>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-2">
                        Audit Rights
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 space-y-1">
                        <div className="flex items-center justify-between py-1">
                          <span className="text-[10px] font-bold text-gray-500 uppercase">Can Audit</span>
                          <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${initialData.auditRights!.canAudit ? 'text-green-600' : 'text-gray-400'}`}>
                            {initialData.auditRights!.canAudit ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {initialData.auditRights!.canAudit ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── General ──────────────────────────────────────────────────── */}
              {(analysisType === 'Other' || analysisType === 'General Terms and Conditions') && (
                <>
                  {field('Governing Law', 'governingLaw')}
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

              {analysisType !== 'NDA' && analysisType !== 'Other' && analysisType !== 'General Terms and Conditions' && (
                field('Governing Law', 'governingLaw')
              )}
            </div>
          </div>
        )}

        {/* ── Section: Financial ────────────────────────────────────────────── */}
        <div>
          <div className="space-y-4 pl-1">
            {field('Value', 'contractValue')}

            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mb-1">
                Confidentiality
              </label>
              <div className="relative">
                <select
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none appearance-none pr-8 focus:border-black rounded-sm transition-all"
                  value={formData.confidentiality}
                  onChange={(e) => updateField('confidentiality', e.target.value)}
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
                <div className={`w-2 h-2 rounded-full ${getStatusColor(formData.status)} flex-shrink-0`}></div>
                <select
                  className="bg-transparent outline-none w-full appearance-none uppercase text-xs font-medium"
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
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
                value={formData.durationType}
                onChange={(e) => updateField('durationType', e.target.value)}
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
                  value={formData.contractStart}
                  onChange={(e) => updateField('contractStart', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-xs font-medium text-black outline-none focus:border-black rounded-sm transition-all"
                />
              </div>
            </div>

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

            {formData.autoRenewal !== null && toggle('Auto-Renewal', 'autoRenewal')}

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Conditions</label>
              <div className="border border-gray-200 bg-white overflow-hidden rounded-sm focus-within:border-black transition-all">
                <textarea
                  className="w-full p-2 text-xs font-sans outline-none min-h-[80px]"
                  value={formData.conditions}
                  onChange={(e) => updateField('conditions', e.target.value)}
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
                      value={formData.riskAssessment}
                      onChange={(e) => updateField('riskAssessment', e.target.value)}
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

              {field('Liability Amount', 'liabilityCap')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
