import { URGENCY_CHIP } from '@/components/landing/chips';
import { en } from '@/components/landing/translations/en';

/*
 * The screen that floats on the navy block: the product's list of expiring
 * contracts, drawn the way the landing's Deadlines section draws it. The rows
 * are the landing's own sample rows, so the two pages never drift apart, and
 * the partner sits under the title because this sheet is narrow at every width.
 */
const { list } = en.deadlines;

export function ExpiringSample() {
  return (
    <figure aria-label={en.deadlines.listLabel} className="w-full max-w-[26rem]">
      <div aria-hidden="true" className="overflow-hidden rounded-2xl bg-paper shadow-sheet">
        <div className="border-b border-rule px-5 py-3.5">
          <p className="text-[13px] font-semibold text-ink">{list.title}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted">
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
              <th className="px-5 py-2.5 text-right font-normal">{list.columns.ends}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule border-t border-rule">
            {list.rows.map((row) => (
              <tr key={row.title}>
                <td className="px-5 py-3 font-medium text-ink">
                  {row.title}
                  <span className="mt-0.5 block text-[12px] font-normal text-muted">{row.partner}</span>
                </td>
                <td className="px-5 py-3 text-right align-top tabular-nums">
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
      <figcaption className="mt-5 max-w-[24rem] text-small text-paper/68">
        Sample data. Contract Lens lists every contract that has ended or ends within 90 days.
      </figcaption>
    </figure>
  );
}
