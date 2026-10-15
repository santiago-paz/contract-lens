'use client';

import { RotateCcw } from 'lucide-react';
import { useRef } from 'react';

import { ExtractSheets, stepLabel, TOTAL_STEPS } from './Extract';
import { useLanguage } from './LanguageContext';
import { MotionToggle } from './MotionToggle';
import { gsap, useGSAP } from './motion/gsap';
import { usePrefersReducedMotion } from './motion/media';
import { RulerField } from './webgl/RulerField';
import { rulerState } from './webgl/ruler-state';

/** Seconds from the start of the run at which log line 0..5 lands. */
const LINE_AT = [0.4, 0.9, 1.5, 2.0, 4.2, 4.6];
/** The fields fill in one by one while the details are being read. */
const FIELD_FROM = 2.4;
const FIELD_EVERY = 0.28;
/** Log lines that close a tracked step: the type is known, the details are read. */
const STEP_DONE_AT_LINE = [2, 4];

/**
 * The hero's stage: a navy panel holding the ruler field and the analysis of
 * one contract.
 *
 * The run is one GSAP timeline, played once the figure has settled: log lines
 * land, the fields fill in while the details are read, and "Save record" waits
 * for a person. It also drives the ruler field: a band sweeps across the ticks
 * while the software reads, and a ring spreads when the reading is done.
 * Reduced motion gets the finished figure and a still field.
 *
 * The markup is the finished state, so a visitor without the script sees the
 * finished figure. `data-run` on the figure hands control from the CSS (which
 * holds the starting state under `.js`) to the timeline.
 */
export function HeroStage() {
  const { t } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const run = runRef.current;
      if (!run) return;

      if (reduced) {
        run.dataset.run = 'done';
        return () => {
          delete run.dataset.run;
        };
      }

      const q = gsap.utils.selector(run);
      const lines = q('[data-line]');
      const lineTexts = q('[data-line-text]');
      const dots = q('[data-dot]');
      const values = q('[data-value]');
      const bars = q('[data-bar]');
      const fieldCount = values.length;
      const progress = q('[data-progress]');
      const stepEl = q('[data-step-label]')[0] as HTMLElement;
      const recognized = q('[data-recognized]');
      const closing = q('[data-summary], [data-foot]');
      const lastLine = LINE_AT[LINE_AT.length - 1];

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

      // Starting state, applied at time 0 so a replay resets it too.
      tl.set(lines, { autoAlpha: 0, y: 6 }, 0)
        .set(dots, { display: 'flex' }, 0)
        .set(progress, { scaleX: 0 }, 0)
        .set(recognized, { autoAlpha: 0 }, 0)
        .set(values, { clipPath: 'inset(0 100% 0 0)' }, 0)
        .set(bars, { opacity: 1 }, 0)
        .set(closing, { autoAlpha: 0, y: 8 }, 0)
        .set(rulerState, { sweep: -1, pulse: -1 }, 0)
        .call(
          () => {
            stepEl.textContent = stepLabel(t.extract.stepLabel, 0);
            run.classList.remove('is-waiting');
          },
          [],
          0,
        );

      // The log: each line is typed in by a wipe, and its dot turns into a check when the next one lands.
      LINE_AT.forEach((at, i) => {
        tl.to(lines[i], { autoAlpha: 1, y: 0, duration: 0.4 }, at);
        tl.fromTo(
          lineTexts[i],
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'power2.out' },
          at,
        );
        const settled = i + 1 < LINE_AT.length ? LINE_AT[i + 1] : at + 0.35;
        tl.set(dots[i], { display: 'none' }, settled);
      });

      STEP_DONE_AT_LINE.forEach((lineIndex, n) => {
        const at = LINE_AT[lineIndex];
        tl.to(progress, { scaleX: (n + 1) / TOTAL_STEPS, duration: 0.7, ease: 'power2.out' }, at);
        tl.call(
          () => {
            stepEl.textContent = stepLabel(t.extract.stepLabel, n + 1);
          },
          [],
          at,
        );
      });
      tl.to(recognized, { autoAlpha: 1, duration: 0.4 }, LINE_AT[2]);

      // The record fills in, a field every 280 ms.
      values.forEach((value, i) => {
        const at = FIELD_FROM + i * FIELD_EVERY;
        tl.to(bars[i], { opacity: 0, duration: 0.3, ease: 'none' }, at);
        tl.to(value, { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'power2.out' }, at);
      });
      tl.to(run.querySelectorAll('[data-summary]'), { autoAlpha: 1, y: 0, duration: 0.5 }, FIELD_FROM + fieldCount * FIELD_EVERY);

      // The handoff: the reading is done, so "Save record" appears and waits for a person.
      tl.to(run.querySelectorAll('[data-foot]'), { autoAlpha: 1, y: 0, duration: 0.45 }, lastLine + 0.1);
      tl.call(() => run.classList.add('is-waiting'), [], lastLine + 0.7);

      // The ruler field follows the story: a band while the software reads, a ring when it is done.
      tl.fromTo(
        rulerState,
        { sweep: 0 },
        { sweep: 1, duration: LINE_AT[4] - LINE_AT[2], ease: 'none', immediateRender: false },
        LINE_AT[2],
      );
      tl.set(rulerState, { sweep: -1 }, LINE_AT[4] + 0.05);
      tl.fromTo(
        rulerState,
        { pulse: 0 },
        { pulse: 1, duration: 1.9, ease: 'power1.out', immediateRender: false },
        lastLine,
      );
      tl.set(rulerState, { pulse: -1 }, lastLine + 1.95);
      tl.call(() => replayRef.current?.removeAttribute('data-hidden'), [], lastLine + 1);

      // Hidden until a run has finished, whatever a cleanup's callbacks did before this.
      replayRef.current?.setAttribute('data-hidden', 'true');
      tl.progress(0).pause();
      timelineRef.current = tl;
      run.dataset.run = 'play';

      // Start once the entrance has settled.
      const start = gsap.delayedCall(0.95, () => tl.play(0));

      return () => {
        start.kill();
        timelineRef.current = null;
        rulerState.sweep = -1;
        rulerState.pulse = -1;
        delete run.dataset.run;
        run.classList.remove('is-waiting');
      };
    },
    { scope: stageRef, dependencies: [reduced, t] },
  );

  const replay = () => {
    replayRef.current?.setAttribute('data-hidden', 'true');
    timelineRef.current?.restart();
  };

  return (
    <div ref={stageRef} className="hero-stage">
      <div className="hero-stage-bg" aria-hidden="true">
        <RulerField listenTo={stageRef} />
      </div>

      <figure className="hero-figure" aria-label={t.hero.figureLabel}>
        <div className="hero-float">
          <div ref={runRef} className="hero-run run" aria-hidden="true">
            <ExtractSheets />
          </div>
        </div>
        <figcaption className="hero-caption">{t.hero.figureCaption}</figcaption>
      </figure>

      <MotionToggle className="hero-motion" />

      {/* With reduced motion there is no run to replay, so there is no button. */}
      {!reduced && (
        <button ref={replayRef} type="button" data-hidden="true" onClick={replay} className="hero-replay">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          {t.hero.replay}
        </button>
      )}
    </div>
  );
}
