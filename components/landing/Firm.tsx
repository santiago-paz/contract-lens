'use client';

import { Check } from 'lucide-react';

import { useLanguage } from './LanguageContext';
import { Section } from './Section';

export function Firm() {
  const { t } = useLanguage();
  const { alert } = t.firm;

  return (
    <Section id="firm" title={t.firm.title} summary={t.firm.summary} tone="navy">
      <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        {/* Roles and tasks stay in words; the history is a screen, because that is the part worth seeing. */}
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-1">
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

        {/* One alert after it was answered and closed: the same one the deadlines section shows still open. */}
        <figure aria-label={alert.figureLabel}>
          <div aria-hidden="true" className="overflow-hidden rounded-2xl bg-paper shadow-sheet">
            <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3.5">
              <span className="text-[13px] font-semibold text-ink">{alert.title}</span>
              <span className="text-[12px] text-muted">{alert.status}</span>
            </div>

            <div className="px-5 py-4">
              <p className="text-[14px] font-medium text-ink">{alert.contract}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-muted">{alert.deadlineLabel}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="text-[17px] font-semibold tabular-nums text-ink">{alert.deadlineDate}</span>
                <span className="rounded-full border border-rule px-2 py-0.5 text-[11px] font-medium text-muted">
                  {alert.deadlineType}
                </span>
              </p>
            </div>

            <div className="border-t border-rule px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted">{alert.historyLabel}</p>
              <ol className="mt-3 space-y-2.5 text-[13px] leading-[1.45]">
                {alert.events.map((event) => (
                  <li key={event.action} className="flex items-start gap-2.5">
                    <span className="mt-[3px] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span className="min-w-0">
                      <span className="text-ink">{event.action}</span>
                      <span className="text-muted">
                        {' · '}
                        {event.by}
                        {' · '}
                        <span className="tabular-nums">{event.date}</span>
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </figure>
      </div>
    </Section>
  );
}
