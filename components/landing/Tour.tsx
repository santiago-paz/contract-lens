'use client';

import { useRef } from 'react';

import { useLanguage } from './LanguageContext';
import { gsap, ScrollTrigger, useGSAP } from './motion/gsap';
import { NO_PREFERENCE } from './motion/media';
import { CheckScene } from './tour/CheckScene';
import { DecideScene } from './tour/DecideScene';
import { WatchScene } from './tour/WatchScene';

const INK = '#16181d';
const PAPER = '#ffffff';
const MUTED = '#5f6670';
const BECK = '#a3202f';
const RULE = '#e1e2dd';
const CLEAR_INK = 'rgba(22, 24, 29, 0)';

/** Height of one row of the expiring list, in px. The CSS fixes it, so the rows can collapse and return. */
const LIST_ROW = 56;

/**
 * The pinned tour: one window, three things a person does after the software
 * has read a file. They check and correct the record, watch the dates through
 * the list's filters, and decide on an alert.
 *
 * On a wide, tall screen the section becomes a runway with a sticky stage, and
 * one GSAP timeline, scrubbed by scroll, plays the three scenes in turn. The
 * scroll stays the browser's own: nothing here takes over the wheel, and the
 * visitor sets the pace. Everywhere else (a phone, a short window, reduced
 * motion) there is no runway: the steps stack, each with its scene in its
 * finished state. The markup is that finished, stacked state, so the section
 * reads the same with the script off.
 */
export function Tour() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const scenes = [<CheckScene key="check" />, <WatchScene key="watch" />, <DecideScene key="decide" />];

  useGSAP(
    () => {
      const section = sectionRef.current;
      const runway = section?.querySelector<HTMLElement>('[data-runway]');
      if (!section || !runway) return;

      const mm = gsap.matchMedia();
      mm.add(`(min-width: 1100px) and (min-height: 640px) and ${NO_PREFERENCE}`, () => {
        section.classList.add('tour-live');
        const q = gsap.utils.selector(section);

        const watch = q('[data-scene="watch"]');
        const decide = q('[data-scene="decide"]');
        const check = q('[data-scene="check"]');
        const copies = q('[data-copy]');
        const fills = q('[data-progress]');

        const rows = q('[data-check-row]') as HTMLElement[];
        const highlight = q('[data-hl]');
        const empty = q('[data-empty]');
        const typed = q('[data-typed]')[0] as HTMLElement;
        const save = q('[data-save]');
        const saveIdle = q('[data-save-idle]');
        const saveDone = q('[data-save-done]');

        const pills = q('[data-pill]');
        const listRows = q('[data-wrow]') as HTMLElement[];

        const chip = q('[data-chip="0"]');
        const events = q('[data-event]');
        const statusOpen = q('[data-status-open]');
        const statusClosed = q('[data-status-closed]');
        const dot = q('[data-dot]');

        const rowBox = rows.map((row) => ({ y: row.offsetTop, h: row.offsetHeight }));
        const typedWidth = typed.scrollWidth;
        const typedChars = (typed.textContent ?? '').length;

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: { trigger: runway, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
        });

        // --- starting state: the first scene, with the record as the software left it ---
        tl.set([watch, decide], { autoAlpha: 0, y: 28, scale: 0.985 }, 0)
          .set([copies[1], copies[2]], { opacity: 0.72 }, 0)
          .set(fills, { scaleX: 0 }, 0)
          .set(highlight, { opacity: 0, y: rowBox[0].y, height: rowBox[0].h }, 0)
          .set(empty, { display: 'inline' }, 0)
          .set(typed, { width: 0, borderRightColor: 'transparent' }, 0)
          .set(saveIdle, { autoAlpha: 1 }, 0)
          .set(saveDone, { autoAlpha: 0 }, 0)
          .set(pills, { backgroundColor: CLEAR_INK, color: MUTED }, 0)
          .set(pills[pills.length - 1], { backgroundColor: INK, color: PAPER }, 0)
          .set(statusOpen, { autoAlpha: 1 }, 0)
          .set(statusClosed, { autoAlpha: 0 }, 0)
          .set(dot, { backgroundColor: BECK }, 0)
          .set(chip, { backgroundColor: CLEAR_INK, color: INK, borderColor: RULE }, 0)
          .set([events[1], events[2]], { autoAlpha: 0, y: 8 }, 0);

        // --- the left column: the step in progress is lit, and its rail fills ---
        tl.fromTo(fills[0], { scaleX: 0 }, { scaleX: 1, duration: 3.7, ease: 'none' }, 0);
        tl.fromTo(fills[1], { scaleX: 0 }, { scaleX: 1, duration: 3.1, ease: 'none' }, 3.7);
        tl.fromTo(fills[2], { scaleX: 0 }, { scaleX: 1, duration: 3.2, ease: 'none' }, 6.8);
        tl.to(copies[0], { opacity: 0.72, duration: 0.5 }, 3.6).to(copies[1], { opacity: 1, duration: 0.5 }, 3.6);
        tl.to(copies[1], { opacity: 0.72, duration: 0.5 }, 6.7).to(copies[2], { opacity: 1, duration: 0.5 }, 6.7);

        // --- scene one: a person reads down the record, fills the empty field, and saves ---
        tl.to(highlight, { opacity: 1, duration: 0.25, ease: 'none' }, 0.1);
        rowBox.slice(1, 6).forEach((box, i) => {
          tl.to(highlight, { y: box.y, height: box.h, duration: 0.24, ease: 'power2.out' }, 0.45 + i * 0.26);
        });
        tl.to(highlight, { y: rowBox[6].y, height: rowBox[6].h, duration: 0.3, ease: 'power2.out' }, 1.95);
        tl.set(empty, { display: 'none' }, 2.25)
          .set(typed, { borderRightColor: INK }, 2.25)
          .to(typed, { width: typedWidth, duration: 0.8, ease: `steps(${typedChars})` }, 2.25)
          .set(typed, { borderRightColor: 'transparent' }, 3.1);
        tl.to(save, { scale: 0.94, duration: 0.12, ease: 'power2.out' }, 3.05).to(save, { scale: 1, duration: 0.25 }, 3.17);
        tl.to(saveIdle, { autoAlpha: 0, duration: 0.15 }, 3.15).to(saveDone, { autoAlpha: 1, duration: 0.2 }, 3.2);
        tl.to(highlight, { opacity: 0, duration: 0.3, ease: 'none' }, 3.2);

        // --- scene one hands over to scene two ---
        tl.to(check, { autoAlpha: 0, y: -28, scale: 0.985, duration: 0.7 }, 3.75);
        tl.to(watch, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }, 3.95);

        // --- scene two: the filters, one after another, ending on the 90-day list ---
        const pick = (index: number, at: number) =>
          pills.forEach((pill, i) => {
            tl.to(
              pill,
              { backgroundColor: i === index ? INK : CLEAR_INK, color: i === index ? PAPER : MUTED, duration: 0.25, ease: 'power1.out' },
              at,
            );
          });
        const gone = new Set<HTMLElement>();
        const collapse = (maxDays: number, at: number) =>
          listRows.forEach((row) => {
            if (Number(row.dataset.wrow) > maxDays && !gone.has(row)) {
              gone.add(row);
              tl.fromTo(
                row,
                { height: LIST_ROW, opacity: 1, borderBottomWidth: 1 },
                { height: 0, opacity: 0, borderBottomWidth: 0, duration: 0.4, ease: 'power2.inOut', immediateRender: false },
                at,
              );
            }
          });
        pick(2, 4.9);
        collapse(30, 4.95);
        pick(1, 5.5);
        collapse(7, 5.55);
        pick(3, 6.1);
        listRows.forEach((row) => {
          if (Number(row.dataset.wrow) > 7) {
            tl.fromTo(
              row,
              { height: 0, opacity: 0, borderBottomWidth: 0 },
              { height: LIST_ROW, opacity: 1, borderBottomWidth: 1, duration: 0.45, ease: 'power2.inOut', immediateRender: false },
              6.15,
            );
          }
        });

        // --- scene two hands over to scene three ---
        tl.to(watch, { autoAlpha: 0, y: -28, scale: 0.985, duration: 0.7 }, 6.85);
        tl.to(decide, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }, 7.05);

        // --- scene three: a manager answers, and the alert is closed, each step on record ---
        tl.to(chip, { backgroundColor: INK, color: PAPER, borderColor: INK, duration: 0.3 }, 7.95);
        tl.to(events[1], { autoAlpha: 1, y: 0, duration: 0.4 }, 8.4);
        tl.to(events[2], { autoAlpha: 1, y: 0, duration: 0.4 }, 9.0);
        tl.to(statusOpen, { autoAlpha: 0, duration: 0.25 }, 9.0)
          .to(statusClosed, { autoAlpha: 1, duration: 0.25 }, 9.0)
          .to(dot, { backgroundColor: INK, duration: 0.3 }, 9.0);

        // A short hold at the end, so the closed alert is on screen before the stage lets go.
        tl.to({}, { duration: 0.01 }, 10);

        // A scrubbed timeline draws nothing until the first scroll, so the starting state is
        // rendered now. The refresh then moves it to wherever the page is already scrolled.
        tl.progress(0);
        ScrollTrigger.refresh();

        return () => {
          section.classList.remove('tour-live');
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section id="how-it-works" ref={sectionRef} aria-labelledby="how-it-works-title" className="tour">
      <div data-runway className="tour-runway">
        <div className="tour-sticky tone-navy bg-navy text-paper">
          <div className="tour-inner mx-auto w-full max-w-[1200px] px-6">
            <header className="max-w-[40rem]">
              <h2 id="how-it-works-title" className="text-[1.875rem] leading-[1.1] sm:text-[2.5rem] lg:text-[2.75rem]">
                {t.tour.title}
              </h2>
              {/* Light text on navy reads thinner, so it gets a touch more weight, leading and tracking. */}
              <p className="mt-5 max-w-[36rem] text-lead font-[430] leading-[1.65] tracking-[0.005em] text-paper/75 lg:text-lead-lg">
                {t.tour.summary}
              </p>
            </header>

            <div className="tour-steps">
              {t.tour.steps.map((step, index) => (
                <div key={step.title} className="tour-step">
                  <div data-copy={index} className="tour-copy">
                    <span aria-hidden="true" className="tour-bar">
                      <span data-progress className="tour-bar-fill" />
                    </span>
                    <h3 className="text-title text-paper">
                      <span className="sr-only">
                        {t.tour.stepLabel.replace('{n}', String(index + 1)).replace('{total}', String(t.tour.steps.length))}
                        {': '}
                      </span>
                      {step.title}
                    </h3>
                    {/* Light text on navy reads thinner, so it gets a touch more weight, leading and tracking. */}
                    <p className="mt-2 max-w-[34rem] text-copy font-[430] leading-[1.65] tracking-[0.005em] text-paper/75">
                      {step.body}
                    </p>
                  </div>
                  {scenes[index]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
