'use client';

import { KeyRound, Lock, ScanText, Trash2 } from 'lucide-react';

import { useLanguage } from './LanguageContext';
import { Section } from './Section';

/** One icon per item, in the order the copy lists them: storage, the AI, access, deletion. */
const ICONS = [Lock, ScanText, KeyRound, Trash2] as const;

export function Confidentiality() {
  const { t } = useLanguage();

  return (
    <Section
      id="confidentiality"
      eyebrow={t.confidentiality.eyebrow}
      title={t.confidentiality.title}
      summary={t.confidentiality.summary}
    >
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.confidentiality.items.map((item, index) => {
          const Icon = ICONS[index] ?? Lock;
          return (
            <div key={item.term} className="rounded-2xl border border-rule bg-paper p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mist text-ink">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.75} />
              </span>
              <dt className="mt-5 text-[1.0625rem] font-semibold text-ink">{item.term}</dt>
              <dd className="mt-2 text-[15px] leading-[1.6] text-body">{item.body}</dd>
            </div>
          );
        })}
      </dl>
    </Section>
  );
}
