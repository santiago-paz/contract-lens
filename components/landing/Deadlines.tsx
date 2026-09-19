'use client';

import { URGENCY_CHIP } from './chips';
import { useLanguage } from './LanguageContext';
import { Section } from './Section';

export function Deadlines() {
  const { t } = useLanguage();
  const { list, alert } = t.deadlines;

  return (
    <Section
      id="deadlines"
      title={t.deadlines.title}
      summary={t.deadlines.summary}
      tone="ledger"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
        {/* The list of expiring contracts, as the product sorts it */}
        <figure aria-label={t.deadlines.listLabel}>
          <div aria-hidden="true" className="overflow-hidden rounded-2xl bg-paper shadow-sheet">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-rule px-5 py-3.5">
              <span className="text-[13px] font-semibold text-ink">{list.title}</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted">
                {list.buckets.map((bucket) => (
                  <span key={bucket.label}>
                    {bucket.label} <span className="font-medium tabular-nums text-ink">{bucket.count}</span>
                  </span>
                ))}
              </div>
            </div>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-5 py-2.5 font-normal">{list.columns.contract}</th>
                  <th className="hidden px-3 py-2.5 font-normal md:table-cell">{list.columns.partner}</th>
                  <th className="hidden px-3 py-2.5 font-normal sm:table-cell">{list.columns.notice}</th>
                  <th className="px-5 py-2.5 text-right font-normal">{list.columns.ends}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule border-t border-rule">
                {list.rows.map((row) => (
                  <tr key={row.title}>
                    <td className="px-5 py-3 font-medium text-ink">
                      {row.title}
                      <span className="mt-0.5 block text-[12px] font-normal text-muted md:hidden">{row.partner}</span>
                    </td>
                    <td className="hidden px-3 py-3 text-muted md:table-cell">{row.partner}</td>
                    <td className="hidden px-3 py-3 text-muted sm:table-cell">{row.notice}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      <span
                        className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-medium ${URGENCY_CHIP[row.urgency]}`}
                      >
                        {row.ends}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>

        {/* One open alert: the date and type someone set on it by hand, and the answers a manager can give */}
        <figure aria-label={t.deadlines.alertLabel}>
          <div aria-hidden="true" className="overflow-hidden rounded-2xl bg-paper shadow-sheet">
            <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3.5">
              <span className="text-[13px] font-semibold text-ink">{alert.title}</span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
                <span className="h-2 w-2 rounded-full bg-beck" />
                {alert.status}
              </span>
            </div>
            <div className="px-5 py-4">
              <p className="text-[14px] font-medium text-ink">{alert.contract}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-beck">{alert.deadlineLabel}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="text-[17px] font-semibold text-ink">{alert.deadlineDate}</span>
                <span className="rounded-full border border-rule px-2 py-0.5 text-[11px] font-medium text-muted">
                  {alert.deadlineType}
                </span>
              </p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-muted">{alert.answerLabel}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {alert.actions.map((action) => (
                  <span key={action} className="rounded-full border border-rule px-3 py-1.5 text-[13px] font-medium text-ink">
                    {action}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-rule px-5 py-2.5 text-[12px] text-muted">{alert.log}</div>
          </div>
        </figure>
      </div>
    </Section>
  );
}
