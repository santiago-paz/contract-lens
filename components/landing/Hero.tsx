'use client';

import type { CSSProperties } from 'react';

import { HeroStage } from './HeroStage';
import { useLanguage } from './LanguageContext';
import { scrollToSection } from './scroll';

/** Position in an entrance sequence, read by the `hero-line` and `hero-fade` rules in landing.css. */
const at = (index: number) => ({ '--i': index }) as CSSProperties;

export function Hero() {
  const { t } = useLanguage();

  // Real anchors for semantics; the click scrolls with the page's own easing.
  const go = (id: string) => (event: React.MouseEvent) => {
    // A modified click (new tab, new window) keeps the browser's own behaviour.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    scrollToSection(id);
  };

  // The text is there from the first paint and rises into place once, in CSS, so
  // it never waits for a script. Only the analysis inside the stage is scripted.
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <h1
            id="hero-title"
            className="max-w-[11em] text-[clamp(2.25rem,9.6vw,2.625rem)] leading-[1.04] sm:text-[3.25rem] min-[1100px]:text-[clamp(3rem,3.9vw,3.75rem)]"
          >
            <span className="hero-line" style={at(0)}>
              <span>{t.hero.titleLine1}</span>
            </span>
            <span className="hero-line" style={at(1)}>
              <span>{t.hero.titleLine2}</span>
            </span>
          </h1>

          <p className="hero-fade mt-6 max-w-[27rem] text-lead text-body lg:text-lead-lg" style={at(2)}>
            {t.hero.lead}
          </p>

          <div className="hero-fade mt-8 flex flex-wrap items-center gap-x-7 gap-y-4" style={at(3)}>
            <a href="#contact" onClick={go('contact')} className="btn btn-primary">
              {t.hero.cta}
            </a>
            <a
              href="#how-it-works"
              onClick={go('how-it-works')}
              className="text-row font-medium text-ink underline decoration-rule-strong decoration-1 underline-offset-[7px] transition-colors hover:decoration-ink"
            >
              {t.hero.secondary}
            </a>
          </div>
        </div>

        <HeroStage />
      </div>
    </section>
  );
}
