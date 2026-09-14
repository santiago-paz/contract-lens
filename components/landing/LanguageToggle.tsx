'use client';

import { useLanguage } from './LanguageContext';

const OPTIONS = [
  ['en', 'EN'],
  ['de', 'DE'],
] as const;

/** Two letters and a slash: the language is a small control, not a feature. */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div role="group" aria-label={t.nav.languageLabel} className={`inline-flex items-center text-[13px] font-medium ${className}`}>
      {OPTIONS.map(([code, label], index) => (
        <span key={code} className="inline-flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="px-1 text-rule">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={language === code}
            className={`rounded-full px-1.5 py-1.5 transition-colors ${
              language === code ? 'text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  );
}
