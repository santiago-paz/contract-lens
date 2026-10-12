'use client';

import { URGENCY_CHIP } from '../chips';
import { useLanguage } from '../LanguageContext';

/**
 * Tour scene two: the list of expiring contracts and its four filters, drawn as
 * the product has them. The rows are the same four the sign-in pages show.
 * The markup is the finished state (the 90-day filter, every row); Tour.tsx
 * plays the filters one after another on scroll. Rows have a fixed height so
 * they can collapse and return without measuring anything.
 */
export function WatchScene() {
  const { t } = useLanguage();
  const { list } = t.deadlines;

  return (
    <figure aria-label={t.deadlines.listLabel} className="tour-scene" data-scene="watch">
      <div aria-hidden="true" className="tour-window">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-rule px-5 py-3.5">
          <span className="text-[13px] font-semibold text-ink">{list.title}</span>
          <div className="flex flex-wrap gap-1">
            {list.buckets.map((bucket, index) => (
              <span
                key={bucket.label}
                data-pill={index}
                className={`rounded-full px-3 py-1 text-[12px] ${
                  index === list.buckets.length - 1 ? 'bg-ink text-paper' : 'text-muted'
                }`}
              >
                {bucket.label} <span className="font-medium tabular-nums">{bucket.count}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_6.25rem] gap-x-4 px-5 py-2.5 text-[11px] uppercase tracking-[0.12em] text-muted sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_6.25rem]">
          <span>{list.columns.contract}</span>
          <span className="hidden sm:block">{list.columns.notice}</span>
          <span className="text-right">{list.columns.ends}</span>
        </div>

        <div data-wlist className="border-t border-rule">
          {list.rows.map((row) => (
            <div
              key={row.title}
              data-wrow={row.days}
              className="tour-wrow grid grid-cols-[minmax(0,1fr)_6.25rem] items-center gap-x-4 border-b border-rule px-5 text-[13px] last:border-b-0 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_6.25rem]"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium text-ink">{row.title}</span>
                <span className="block truncate text-[12px] text-muted">{row.partner}</span>
              </span>
              <span className="hidden text-muted sm:block">{row.notice}</span>
              <span className="text-right tabular-nums">
                <span
                  className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-medium ${URGENCY_CHIP[row.urgency]}`}
                >
                  {row.ends}
                </span>
              </span>
            </div>
          ))}
        </div>
        <p className="border-t border-rule bg-ledger px-5 py-2 text-[11px] text-muted">{t.tour.sampleNote}</p>
      </div>
    </figure>
  );
}
