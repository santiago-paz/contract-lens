'use client';

import { FileText } from 'lucide-react';

import { URGENCY_CHIP } from './chips';
import { useLanguage } from './LanguageContext';
import { Section } from './Section';

/** One tint per step, so the three cards read as three different moments. */
const TINT = ['bg-mist', 'bg-sand', 'bg-sage'] as const;

export function HowItWorks() {
  const { t } = useLanguage();
  const figures = [<UploadFigure key="upload" />, <RecordFigure key="record" />, <DatesFigure key="dates" />];

  return (
    <Section
      id="how-it-works"
      eyebrow={t.howItWorks.eyebrow}
      title={t.howItWorks.title}
      summary={t.howItWorks.summary}
      tone="ledger"
    >
      {/* The steps are a sequence, so they are numbered. */}
      <ol className="grid gap-5 md:grid-cols-3">
        {t.howItWorks.steps.map((step, index) => (
          <li key={step.title} className="flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper">
            <div aria-hidden="true" className={`flex h-56 items-center justify-center px-6 ${TINT[index]}`}>
              {figures[index]}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span aria-hidden="true" className="display text-[1.375rem] leading-none text-muted">
                {index + 1}
              </span>
              <h3 className="mt-3 text-[1.0625rem] font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** Step one: the file arrives and is recognised. */
function UploadFigure() {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-[17rem] rounded-xl border border-dashed border-ink/25 p-3 text-[12px]">
      <div className="flex items-center gap-3 rounded-lg bg-paper px-3 py-2.5 shadow-sheet">
        <FileText className="h-4 w-4 shrink-0 text-ink" />
        <span className="truncate font-medium text-ink">{t.extract.fileName}</span>
      </div>
      <div className="mt-3 flex items-center gap-2 px-1 text-muted">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-beck" />
        <span className="truncate">
          {t.extract.recognizedLabel} <span className="font-medium text-ink">{t.extract.recognized}</span>
        </span>
      </div>
    </div>
  );
}

/** Step two: two of the fields, and the one save that stores the record. */
function RecordFigure() {
  const { t } = useLanguage();
  const rows = [t.extract.fields[1], t.extract.fields[3]];
  return (
    <div className="w-full max-w-[18rem] rounded-xl bg-paper p-1 text-[12px] shadow-sheet">
      {rows.map((field) => (
        <div key={field.label} className="border-b border-rule px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-[0.12em] text-muted">{field.label}</div>
          <div className="mt-0.5 truncate font-medium text-ink">{field.value}</div>
        </div>
      ))}
      <div className="flex justify-end px-3 py-2">
        <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-medium text-paper">{t.howItWorks.saveRecord}</span>
      </div>
    </div>
  );
}

/** Step three: the list, sorted by what comes first. */
function DatesFigure() {
  const { t } = useLanguage();
  const rows = t.deadlines.list.rows.slice(0, 3);
  return (
    <div className="w-full max-w-[18rem] rounded-xl bg-paper p-1 text-[12px] shadow-sheet">
      {rows.map((row) => (
        <div key={row.title} className="flex items-center justify-between gap-3 border-b border-rule px-3 py-2.5 last:border-b-0">
          <span className="truncate font-medium text-ink">{row.title}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums ${URGENCY_CHIP[row.urgency]}`}>
            {row.ends}
          </span>
        </div>
      ))}
    </div>
  );
}
