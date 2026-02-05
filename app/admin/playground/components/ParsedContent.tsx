import React from 'react';
import { Briefcase, Scale, Shield, FileText } from 'lucide-react';
import { ContractData, ContractType } from '@/actions/extract-contract-data';

interface ParsedContentProps {
  parsed: ContractData | null;
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Common Header */}
      <div className="col-span-2 bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow relative group">
        <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">Meta</div>
        <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Title</label>
        <h2 className="text-2xl font-black leading-tight group-hover:text-[#CCFF00] group-hover:bg-black transition-colors inline-block px-1 -ml-1 text-black">
          {data.documentTitle || data.title || 'Untitled Document'}
        </h2>
      </div>

      <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
        <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Type</label>
        <div className="flex items-center gap-2">
          {contractType === 'NDA' && <Shield className="w-5 h-5" />}
          {contractType === 'ServiceAgreement' && <Briefcase className="w-5 h-5" />}
          {contractType === 'LicenseAgreement' && <Scale className="w-5 h-5" />}
          {contractType === 'Other' && <FileText className="w-5 h-5" />}
          <p className="font-bold text-lg border-b-4 border-[#CCFF00] inline-block text-black">{contractType}</p>
        </div>
      </div>

      {/* NDA Specifics */}
      {contractType === 'NDA' && (
        <>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Duration</label>
            <p className="font-mono font-bold text-lg text-black">{data.confidentialityDuration || 'Not specified'}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Mutual?</label>
            <p className="font-bold text-lg text-black">{data.isMutual ? 'Yes' : 'No'}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Jurisdiction</label>
            <p className="font-bold text-lg text-black">{data.jurisdiction || 'Not specified'}</p>
          </div>
          
          {/* Risk Flags */}
          <div className="col-span-3 bg-white p-6 border-2 border-black shadow-hard">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-4 block tracking-wider">Risk Flags</label>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 border border-black ${data.riskFlags?.hasNonSolicit ? 'bg-red-50' : 'bg-green-50'}`}>
                <span className="text-xs font-bold block mb-1">Non-Solicit</span>
                <span className="font-mono">{data.riskFlags?.hasNonSolicit ? 'PRESENT' : 'None'}</span>
              </div>
              <div className={`p-4 border border-black ${data.riskFlags?.noIpTransfer ? 'bg-red-50' : 'bg-green-50'}`}>
                <span className="text-xs font-bold block mb-1">No IP Transfer</span>
                <span className="font-mono">{data.riskFlags?.noIpTransfer ? 'YES' : 'No'}</span>
              </div>
              <div className={`p-4 border border-black ${data.riskFlags?.nonCompete ? 'bg-red-50' : 'bg-green-50'}`}>
                <span className="text-xs font-bold block mb-1">Non-Compete</span>
                <span className="font-mono">{data.riskFlags?.nonCompete ? 'PRESENT' : 'None'}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Service Agreement Specifics */}
      {contractType === 'ServiceAgreement' && (
        <>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Term</label>
            <p className="font-mono font-bold text-lg text-black">{data.termDuration || 'N/A'}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Payment Terms</label>
            <div className="font-bold text-sm text-black">{renderComplexField(data.paymentTerms)}</div>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Termination Notice</label>
            <p className="font-bold text-lg text-black">{data.terminationNoticePeriod || 'N/A'}</p>
          </div>
          
          <div className="col-span-3 grid grid-cols-2 gap-6">
             <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Liability Cap</label>
              <p className="font-bold text-black border-l-4 border-[#CCFF00] pl-3">{data.liabilityCap || 'Not specified'}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">IP Ownership</label>
              <div className="font-bold text-black">{renderComplexField(data.ipOwnership)}</div>
            </div>
          </div>

          <div className="col-span-3 bg-white p-6 border-2 border-black shadow-hard">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Parties</label>
            <div className="flex flex-wrap gap-2">
              {data.parties?.map((p: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-gray-100 border border-black text-sm font-medium">{p}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* License Agreement Specifics */}
      {contractType === 'LicenseAgreement' && (
        <>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">License Type</label>
            <p className="font-bold text-sm text-black">{data.licenseType}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Exclusivity</label>
            <p className="font-bold text-lg text-black">{data.exclusivity}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Software</label>
            <p className="font-bold text-sm text-black">{data.softwareName || 'Not specified'}</p>
          </div>
          
          <div className="col-span-3 grid grid-cols-2 gap-6">
            <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Licensor</label>
              <p className="font-bold text-black">{data.licensor || 'N/A'}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Licensee</label>
              <p className="font-bold text-black">{data.licensee || 'N/A'}</p>
            </div>
          </div>

          <div className="col-span-3 bg-white p-6 border-2 border-black shadow-hard">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-4 block tracking-wider">Audit Rights</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <span className="text-xs text-gray-500 block">Can Audit?</span>
                  <span className="font-bold">{data.auditRights?.canAudit ? 'YES' : 'No'}</span>
               </div>
               <div>
                  <span className="text-xs text-gray-500 block">Notice Period</span>
                  <span className="font-bold">{data.auditRights?.noticePeriod || 'N/A'}</span>
               </div>
               <div className="col-span-2">
                  <span className="text-xs text-gray-500 block">Penalty Clause</span>
                  <span className="font-mono text-sm bg-gray-50 p-2 border border-gray-200 block mt-1">
                    {data.auditRights?.penaltyClause || 'None'}
                  </span>
               </div>
               {data.auditRights?.usageLimits && (
                 <div className="col-span-2">
                    <span className="text-xs text-gray-500 block">Usage Limits</span>
                    <div className="font-mono text-sm bg-gray-50 p-2 border border-gray-200 block mt-1">
                      {renderComplexField(data.auditRights.usageLimits)}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </>
      )}

      {/* General / Other Specifics */}
      {contractType === 'Other' && (
        <>
           <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Effective Date</label>
            <p className="font-mono font-bold text-lg text-black">{data.effectiveDate || 'N/A'}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Renewal</label>
            <p className="font-bold text-lg text-black">{data.hasRenewalClause ? 'Yes' : 'No'}</p>
          </div>
          <div className="col-span-3 bg-white p-6 border-2 border-black shadow-hard">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Parties</label>
            <div className="flex flex-wrap gap-2">
              {data.parties?.map((p: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-gray-100 border border-black text-sm font-medium">{p}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
