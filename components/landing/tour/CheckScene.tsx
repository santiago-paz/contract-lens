'use client';

import { Check } from 'lucide-react';

import { useLanguage } from '../LanguageContext';

/**
 * The sample contract, as the file preview shows it. It is German on both pages
 * because the contract is: it belongs to a German firm. The text carries no
 * marks and nothing points from it to the record, because the product does not
 * link fields to passages. It is a preview of the file, set next to the record.
 */
const PREVIEW = {
  title: 'Dienstleistungsvertrag',
  between: ['zwischen', 'Habermann Logistik GmbH, Hamburg (Auftraggeber)', 'und', 'Nordlicht Software GmbH, Kiel (Auftragnehmer)'],
  clauses: [
    {
      heading: '§ 1 Gegenstand',
      body: 'Der Auftragnehmer betreibt und wartet das Lagerverwaltungssystem des Auftraggebers.',
    },
    {
      heading: '§ 2 Laufzeit und Kündigung',
      body: 'Der Vertrag beginnt am 1. Januar 2025 und läuft 24 Monate. Er verlängert sich jeweils um zwölf Monate, wenn ihn nicht eine Partei mit einer Frist von drei Monaten zum Ende der Laufzeit kündigt.',
    },
    {
      heading: '§ 3 Haftung',
      body: 'Die Haftung ist je Vertragsjahr auf 50.000 EUR begrenzt.',
    },
  ],
} as const;

/**
 * Tour scene one: a person checks the record next to the file, fills the one
 * field the contract left empty, and saves. The markup is the finished state
 * (value typed in, "Saved"); Tour.tsx plays it back from the start on scroll.
 */
export function CheckScene() {
  const { t } = useLanguage();
  const { check } = t.tour;

  return (
    <figure aria-label={check.figureLabel} className="tour-scene" data-scene="check">
      <div aria-hidden="true" className="tour-window">
        <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3">
          <span className="text-[13px] font-semibold text-ink">{check.title}</span>
          <span className="truncate text-[12px] text-muted">{t.extract.fileName}</span>
        </div>

        <div className="grid sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)]">
          {/* The file, as the preview shows it */}
          <div className="flex flex-col border-b border-rule bg-mist p-4 sm:border-b-0 sm:border-r">
            <div className="min-h-[15.5rem] flex-1 overflow-hidden rounded-lg bg-paper px-4 py-4 shadow-[0_1px_2px_rgba(26,39,66,0.12)]">
              <div className="h-full overflow-hidden text-[10px] leading-[1.5] text-body">
                <p className="text-[12px] font-semibold text-ink">{PREVIEW.title}</p>
                <div className="mt-2 space-y-0.5">
                  {PREVIEW.between.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                {PREVIEW.clauses.map((clause) => (
                  <div key={clause.heading} className="mt-3">
                    <p className="font-semibold text-ink">{clause.heading}</p>
                    <p className="mt-0.5">{clause.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted">
              <span>{check.previewLabel}</span>
              <span className="tabular-nums">{check.pageLabel}</span>
            </div>
          </div>

          {/* The record: every value can be changed, and nothing is stored until Save */}
          <div className="flex min-w-0 flex-col">
            <dl data-rows className="relative px-5">
              <span data-hl aria-hidden="true" className="tour-hl" />
              {t.extract.fields.map((field) => (
                <div key={field.label} data-check-row className="tour-row">
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-muted">{field.label}</dt>
                  <dd className="min-w-0 text-[14px] font-medium leading-[1.35] text-ink">{field.value}</dd>
                </div>
              ))}
              <div data-check-row data-payment className="tour-row">
                <dt className="text-[11px] uppercase tracking-[0.12em] text-muted">{check.paymentLabel}</dt>
                <dd className="min-w-0 text-[14px] font-medium leading-[1.35] text-ink">
                  <span data-empty className="hidden font-normal italic text-muted">
                    {check.paymentEmpty}
                  </span>
                  <span data-typed className="tour-typed">
                    {check.paymentValue}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-auto flex justify-end border-t border-rule px-5 py-3">
              {/* The idle label and the saved label share one cell, so the button never changes width. */}
              <span data-save className="tour-save inline-grid rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium text-paper">
                <span data-save-idle className="invisible col-start-1 row-start-1 text-center">
                  {t.extract.saveRecord}
                </span>
                <span data-save-done className="col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5">
                  <Check className="h-3 w-3" strokeWidth={3} />
                  {check.saved}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
