'use client';

import { ContractTree } from '@/components/NodeEditor/ContractTree';
import { ArrowRightLeft, FileText, Download } from 'lucide-react';

import { getTranslations } from '@/lib/translations';

export default function Home() {
  const t = getTranslations();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm/50 backdrop-blur-sm bg-white/90">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
            <ArrowRightLeft className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">{t.header.title}</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">{t.header.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all text-sm font-medium">
            <FileText className="w-4 h-4" />
            <span>{t.common.preview}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow">
            <Download className="w-4 h-4" />
            <span>{t.common.export}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full">
          {/* Column Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-4 px-14">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {t.editor.originalLanguage}
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              {t.editor.translationLanguage}
            </div>
          </div>

          {/* Tree Editor */}
          <ContractTree />
        </div>
      </main>
    </div>
  );
}
