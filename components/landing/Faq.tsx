'use client';

import { useLanguage } from './LanguageContext';
import { Section } from './Section';

/**
 * The questions a firm asks before it asks for a demo, answered in the same
 * plain words as the rest of the page. Native <details>, so it works without a
 * script, with the keyboard and with a screen reader; only one answer stays
 * open at a time (the shared `name`), and the answer eases open where the
 * browser supports it. The same text is in the page's structured data.
 */
export function Faq() {
  const { t } = useLanguage();

  return (
    <Section id="faq" title={t.faq.title} tone="ledger" layout="split">
      <div className="divide-y divide-rule border-y border-rule">
        {t.faq.items.map((item) => (
          <details key={item.q} name="faq" className="faq-item group">
            <summary className="faq-summary flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left">
              <span className="text-title text-ink">{item.q}</span>
              <span aria-hidden="true" className="faq-mark mt-1.5">
                <span />
                <span />
              </span>
            </summary>
            <div className="faq-answer">
              <p className="max-w-[36rem] pb-6 text-copy text-body">{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
