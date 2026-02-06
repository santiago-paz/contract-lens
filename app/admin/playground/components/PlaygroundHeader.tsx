import React from 'react';
import Link from 'next/link';
import { Clock, Zap, FileText, Layout, Code, Database, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface PlaygroundHeaderProps {
  result: any;
  activeTab: 'parsed' | 'raw' | 'json';
  setActiveTab: (tab: 'parsed' | 'raw' | 'json') => void;
  onOpenAnalysisPopup: () => void;
  onHydrate: () => void;
  hydrateStatus: 'idle' | 'loading' | 'success' | 'error';
}

export const PlaygroundHeader = ({
  result,
  activeTab,
  setActiveTab,
  onOpenAnalysisPopup,
  onHydrate,
  hydrateStatus
}: PlaygroundHeaderProps) => {
  return (
    <div className="h-16 border-b-2 border-black bg-white flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-1.5 border border-black shadow-hard-sm">
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-gray-700 leading-none mb-1">Latency</span>
            <span className={`font-mono font-bold leading-none ${result ? 'text-black' : 'text-gray-500'}`}>
              {result ? `${result.latency.total}ms` : '--'}
            </span>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-200 rotate-12"></div>
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-1.5 border border-black shadow-hard-sm">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-gray-700 leading-none mb-1">Tokens</span>
            <span className={`font-mono font-bold leading-none ${result ? 'text-black' : 'text-gray-500'}`}>
              {result?.usage?.totalTokens || '--'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onOpenAnalysisPopup}
          disabled={!result}
          className={`px-4 py-2 border-2 border-black font-bold uppercase text-xs flex items-center gap-2 transition-all shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
            ${!result ? 'bg-gray-100 text-gray-400 border-gray-300 shadow-none cursor-not-allowed' : 'bg-white text-black hover:bg-black hover:text-[#CCFF00]'}
          `}
        >
          <FileText className="w-4 h-4" /> Process Details
        </button>
        <div className="flex border-2 border-black bg-white shadow-hard-sm p-1 gap-1">
          {[
            { id: 'parsed', icon: Layout, label: 'Parsed' },
            { id: 'raw', icon: FileText, label: 'Raw' },
            { id: 'json', icon: Code, label: 'JSON' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold uppercase flex items-center gap-2 transition-all
                ${activeTab === tab.id
                  ? 'bg-black text-[#CCFF00]'
                  : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onHydrate}
          disabled={!result?.parsed || hydrateStatus === 'loading' || hydrateStatus === 'success'}
          className={`px-6 py-2.5 border-2 border-black font-bold uppercase text-xs flex items-center gap-2 transition-all shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
             ${hydrateStatus === 'success' ? 'bg-[#CCFF00] text-black' :
              !result?.parsed ? 'bg-gray-100 text-gray-600 border-gray-300 shadow-none cursor-not-allowed' : 'bg-white text-black hover:bg-black hover:text-white'}
           `}
        >
          {hydrateStatus === 'loading' && <Clock className="w-4 h-4 animate-spin" />}
          {hydrateStatus === 'success' && <CheckCircle className="w-4 h-4" />}
          {hydrateStatus === 'error' && <AlertCircle className="w-4 h-4" />}
          {hydrateStatus === 'idle' && <Database className="w-4 h-4" />}
          {hydrateStatus === 'success' ? 'Hydrated' : 'Hydrate DB'}
        </button>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 border-2 border-black font-bold uppercase text-xs flex items-center gap-2 transition-all shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none bg-black text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
        >
          Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
