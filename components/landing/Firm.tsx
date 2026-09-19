'use client';

import { useLanguage } from './LanguageContext';
import { Section } from './Section';

export function Firm() {
  const { t } = useLanguage();

  return (
    <Section id="firm" title={t.firm.title} summary={t.firm.summary} tone="navy">
      {/* Three points in the order the copy lists them: roles, tasks, the alert history. */}
      {/* Three across only from 1024px; below that the columns get too narrow to read, above all in German. */}
      <div className="grid gap-x-10 gap-y-12 lg:grid-cols-3">
        {t.firm.points.map((point) => (
          <div key={point.title} className="border-t border-paper/20 pt-6">
            <h3 className="text-title text-paper">{point.title}</h3>
            {/* Light text on navy reads thinner, so it gets a touch more weight, leading and tracking. */}
            <p className="mt-2 max-w-[36rem] text-copy font-[430] leading-[1.65] tracking-[0.005em] text-paper/75">
              {point.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
