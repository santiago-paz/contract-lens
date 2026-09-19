'use client';

import { Extract } from './Extract';
import { useLanguage } from './LanguageContext';
import { scrollToSection } from './scroll';

export function Hero() {
  const { t } = useLanguage();

  // Real anchors for semantics; the click scrolls with the page's own easing.
  const go = (id: string) => (event: React.MouseEvent) => {
    // A modified click (new tab, new window) keeps the browser's own behaviour.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    scrollToSection(id);
  };

  // The text and the figure are there from the first paint; only the analysis inside the figure moves.
  return (
    <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-[62rem] text-center">
          {/* One sentence per line. The clamp lets German fit a 320px phone; at 4rem each sentence holds one line from 1024px up. */}
          <h1 className="mx-auto text-[clamp(2rem,10.2vw,2.625rem)] leading-[1.05] sm:text-[3.5rem] lg:text-[4rem]">
            <span className="block">{t.hero.titleLine1}</span> <span className="block">{t.hero.titleLine2}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[36rem] text-lead text-body lg:text-lead-lg">{t.hero.lead}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#contact" onClick={go('contact')} className="btn btn-primary">
              {t.hero.cta}
            </a>
          </div>
        </div>

        {/* The figure sits where a photograph would: one large rounded panel, and the two sheets on it. */}
        <figure className="mt-14 lg:mt-20" aria-label={t.hero.figureLabel}>
          <div className="rounded-[20px] bg-mist p-4 sm:p-8 lg:rounded-[28px] lg:p-12">
            <Extract />
          </div>
          <figcaption className="mx-auto mt-5 max-w-[32rem] text-balance text-center text-small text-muted">
            {t.hero.figureCaption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
