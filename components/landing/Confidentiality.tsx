'use client';

import { useLanguage } from './LanguageContext';
import { Section } from './Section';

export function Confidentiality() {
  const { t } = useLanguage();

  return (
    <Section
      id="confidentiality"
      title={t.confidentiality.title}
      summary={t.confidentiality.summary}
    >
      {/* Four points, set like the firm's: a hairline, the term, a short answer. Two across, so each answer reads at a comfortable width. */}
      <dl className="grid gap-x-10 gap-y-12 md:grid-cols-2">
        {t.confidentiality.items.map((item) => (
          <div key={item.term} className="border-t border-rule pt-6">
            <dt className="text-title text-ink">{item.term}</dt>
            <dd className="mt-2 max-w-[36rem] text-copy text-body">{item.body}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
