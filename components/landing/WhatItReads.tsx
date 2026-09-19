'use client';

import { useLanguage } from './LanguageContext';
import { Section } from './Section';

export function WhatItReads() {
  const { t } = useLanguage();

  return (
    <Section
      id="what-it-reads"
      title={t.whatItReads.title}
      summary={t.whatItReads.summary}
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {t.whatItReads.types.map((type) => (
          <div key={type.name} className="rounded-2xl border border-rule bg-paper p-6 sm:p-7">
            <h3 className="text-title text-ink">{type.name}</h3>
            <ul className="mt-5 divide-y divide-rule border-t border-rule">
              {type.fields.map((field) => (
                <li key={field} className="py-2.5 text-row text-body">
                  {field}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-6 max-w-[28rem] text-small text-muted">{t.whatItReads.footnote}</p>
    </Section>
  );
}
