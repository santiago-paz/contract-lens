import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { getTranslations } from '@/lib/translations';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  side: 'left' | 'right';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  side,
}) => {
  const t = getTranslations();

  const languages = [
    { code: 'en', label: t.languages.en },
    { code: 'es', label: t.languages.es },
    { code: 'de', label: t.languages.de },
    { code: 'fr', label: t.languages.fr },
    { code: 'it', label: t.languages.it },
    { code: 'pt', label: t.languages.pt },
  ];

  const showAuto = false;

  return (
    <div className="flex flex-col">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent pl-8 pr-8 py-1 text-sm font-semibold text-gray-700 uppercase tracking-wider border border-transparent hover:border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {showAuto && (
            <option value="auto">{t.languages.auto}</option>
          )}
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <Globe className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
