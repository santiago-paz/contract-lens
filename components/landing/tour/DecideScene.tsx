'use client';

import { Check } from 'lucide-react';

import { useLanguage } from '../LanguageContext';

/**
 * Tour scene three: one alert, from the date someone set on it to the day a
 * manager closed it. The markup is the finished state (answered, closed, three
 * events); Tour.tsx plays it from the open alert on scroll. The answer chips
 * and the history are the product's own: the product has no other controls
 * here, so none are drawn.
 */
export function DecideScene() {
  const { t } = useLanguage();
  const open = t.deadlines.alert;
  const closed = t.firm.alert;

  return (
    <figure aria-label={closed.figureLabel} className="tour-scene" data-scene="decide">
      <div aria-hidden="true" className="tour-window">
        <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3.5">
          <span className="text-[13px] font-semibold text-ink">{open.title}</span>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
            <span data-dot className="h-2 w-2 rounded-full bg-ink" />
            <span className="inline-grid">
              <span data-status-open className="invisible col-start-1 row-start-1">
                {open.status}
              </span>
              <span data-status-closed className="col-start-1 row-start-1">
                {closed.status}
              </span>
            </span>
          </span>
        </div>

        <div className="px-5 py-4">
          <p className="text-[14px] font-medium text-ink">{open.contract}</p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-muted">{open.deadlineLabel}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="text-[17px] font-semibold tabular-nums text-ink">{open.deadlineDate}</span>
            <span className="rounded-full border border-rule px-2 py-0.5 text-[11px] font-medium text-muted">
              {open.deadlineType}
            </span>
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-muted">{open.answerLabel}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {open.actions.map((action, index) => (
              <span
                key={action}
                data-chip={index}
                className={`rounded-full border px-3 py-1.5 text-[13px] font-medium ${
                  index === 0 ? 'border-ink bg-ink text-paper' : 'border-rule text-ink'
                }`}
              >
                {action}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-rule px-5 py-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted">{closed.historyLabel}</p>
          <ol className="mt-3 space-y-2.5 text-[13px] leading-[1.45]">
            {closed.events.map((event, index) => (
              <li key={event.action} data-event={index} className="flex items-start gap-2.5">
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
        <p className="border-t border-rule bg-ledger px-5 py-2 text-[11px] text-muted">{t.tour.sampleNote}</p>
      </div>
    </figure>
  );
}
