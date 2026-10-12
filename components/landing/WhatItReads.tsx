'use client';

import { Check, X } from 'lucide-react';
import { useId, useLayoutEffect, useRef, useState } from 'react';

import { useLanguage } from './LanguageContext';
import { gsap, useGSAP } from './motion/gsap';
import { NO_PREFERENCE } from './motion/media';
import { Section } from './Section';

/**
 * What the software reads: the checklist for each kind of contract, as a sample
 * record, with one field the contract left empty. A fourth tab shows what
 * happens with any other contract: the analysis stops with the product's own
 * message, and a person fills in the record by hand.
 *
 * The tabs are a segmented control with a sliding thumb. Choosing one fills the
 * sheet in field by field. The first time the sheet scrolls into view it fills
 * in once, the way a real analysis would.
 */
export function WhatItReads() {
  const { t } = useLanguage();
  const { types, other } = t.whatItReads;
  const tabs = [...types.map((type) => type.tab), other.tab];
  const [active, setActive] = useState(0);
  const baseId = useId();

  const tablistRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const seen = useRef(false);

  // The thumb sits under the active tab. Measured, so any tab width (German runs long) fits.
  useLayoutEffect(() => {
    const list = tablistRef.current;
    const tab = list?.querySelectorAll<HTMLElement>('[role="tab"]')[active];
    if (!list || !tab) return;
    const place = () => setThumb({ x: tab.offsetLeft, y: tab.offsetTop, w: tab.offsetWidth, h: tab.offsetHeight });
    place();
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active, tabs.length]);

  // The sheet fills in: once when it first scrolls into view, then on every change of tab.
  useGSAP(
    () => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const mm = gsap.matchMedia();
      mm.add(NO_PREFERENCE, () => {
        const rows = gsap.utils.toArray<Element>(sheet.querySelectorAll('[data-fill-row]'));
        const values = gsap.utils.toArray<Element>(sheet.querySelectorAll('[data-fill-value]'));
        const lines = gsap.utils.toArray<Element>(sheet.querySelectorAll('[data-fill-line]'));
        // A tab has either rows or lines, never both, so each tween guards its own list.
        const ifAny = (targets: Element[], run: (targets: Element[]) => void) => {
          if (targets.length) run(targets);
        };
        const play = () => {
          ifAny(rows, (els) =>
            gsap.fromTo(
              els,
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.06, overwrite: 'auto' },
            ),
          );
          ifAny(values, (els) =>
            gsap.fromTo(
              els,
              { clipPath: 'inset(0 100% 0 0)' },
              { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'power2.out', stagger: 0.06, delay: 0.1, overwrite: 'auto' },
            ),
          );
          ifAny(lines, (els) =>
            gsap.fromTo(
              els,
              { opacity: 0, y: 6 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.3, overwrite: 'auto' },
            ),
          );
        };

        if (seen.current) {
          play();
          return;
        }
        // The first time: hold the sheet at its start until it is on screen, then fill it in once.
        ifAny(rows, (els) => gsap.set(els, { opacity: 0 }));
        ifAny(values, (els) => gsap.set(els, { clipPath: 'inset(0 100% 0 0)' }));
        ifAny(lines, (els) => gsap.set(els, { opacity: 0 }));
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            seen.current = true;
            io.disconnect();
            play();
          },
          { threshold: 0.35 },
        );
        io.observe(sheet);
        return () => io.disconnect();
      });
      return () => mm.revert();
    },
    { scope: sheetRef, dependencies: [active], revertOnUpdate: true },
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const step = keys[event.key];
    if (step === undefined && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next =
      event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (active + step + tabs.length) % tabs.length;
    setActive(next);
    tablistRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };

  const type = types[active];

  return (
    <Section id="what-it-reads" title={t.whatItReads.title} summary={t.whatItReads.summary} layout="split" flip>
      <div>
        <div
          ref={tablistRef}
          role="tablist"
          aria-label={t.whatItReads.tabsLabel}
          onKeyDown={onKeyDown}
          className="relative inline-flex max-w-full flex-wrap gap-1 rounded-3xl bg-ledger p-1"
        >
          {thumb && (
            <span
              aria-hidden="true"
              className="tab-thumb"
              style={{ width: thumb.w, height: thumb.h, transform: `translate(${thumb.x}px, ${thumb.y}px)` }}
            />
          )}
          {tabs.map((label, index) => (
            <button
              key={label}
              id={`${baseId}-tab-${index}`}
              role="tab"
              type="button"
              aria-selected={active === index}
              aria-controls={`${baseId}-panel`}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              className={`relative z-[1] rounded-full px-4 py-2 text-row font-medium transition-colors ${
                active === index ? 'text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          ref={sheetRef}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="mt-5"
        >
          {type ? (
            <figure aria-label={`${t.whatItReads.sampleNote} ${type.name}`}>
              <div aria-hidden="true" className="overflow-hidden rounded-2xl bg-paper shadow-sheet">
                <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3.5">
                  <span className="text-[13px] font-semibold text-ink">{type.name}</span>
                  <span className="text-[12px] text-muted">{t.whatItReads.sampleNote}</span>
                </div>
                <dl className="px-5">
                  {type.fields.map((field) => (
                    <div
                      key={field.label}
                      data-fill-row
                      className="grid gap-x-4 gap-y-1 border-b border-rule py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:items-baseline"
                    >
                      <dt className="text-[12px] leading-[1.4] text-muted">{field.label}</dt>
                      <dd className="min-w-0 text-[14px] font-medium leading-[1.4] text-ink">
                        {field.value ? (
                          <span data-fill-value className="block">
                            {field.value}
                          </span>
                        ) : (
                          <span
                            data-fill-value
                            className="block rounded-[6px] border border-dashed border-rule-strong px-2.5 py-1 text-[13px] font-normal text-muted"
                          >
                            {t.whatItReads.notSpecified}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </figure>
          ) : (
            <figure aria-label={`${t.whatItReads.sampleNote} ${other.tab}`}>
              <div aria-hidden="true" className="overflow-hidden rounded-2xl bg-paper shadow-sheet">
                <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3.5">
                  <span className="text-[13px] font-semibold text-ink">{t.extract.title}</span>
                  <span className="text-[12px] text-muted">{t.whatItReads.sampleNote}</span>
                </div>
                <div className="flex items-center gap-3 border-b border-rule px-5 py-4">
                  <span className="min-w-0 truncate text-[13px] font-medium text-ink">{other.fileName}</span>
                </div>
                <ol className="space-y-2.5 px-5 py-4 text-[13px] leading-[1.45]">
                  {other.lines.map((line) => (
                    <li key={line} data-fill-line className="flex items-start gap-2.5">
                      <span className="mt-[3px] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      <span className="text-body">{line}</span>
                    </li>
                  ))}
                  <li data-fill-line className="flex items-start gap-2.5">
                    <span className="mt-[3px] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-beck text-paper">
                      <X className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span className="font-medium text-beck">{other.error}</span>
                  </li>
                </ol>
                <p data-fill-line className="border-t border-rule bg-ledger px-5 py-4 text-[13px] leading-[1.5] text-body">
                  {other.note}
                </p>
              </div>
            </figure>
          )}
        </div>

        <p className="mt-6 text-small text-muted">{t.whatItReads.footnote}</p>
      </div>
    </Section>
  );
}
