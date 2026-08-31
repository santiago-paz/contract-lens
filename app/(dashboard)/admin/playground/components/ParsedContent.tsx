import React from 'react';
import { Briefcase, Scale, Shield, FileText } from 'lucide-react';
import { ContractType } from '@/actions/contract-extraction';
import { ContractAnalysis } from '@/types/contract-analysis';

interface ParsedContentProps {
  parsed: ContractAnalysis | null;
  contractType: ContractType;
}

export const ParsedContent = ({ parsed, contractType }: ParsedContentProps) => {
  if (!parsed) return null;

  // Helper to safely access properties since parsed is a union type
  const data = parsed as any; 

  const renderComplexField = (value: string | Record<string, string> | null | undefined) => {
    if (!value) return 'N/A';
    if (typeof value === 'string') return value;
    return (
      <ul className="list-disc pl-4 space-y-1 mt-1">
        {Object.entries(value).map(([k, v]) => (
          <li key={k} className="text-sm">
            <span className="font-semibold capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span> {v}
          </li>
        ))}
      </ul>
    );
  };

  const cardClass = "bg-white p-6 border border-gray-200 rounded-sm shadow-sm hover:border-gray-300 transition-colors";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Common Header */}
      <div className={`col-span-2 ${cardClass}`}>
        <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Title</label>
        <h2 className="text-2xl font-black leading-tight text-black">
          {data.suggestedTitle || data.documentTitle || data.title || 'Untitled Document'}
        </h2>
      </div>

      <div className={cardClass}>
        <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Type</label>
        <div className="flex items-center gap-2">
          {contractType === 'NDA' && <Shield className="w-5 h-5 text-gray-500" />}
          {contractType === 'ServiceAgreement' && <Briefcase className="w-5 h-5 text-gray-500" />}
          {contractType === 'LicenseAgreement' && <Scale className="w-5 h-5 text-gray-500" />}
          {contractType === 'Other' && <FileText className="w-5 h-5 text-gray-500" />}
          <p className="font-bold text-lg text-black">{contractType}</p>
        </div>
      </div>

      {/* Common Summary */}
      <div className={`col-span-3 ${cardClass}`}>
        <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Summary</label>
        <p className="text-sm text-gray-700 leading-relaxed">{data.summary || 'No summary available.'}</p>
      </div>

      {/* NDA Specifics */}
      {contractType === 'NDA' && (
        <>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Duration</label>
            <p className="font-mono font-bold text-lg text-black">{data.confidentialityDuration || 'Not specified'}</p>
          </div>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Mutual?</label>
            <p className="font-bold text-lg text-black">{data.isMutual === true ? 'Yes' : data.isMutual === false ? 'No' : 'Unclear'}</p>
          </div>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Jurisdiction</label>
            <p className="font-bold text-lg text-black">{data.jurisdiction || 'Not specified'}</p>
          </div>
          
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Effective Date</label>
            <p className="font-mono font-bold text-lg text-black">{data.effectiveDate || 'N/A'}</p>
          </div>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Expiration Date</label>
            <p className="font-mono font-bold text-lg text-black">{data.expirationDate || 'N/A'}</p>
          </div>

          <div className={`col-span-3 ${cardClass}`}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-4 block tracking-wider">Risk Flags</label>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-sm border ${data.riskFlags?.nonSolicit ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
                <span className="text-[10px] font-bold block mb-1 uppercase tracking-wider opacity-70">Non-Solicit</span>
                <span className="font-mono font-bold text-sm">{data.riskFlags?.nonSolicit ? '⚠ PRESENT' : '✓ None'}</span>
              </div>
              <div className={`p-4 rounded-sm border ${data.riskFlags?.liquidatedDamages ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
                <span className="text-[10px] font-bold block mb-1 uppercase tracking-wider opacity-70">Liquidated Damages</span>
                <span className="font-mono font-bold text-sm">{data.riskFlags?.liquidatedDamages ? '⚠ PRESENT' : '✓ None'}</span>
              </div>
              <div className={`p-4 rounded-sm border ${data.riskFlags?.nonCompete ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
                <span className="text-[10px] font-bold block mb-1 uppercase tracking-wider opacity-70">Non-Compete</span>
                <span className="font-mono font-bold text-sm">{data.riskFlags?.nonCompete ? '⚠ PRESENT' : '✓ None'}</span>
              </div>
            </div>
          </div>

          <div className={`col-span-3 ${cardClass}`}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Parties</label>
            <div className="flex flex-wrap gap-2">
              {data.parties?.map((p: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-black border border-gray-200 text-sm font-bold rounded-sm">{p}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Service Agreement Specifics */}
      {contractType === 'ServiceAgreement' && (
        <>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Term / Termination Date</label>
            <p className="font-mono font-bold text-lg text-black">{data.terminationDate || 'N/A'}</p>
          </div>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Effective Date</label>
            <p className="font-mono font-bold text-lg text-black">{data.effectiveDate || 'N/A'}</p>
          </div>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Auto Renewal</label>
            <p className="font-bold text-lg text-black">{data.autoRenewal === true ? 'Yes' : data.autoRenewal === false ? 'No' : 'N/A'}</p>
          </div>

          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Payment Terms</label>
            <div className="font-bold text-sm text-black">{renderComplexField(data.paymentTerms)}</div>
          </div>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Termination Notice</label>
            <p className="font-bold text-lg text-black">{data.terminationNoticePeriod || 'N/A'}</p>
          </div>
          
          <div className="col-span-3 grid grid-cols-2 gap-4">
            <div className={cardClass}>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Liability Cap</label>
              <p className="font-bold text-black border-l-2 border-gray-300 pl-3">{data.liabilityCap || 'Not specified'}</p>
            </div>
            <div className={cardClass}>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">IP Ownership</label>
              <div className="font-bold text-black">{data.ipOwnership || 'N/A'}</div>
            </div>
          </div>

          <div className={`col-span-3 ${cardClass}`}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Indemnification</label>
            <p className="font-bold text-lg text-black">{data.indemnification || 'N/A'}</p>
          </div>

          <div className={`col-span-3 ${cardClass}`}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Parties</label>
            <div className="flex flex-wrap gap-2">
              {data.parties?.map((p: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-black border border-gray-200 text-sm font-bold rounded-sm">{p}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* License Agreement Specifics */}
      {contractType === 'LicenseAgreement' && (
        <>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">License Type</label>
            <p className="font-bold text-sm text-black">{data.licenseType}</p>
          </div>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Exclusivity</label>
            <p className="font-bold text-lg text-black">{data.exclusivity === true ? 'Yes' : data.exclusivity === false ? 'No' : 'N/A'}</p>
          </div>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Software</label>
            <p className="font-bold text-sm text-black">{data.softwareName || 'Not specified'}</p>
          </div>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Renewal Date</label>
            <p className="font-bold text-sm text-black">{data.renewalDate || 'N/A'}</p>
          </div>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Territory</label>
            <p className="font-bold text-sm text-black">{data.territory || 'N/A'}</p>
          </div>
          
          <div className="col-span-3 grid grid-cols-2 gap-4">
            <div className={cardClass}>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Licensor</label>
              <p className="font-bold text-black">{data.licensor || 'N/A'}</p>
            </div>
            <div className={cardClass}>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Licensee</label>
              <p className="font-bold text-black">{data.licensee || 'N/A'}</p>
            </div>
          </div>
          
          <div className={`col-span-3 ${cardClass}`}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Usage Limits</label>
            <p className="font-mono text-base font-bold text-black bg-gray-50 p-3 border border-gray-200 rounded-sm">{data.usageLimits || 'None'}</p>
          </div>

          <div className={`col-span-3 ${cardClass}`}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-4 block tracking-wider">Audit Rights</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 border border-gray-200 rounded-sm">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 tracking-wider">Can Audit?</span>
                <span className="font-bold text-lg text-black">{data.auditRights?.canAudit === true ? 'YES' : data.auditRights?.canAudit === false ? 'No' : 'N/A'}</span>
              </div>
              <div className="bg-gray-50 p-3 border border-gray-200 rounded-sm">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 tracking-wider">Notice Period</span>
                <span className="font-bold text-lg text-black">{data.auditRights?.noticePeriod || 'N/A'}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* General / Other Specifics */}
      {contractType === 'Other' && (
        <>
          <div className={cardClass}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Governing Law</label>
            <p className="font-mono font-bold text-lg text-black">{data.governingLaw || 'N/A'}</p>
          </div>
          
          <div className={`col-span-3 ${cardClass}`}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Key Dates</label>
            {data.keyDates && data.keyDates.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {data.keyDates.map((dateObj: any, idx: number) => (
                  <li key={idx} className="text-sm">
                    <span className="font-semibold">{dateObj.label}:</span> {dateObj.date}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No key dates found.</p>
            )}
          </div>

          <div className={`col-span-3 ${cardClass}`}>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-wider">Parties</label>
            <div className="flex flex-wrap gap-2">
              {data.parties?.map((p: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-black border border-gray-200 text-sm font-bold rounded-sm">{p}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
