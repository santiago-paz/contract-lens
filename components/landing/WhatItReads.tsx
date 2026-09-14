'use client';

import { useLanguage } from './LanguageContext';
import { Section } from './Section';

export function WhatItReads() {
  const { t } = useLanguage();

  return (
    <Section
      id="what-it-reads"
      eyebrow={t.whatItReads.eyebrow}
      title={t.whatItReads.title}
      summary={t.whatItReads.summary}
    >
      <p className="max-w-[44rem] text-[1.0625rem] leading-[1.6] text-body">{t.whatItReads.body}</p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {t.whatItReads.types.map((type) => (
          <div key={type.name} className="rounded-2xl border border-rule bg-paper p-6 sm:p-7">
            <h3 className="text-[1.0625rem] font-semibold text-ink">{type.name}</h3>
            {type.note && <p className="mt-1 text-[13px] text-muted">{type.note}</p>}
            <ul className="mt-5 divide-y divide-rule border-t border-rule">
              {type.fields.map((field) => (
                <li key={field} className="py-2.5 text-[14px] leading-[1.45] text-body">
                  {field}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[13px] leading-[1.5] text-muted">{t.whatItReads.footnote}</p>
    </Section>
  );
}
