'use client';

import { useLanguage } from './LanguageContext';
import { LANGUAGES } from './translations';

const LABEL = { en: 'EN', de: 'DE' } as const;
const NAME = { en: 'English', de: 'Deutsch' } as const;

/**
 * Two letters and a slash: the language is a small control, not a feature.
 *
 * The other language is a plain link, so crawlers and a middle click work, and
 * a full page load is the cleanest way to re-run the page's motion in the new
 * language. The click first remembers the pick, which proxy.ts then honours
 * over the browser's own language.
 */
export function LanguageToggle({ className = '', tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const { language, hrefFor, remember, t } = useLanguage();
  const idle = tone === 'dark' ? 'text-paper/70 hover:text-paper' : 'text-muted hover:text-ink';
  const current = tone === 'dark' ? 'text-paper' : 'text-ink';

  return (
    <div role="group" aria-label={t.nav.languageLabel} className={`inline-flex items-center text-small font-medium ${className}`}>
      {LANGUAGES.map((code, index) => (
        <span key={code} className="inline-flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className={tone === 'dark' ? 'px-1 text-paper/30' : 'px-1 text-rule'}>
              /
            </span>
          )}
          {code === language ? (
            <span aria-current="true" lang={code} className={`rounded-full px-1.5 py-1.5 ${current}`}>
              {LABEL[code]}
            </span>
          ) : (
            <a
              href={hrefFor(code)}
              hrefLang={code}
              lang={code}
              onClick={() => remember(code)}
              aria-label={NAME[code]}
              className={`rounded-full px-1.5 py-1.5 transition-colors ${idle}`}
            >
              {LABEL[code]}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
