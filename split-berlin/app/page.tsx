'use client';

import RichEditor from '@/components/RichEditor';
import { Language, useTranslationSync } from '@/hooks/useTranslationSync';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
];

const PLACEHOLDERS: Record<Language, string> = {
  en: 'The contract starts here...',
  de: 'Der Vertrag beginnt hier...',
  es: 'El contrato comienza aquí...',
  fr: 'Le contrat commence ici...',
  it: 'Il contratto inizia qui...',
  pt: 'O contrato começa aqui...',
};

export default function Home() {
  const [leftLang, setLeftLang] = useState<Language>('en');
  const [rightLang, setRightLang] = useState<Language>('de');

  const {
    leftContent,
    rightContent,
    handleLeftChange,
    handleRightChange,
    isTranslating
  } = useTranslationSync({
    initialLeftLang: leftLang,
    initialRightLang: rightLang
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-md">
            <ArrowRightLeft className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Split-Berlin</h1>
        </div>

        <div className="flex items-center gap-4">
          {isTranslating && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Translating...</span>
            </div>
          )}

          <button className="ml-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
            Export
          </button>
        </div>
      </header>

      {/* Main Content - Split View */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="max-w-[1800px] mx-auto w-full h-full flex flex-col gap-6">

          <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
            <ArrowRightLeft className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Auto-Sync Enabled</span>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[600px]">
            {/* Left Editor */}
            <div className="h-full flex flex-col">
              <RichEditor
                language={leftLang}
                availableLanguages={LANGUAGES}
                onLanguageChange={setLeftLang}
                content={leftContent}
                onChange={handleLeftChange}
                placeholder={PLACEHOLDERS[leftLang]}
                className="h-full border-blue-100 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Right Editor */}
            <div className="h-full flex flex-col">
              <RichEditor
                language={rightLang}
                availableLanguages={LANGUAGES}
                onLanguageChange={setRightLang}
                content={rightContent}
                onChange={handleRightChange}
                placeholder={PLACEHOLDERS[rightLang]}
                className="h-full border-indigo-100 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
