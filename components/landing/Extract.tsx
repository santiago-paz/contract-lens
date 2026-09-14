'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useLanguage } from './LanguageContext';
import { EASE } from './motion';

/**
 * The hero figure: a specimen contract on the left, the record Contract Lens
 * fills in from it on the right, and a line from each highlighted passage to
 * the field it feeds. On wide screens the lines are measured from the live
 * layout and drawn as curves in the gutter; below that the columns stack and
 * the numbers on both sides carry the mapping.
 *
 * The sequence runs once, when the figure comes into view: the marks land one
 * at a time, each pulling its line and its value with it, and the notice date
 * arrives last. Reduced motion gets the finished figure.
 */

/** ms from the start at which mark 1..4 lands; the last entry is the notice date. */
const BEATS = [500, 1000, 1500, 2000, 2650];
const DONE = BEATS.length;
const FIELD_COUNT = 4;

const CONNECTORS_FROM = '(min-width: 1024px)';

export function Extract() {
  const { t, language } = useLanguage();
  const reduce = useReducedMotion();
  const figureRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const recordRef = useRef<HTMLDivElement>(null);
  const markRefs = useRef<(HTMLElement | null)[]>([]);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  const inView = useInView(figureRef, { once: true, amount: 0.35 });
  const [step, setStep] = useState(0);
  const [paths, setPaths] = useState<string[]>([]);

  // Reduced motion skips the run and shows the finished figure.
  const shown = reduce ? DONE : step;

  useEffect(() => {
    if (reduce || !inView) return;
    const timers = BEATS.map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce]);

  // Measure a line from the document's edge, level with the first line of each
  // mark, to the left edge of the field it feeds. Nothing here moves during the
  // sequence (values are laid out from the start and only revealed), so one
  // measurement per layout is enough.
  const measure = useCallback(() => {
    const figure = figureRef.current;
    const doc = docRef.current;
    const record = recordRef.current;
    if (!figure || !doc || !record) return;
    if (!window.matchMedia(CONNECTORS_FROM).matches) {
      setPaths([]);
      return;
    }

    const f = figure.getBoundingClientRect();
    const d = doc.getBoundingClientRect();
    const r = record.getBoundingClientRect();

    const next: string[] = [];
    for (let i = 0; i < FIELD_COUNT; i += 1) {
      const mark = markRefs.current[i];
      const row = rowRefs.current[i];
      if (!mark || !row) continue;
      const firstLine = mark.getClientRects()[0] ?? mark.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const x1 = d.right - f.left;
      const y1 = firstLine.top + firstLine.height / 2 - f.top;
      const x2 = r.left - f.left;
      const y2 = rowRect.top + rowRect.height / 2 - f.top;
      const pull = (x2 - x1) * 0.55;
      next.push(`M ${x1} ${y1} C ${x1 + pull} ${y1}, ${x2 - pull} ${y2}, ${x2} ${y2}`);
    }
    setPaths(next);
  }, []);

  // The observer delivers one notification as soon as it starts observing, so
  // it covers the first layout as well as every resize. Re-created on a
  // language change, because the text reflows. The serif's metrics shift once
  // the web font is in, which moves every line, hence the second pass.
  useLayoutEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    let cancelled = false;
    const observer = new ResizeObserver(() => measure());
    observer.observe(figure);
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [measure, language]);

  const on = (index: number) => shown > index;
  const doc = t.extract.doc;

  return (
    <div
      ref={figureRef}
      className="relative grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-x-24"
    >
      {/* The connectors, drawn in the gutter on wide screens only. */}
      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" aria-hidden="true">
        {paths.map((d, i) => (
          <motion.path
            key={`${language}-${i}`}
            d={d}
            fill="none"
            stroke="#a3202f"
            strokeWidth={1.25}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={on(i) ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          />
        ))}
      </svg>

      {/* The specimen document, set in the serif because it is a document */}
      <div
        ref={docRef}
        aria-hidden="true"
        className="relative rounded-[14px] bg-paper px-6 py-7 shadow-sheet sm:px-10 sm:py-9"
      >
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-rule pb-4 text-[11px] uppercase tracking-[0.14em] text-muted">
          <span className="truncate">{doc.fileName}</span>
          <span className="shrink-0">{doc.pageNote}</span>
        </div>

        <p className="text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-ink">{doc.title}</p>

        <div className="mt-5 space-y-3.5 font-serif text-[13.5px] leading-[1.6] text-ink/85 sm:text-[14px]">
          {doc.paragraphs.map((paragraph, pIndex) => (
            <p key={pIndex}>
              {paragraph.heading && <span className="font-semibold text-ink">{paragraph.heading} </span>}
              {paragraph.segments.map((segment, sIndex) => {
                if (typeof segment === 'string') return <span key={sIndex}>{segment}</span>;
                const active = on(segment.mark);
                return (
                  <span
                    key={sIndex}
                    ref={(el) => {
                      markRefs.current[segment.mark] = el;
                    }}
                    className={`mark ${active ? 'is-on' : ''}`}
                  >
                    <Badge index={segment.mark} active={active} />
                    {segment.text}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      </div>

      {/* The record */}
      <div ref={recordRef} aria-hidden="true" className="self-start overflow-hidden rounded-[14px] bg-paper shadow-sheet">
        <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3">
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted">{t.extract.recordTitle}</span>
          <span className="text-xs text-muted">
            {t.extract.recognizedLabel} <span className="font-medium text-ink">{t.extract.recognized}</span>
          </span>
        </div>

        <dl className="px-5">
          {t.extract.fields.map((field, i) => (
            <div
              key={field.label}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="grid grid-cols-[1.25rem_1fr] gap-x-2.5 border-b border-rule py-3.5 last:border-b-0"
            >
              <Badge index={i} active={on(i)} className="mt-[3px]" />
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-[0.12em] text-muted">{field.label}</dt>
                <dd className="relative mt-1 text-[15px] font-medium leading-[1.4] tabular-nums text-ink">
                  <span className={`transition-opacity duration-300 ${on(i) ? 'opacity-100' : 'opacity-0'}`}>
                    {field.value}
                  </span>
                  <span
                    className={`absolute left-0 top-[0.4em] h-[0.65em] w-2/3 rounded-[2px] bg-rule/80 transition-opacity duration-300 ${
                      on(i) ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <motion.div
          initial={false}
          animate={shown >= DONE ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-start gap-3 border-t border-rule bg-beck-tint px-5 py-4"
        >
          <span className="mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full bg-beck" />
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-beck">{t.extract.deadlineLabel}</div>
            <div className="mt-0.5 text-[17px] font-semibold text-ink">{t.extract.deadlineDate}</div>
            <div className="mt-0.5 text-xs text-muted">{t.extract.alertNote}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** The circled number that pairs a passage with its field. */
function Badge({ index, active, className = '' }: { index: number; active: boolean; className?: string }) {
  return (
    <span
      className={`mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full border font-ui text-[10px] font-medium leading-none transition-colors duration-300 ${
        active ? 'border-beck bg-paper text-beck' : 'border-rule bg-paper text-muted'
      } ${className}`}
      style={{ verticalAlign: '2px' }}
    >
      {index + 1}
    </span>
  );
}
