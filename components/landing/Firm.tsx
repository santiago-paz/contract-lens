'use client';

import { History, ListChecks, Users } from 'lucide-react';

import { useLanguage } from './LanguageContext';
import { Section } from './Section';

/** One icon per point, in the order the copy lists them: roles, tasks, the log. */
const ICONS = [Users, ListChecks, History] as const;

export function Firm() {
  const { t } = useLanguage();

  return (
    <Section id="firm" eyebrow={t.firm.eyebrow} title={t.firm.title} summary={t.firm.summary} tone="navy">
      <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
        {t.firm.points.map((point, index) => {
          const Icon = ICONS[index] ?? Users;
          return (
            <div key={point.title} className="border-t border-paper/20 pt-6">
              <Icon className="h-5 w-5 text-paper/80" aria-hidden="true" strokeWidth={1.75} />
              <h3 className="mt-5 text-[1.0625rem] font-semibold text-paper">{point.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-paper/75">{point.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
