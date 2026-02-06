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
    <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-100 rounded-sm">
            <Clock className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-gray-400 leading-none mb-1">Latency</span>
            <span className={`font-mono font-bold leading-none text-sm ${result ? 'text-black' : 'text-gray-300'}`}>
              {result ? `${result.latency.total}ms` : '--'}
            </span>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-100 rounded-sm">
            <Zap className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-gray-400 leading-none mb-1">Tokens</span>
            <span className={`font-mono font-bold leading-none text-sm ${result ? 'text-black' : 'text-gray-300'}`}>
              {result?.usage?.totalTokens || '--'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={onOpenAnalysisPopup}
          disabled={!result}
          className={`px-3 py-1.5 border font-bold uppercase text-[10px] flex items-center gap-2 transition-colors rounded-sm
            ${!result ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'}
          `}
        >
          <FileText className="w-3.5 h-3.5" /> Process Details
        </button>
        <div className="flex border border-gray-200 bg-gray-50 rounded-sm p-0.5 gap-0.5">
          {[
            { id: 'parsed', icon: Layout, label: 'Parsed' },
            { id: 'raw', icon: FileText, label: 'Raw' },
            { id: 'json', icon: Code, label: 'JSON' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase flex items-center gap-1.5 transition-colors rounded-sm
                ${activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-400 hover:text-black hover:bg-white'}`}
            >
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onHydrate}
          disabled={!result?.parsed || hydrateStatus === 'loading' || hydrateStatus === 'success'}
          className={`px-4 py-1.5 border font-bold uppercase text-[10px] flex items-center gap-2 transition-colors rounded-sm
             ${hydrateStatus === 'success' ? 'bg-[#CCFF00] text-black border-[#CCFF00]' :
              !result?.parsed ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'}
           `}
        >
          {hydrateStatus === 'loading' && <Clock className="w-3.5 h-3.5 animate-spin" />}
          {hydrateStatus === 'success' && <CheckCircle className="w-3.5 h-3.5" />}
          {hydrateStatus === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
          {hydrateStatus === 'idle' && <Database className="w-3.5 h-3.5" />}
          {hydrateStatus === 'success' ? 'Hydrated' : 'Hydrate DB'}
        </button>
        <Link
          href="/dashboard"
          className="px-4 py-1.5 border border-black font-bold uppercase text-[10px] flex items-center gap-2 transition-colors rounded-sm bg-black text-white hover:bg-[#CCFF00] hover:text-black hover:border-black"
        >
          Dashboard <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
