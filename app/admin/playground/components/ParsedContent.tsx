import React from 'react';
import { Briefcase, Scale, Shield } from 'lucide-react';
import { ContractAnalysis } from '@/types/contract-analysis';

interface ParsedContentProps {
  parsed: ContractAnalysis | null;
}

export const ParsedContent = ({ parsed }: ParsedContentProps) => {
  if (!parsed) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Common Header */}
      <div className="col-span-2 bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow relative group">
        <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">Meta</div>
        <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Title</label>
        <h2 className="text-2xl font-black leading-tight group-hover:text-[#CCFF00] group-hover:bg-black transition-colors inline-block px-1 -ml-1 text-black">{parsed.title}</h2>
      </div>

      <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
        <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Type</label>
        <div className="flex items-center gap-2">
          {parsed.contractType === 'NDA' && <Shield className="w-5 h-5" />}
          {parsed.contractType === 'ServiceAgreement' && <Briefcase className="w-5 h-5" />}
          {parsed.contractType === 'LicenseAgreement' && <Scale className="w-5 h-5" />}
          <p className="font-bold text-lg border-b-4 border-[#CCFF00] inline-block text-black">{parsed.contractType}</p>
        </div>
      </div>

      {/* NDA Specifics */}
      {parsed.contractType === 'NDA' && (
        <>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Duration</label>
            <p className="font-mono font-bold text-lg text-black">{parsed.duration}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Mutual?</label>
            <p className="font-bold text-lg text-black">{parsed.isMutual ? 'Yes' : 'No'}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Jurisdiction</label>
            <p className="font-bold text-lg text-black">{parsed.jurisdiction}</p>
          </div>
          <div className="col-span-3 grid grid-cols-2 gap-6">
            <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Disclosing Party</label>
              <p className="font-bold text-black">{parsed.disclosingParty}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Receiving Party</label>
              <p className="font-bold text-black">{parsed.receivingParty}</p>
            </div>
          </div>
        </>
      )}

      {/* Service Agreement Specifics */}
      {parsed.contractType === 'ServiceAgreement' && (
        <>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Value</label>
            <p className="font-mono font-bold text-lg text-black">{parsed.totalContractValue || 'N/A'}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Payment</label>
            <p className="font-bold text-sm text-black">{parsed.paymentSchedule}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Notice Period</label>
            <p className="font-bold text-lg text-black">{parsed.terminationNoticePeriod}</p>
          </div>
          <div className="col-span-3 grid grid-cols-2 gap-6">
            <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Provider</label>
              <p className="font-bold text-black">{parsed.providerName}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Client</label>
              <p className="font-bold text-black">{parsed.clientName}</p>
            </div>
          </div>
          <div className="col-span-3 bg-white p-6 border-2 border-black shadow-hard">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Deliverables</label>
            <ul className="list-disc list-inside space-y-1">
              {parsed.deliverables.map((d, i) => (
                <li key={i} className="text-sm font-medium text-black">{d}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* License Agreement Specifics */}
      {parsed.contractType === 'LicenseAgreement' && (
        <>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Territory</label>
            <p className="font-bold text-sm text-black">{parsed.territory}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Exclusivity</label>
            <p className="font-bold text-lg text-black">{parsed.exclusivity ? 'Exclusive' : 'Non-Exclusive'}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow">
            <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Samples</label>
            <p className="font-bold text-sm text-black">{parsed.productSamplesRequired || 'None'}</p>
          </div>
          <div className="col-span-3 grid grid-cols-2 gap-6">
            <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Licensor</label>
              <p className="font-bold text-black">{parsed.licensor}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Licensee</label>
              <p className="font-bold text-black">{parsed.licensee}</p>
            </div>
          </div>
          <div className="col-span-3 grid grid-cols-2 gap-6">
            <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Audit Rights</label>
              <p className="text-sm text-black">{parsed.auditRights || 'None'}</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-hard">
              <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-wider">Insurance</label>
              <p className="text-sm text-black">{parsed.insuranceRequirements || 'None'}</p>
            </div>
          </div>
        </>
      )}

      {/* Summary (Common) */}
      {parsed.summary && (
        <div className="col-span-3 bg-white p-8 border-2 border-black shadow-hard hover:shadow-hard-lg transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#CCFF00] -mr-8 -mt-8 rotate-45 border-2 border-black"></div>
          <label className="text-[10px] uppercase font-black text-gray-600 mb-4 block tracking-wider">Executive Summary</label>
          <p className="leading-relaxed text-lg font-medium text-black">{parsed.summary}</p>
        </div>
      )}
    </div>
  );
};
