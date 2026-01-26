'use client';

import { Language } from '@/hooks/useTranslationSync';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';
import { getTranslations } from '@/lib/translations';

interface RichEditorProps {
  content: string;
  onChange: (text: string) => void;
  isReadOnly?: boolean;
  language: Language;
  availableLanguages: { code: Language; label: string }[];
  onLanguageChange: (lang: Language) => void;
  className?: string;
  label?: string;
  placeholder?: string;
}

const RichEditor = ({
  content,
  onChange,
  isReadOnly = false,
  language,
  availableLanguages,
  onLanguageChange,
  className,
  label,
  placeholder
}: RichEditorProps) => {
  const t = getTranslations();

  return (
    <div className={cn("flex flex-col border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden h-full", className)}>
      <div className="bg-gray-50 border-b flex flex-col">
        <div className="px-4 py-2 flex justify-between items-center border-b border-gray-100">
          {/* Language Selector in Header */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="text-sm font-semibold text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 transition-colors"
            >
              {availableLanguages.map(l => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-gray-400 font-mono tracking-wider">{language.toUpperCase()}</span>
        </div>
      </div>

      <textarea
        name={`editor-${language}`}
        id={`editor-${language}`}
        className="flex-1 w-full h-full p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed text-gray-700 placeholder:text-gray-400"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        readOnly={isReadOnly}
        placeholder={placeholder || t.editor.richEditorPlaceholder}
        spellCheck={false}
      />
    </div>
  );
};

export default RichEditor;
