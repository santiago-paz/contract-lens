'use client';

import { Check, FileText } from 'lucide-react';

import { useLanguage } from './LanguageContext';

/**
 * The hero figure: the analysis of one contract, as the product runs it. On
 * the left, the uploaded file and the progress log, step by step; on the
 * right, the record that comes back filled in. Nothing points from a field
 * into the document, because the product does not do that: it reads the whole
 * text, recognises the type, and fills in the checklist for that type.
 *
 * This file is markup only, in its finished state, so the page reads fine
 * without a script. The `data-*` attributes are the handles HeroStage's
 * timeline uses to play the run: log lines land, the fields fill in while the
 * details are read, and "Save record" waits for a person.
 */

export const TOTAL_STEPS = 2;

export const stepLabel = (template: string, done: number) =>
  template.replace('{done}', String(done)).replace('{total}', String(TOTAL_STEPS));

export function ExtractSheets() {
  const { t } = useLanguage();

  return (
    <>
      {/* The analysis: the file, and the log as it comes in */}
      <div className="hero-sheet hero-analysis overflow-hidden rounded-[14px] bg-paper">
        <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3">
          <span className="text-[13px] font-semibold text-ink">{t.extract.title}</span>
          <span data-step-label className="text-[12px] tabular-nums text-muted">
            {stepLabel(t.extract.stepLabel, TOTAL_STEPS)}
          </span>
        </div>
        <div className="h-[2px] bg-rule">
          <div data-progress className="h-full origin-left bg-ink/80" />
        </div>

        <div className="flex items-center gap-3 border-b border-rule px-5 py-4">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mist text-ink">
            <FileText className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-ink">{t.extract.fileName}</div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-muted">{t.extract.fileMeta}</div>
          </div>
        </div>

        <ol className="space-y-2.5 px-5 py-4 text-[13px] leading-[1.45]">
          {t.extract.lines.map((line, i) => (
            <li key={line} data-line={i} className="flex items-start gap-2.5">
              <span className="relative mt-[3px] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                <Check data-check className="h-2.5 w-2.5" strokeWidth={3} />
                <span data-dot className="absolute inset-0 hidden items-center justify-center rounded-full bg-mist">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" />
                </span>
              </span>
              <span data-line-text className="text-body">
                {line}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* The record, as it comes back */}
      <div className="hero-sheet hero-record overflow-hidden rounded-[14px] bg-paper">
        <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3">
          <span className="text-[13px] font-semibold text-ink">{t.extract.recordTitle}</span>
          <span data-recognized className="text-xs text-muted">
            {t.extract.recognizedLabel} <span className="font-medium text-ink">{t.extract.recognized}</span>
          </span>
        </div>

        <dl className="px-5">
          {t.extract.fields.map((field, i) => (
            <div
              key={field.label}
              data-field={i}
              className="grid gap-x-4 gap-y-0.5 border-b border-rule py-3 sm:grid-cols-[8.5rem_1fr] sm:items-baseline"
            >
              <dt className="text-[11px] uppercase tracking-[0.12em] text-muted">{field.label}</dt>
              <dd className="relative min-w-0 text-[14px] font-medium leading-[1.4] text-ink">
                <span data-value className="block">
                  {field.value}
                </span>
                <span
                  data-bar
                  className="absolute left-0 top-[0.4em] h-[0.65em] w-2/3 rounded-[2px] bg-rule/80"
                />
              </dd>
            </div>
          ))}
        </dl>

        <div data-summary className="bg-ledger px-5 py-4">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted">{t.extract.summaryLabel}</div>
          <p className="mt-1 text-[13px] leading-[1.5] text-body">{t.extract.summary}</p>
        </div>

        {/* The last beat: the reading stops here, and a person decides to save. */}
        <div data-foot className="flex justify-end border-t border-rule px-5 py-3">
          <span data-save className="hero-save rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium text-paper">
            {t.extract.saveRecord}
          </span>
        </div>
      </div>
    </>
  );
}
