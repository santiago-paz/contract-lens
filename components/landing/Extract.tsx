'use client';

import { useInView } from 'framer-motion';
import { Check, FileText } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

import { useLanguage } from './LanguageContext';

/**
 * The hero figure: the analysis of one contract, as the product runs it. On
 * the left, the uploaded file and the progress log, step by step; on the
 * right, the record that comes back filled in. Nothing points from a field
 * into the document, because the product does not do that: it reads the whole
 * text, recognises the type, and fills in the checklist for that type.
 *
 * The sequence runs once, when the figure comes into view: the log lines land
 * one at a time, the fields fill in while the details are being read, and the
 * count and "Done" close it. Reduced motion gets the finished figure.
 */

/** ms from the start at which log line 0..5 lands. */
const LINE_AT = [400, 900, 1500, 2000, 4200, 4600];
/** The fields fill in one by one while the details are being read. */
const FIELD_FROM = 2400;
const FIELD_EVERY = 280;
/** Log lines that close a tracked step: the type is known, the details are read. */
const STEP_DONE_AT_LINE = [2, 4];
const TOTAL_STEPS = STEP_DONE_AT_LINE.length;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const subscribeToMotionPreference = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

/**
 * The visitor's motion setting, read in a way that survives hydration: the
 * server has no media query, so it renders the figure before the run, and the
 * browser swaps to the finished one right after hydration.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

export function Extract() {
  const { t, language } = useLanguage();
  const skipRun = usePrefersReducedMotion();
  const figureRef = useRef<HTMLDivElement>(null);
  const inView = useInView(figureRef, { once: true, amount: 0.35 });
  const [reached, setReached] = useState(0);

  const fieldCount = t.extract.fields.length;
  const lastBeat = LINE_AT[LINE_AT.length - 1];

  const beats = useMemo(() => {
    const fieldBeats = Array.from({ length: fieldCount }, (_, i) => FIELD_FROM + i * FIELD_EVERY);
    return Array.from(new Set([...LINE_AT, ...fieldBeats])).sort((a, b) => a - b);
  }, [fieldCount]);

  useEffect(() => {
    if (skipRun || !inView) return;
    const timers = beats.map((ms) => setTimeout(() => setReached(ms), ms));
    return () => timers.forEach(clearTimeout);
  }, [beats, inView, skipRun]);

  // Reduced motion skips the run and shows the finished figure.
  const now = skipRun ? Infinity : reached;
  const lineOn = (i: number) => now >= LINE_AT[i];
  const fieldOn = (i: number) => now >= FIELD_FROM + i * FIELD_EVERY;
  const finished = now >= lastBeat;
  const latestLine = LINE_AT.reduce((latest, at, i) => (now >= at ? i : latest), -1);
  const stepsDone = STEP_DONE_AT_LINE.filter((line) => lineOn(line)).length;
  const stepLabel = t.extract.stepLabel.replace('{done}', String(stepsDone)).replace('{total}', String(TOTAL_STEPS));

  return (
    <div
      ref={figureRef}
      key={language}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-start lg:gap-x-10"
    >
      {/* The analysis: the file, and the log as it comes in */}
      <div aria-hidden="true" className="overflow-hidden rounded-[14px] bg-paper shadow-sheet">
        <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3">
          <span className="text-[13px] font-semibold text-ink">{t.extract.title}</span>
          <span className="text-[12px] tabular-nums text-muted">{stepLabel}</span>
        </div>
        <div className="h-[2px] bg-rule">
          <div
            className="h-full origin-left bg-ink/80 transition-transform duration-500 ease-out"
            style={{ transform: `scaleX(${stepsDone / TOTAL_STEPS})` }}
          />
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
          {t.extract.lines.map((line, i) => {
            const on = lineOn(i);
            const running = on && i === latestLine && !finished;
            return (
              <li
                key={line}
                className={`flex items-start gap-2.5 transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-0'}`}
              >
                <span
                  className={`mt-[3px] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${
                    running ? 'bg-ink/10' : 'bg-ink text-paper'
                  }`}
                >
                  {running ? (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" />
                  ) : (
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  )}
                </span>
                <span className={running ? 'text-ink' : 'text-body'}>{line}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* The record, as it comes back */}
      <div aria-hidden="true" className="overflow-hidden rounded-[14px] bg-paper shadow-sheet">
        <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3">
          <span className="text-[13px] font-semibold text-ink">{t.extract.recordTitle}</span>
          <span className={`text-xs text-muted transition-opacity duration-300 ${lineOn(2) ? 'opacity-100' : 'opacity-0'}`}>
            {t.extract.recognizedLabel} <span className="font-medium text-ink">{t.extract.recognized}</span>
          </span>
        </div>

        <dl className="px-5">
          {t.extract.fields.map((field, i) => (
            <div
              key={field.label}
              className="grid gap-x-4 gap-y-0.5 border-b border-rule py-3 sm:grid-cols-[9rem_1fr] sm:items-baseline"
            >
              <dt className="text-[11px] uppercase tracking-[0.12em] text-muted">{field.label}</dt>
              <dd className="relative min-w-0 text-[14px] font-medium leading-[1.4] text-ink">
                <span className={`transition-opacity duration-300 ${fieldOn(i) ? 'opacity-100' : 'opacity-0'}`}>
                  {field.value}
                </span>
                <span
                  className={`absolute left-0 top-[0.4em] h-[0.65em] w-2/3 rounded-[2px] bg-rule/80 transition-opacity duration-300 ${
                    fieldOn(i) ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              </dd>
            </div>
          ))}
        </dl>

        <div
          className={`bg-ledger px-5 py-4 transition-opacity duration-300 ${
            fieldOn(fieldCount - 1) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted">{t.extract.summaryLabel}</div>
          <p className="mt-1 text-[13px] leading-[1.5] text-body">{t.extract.summary}</p>
        </div>

        {/* The last beat: the reading stops here, and a person decides to save. */}
        <div
          className={`flex justify-end border-t border-rule px-5 py-3 transition-opacity duration-300 ${
            finished ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium text-paper">
            {t.extract.saveRecord}
          </span>
        </div>
      </div>
    </div>
  );
}
