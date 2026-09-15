'use client';

import { motion } from 'framer-motion';

import { Extract } from './Extract';
import { useLanguage } from './LanguageContext';
import { EASE, group, rise } from './motion';
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

  return (
    <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div variants={group(0.08)} initial="hidden" animate="visible" className="mx-auto max-w-[56rem] text-center">
          <motion.p variants={rise} className="eyebrow">
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={rise}
            className="mx-auto mt-5 text-[2.625rem] leading-[1.05] sm:text-[3.5rem] lg:text-[4.25rem]"
          >
            {t.hero.titleLine1} {t.hero.titleLine2}
          </motion.h1>

          <motion.p
            variants={rise}
            className="mx-auto mt-6 max-w-[42rem] text-[1.0625rem] leading-[1.6] text-body lg:text-lg"
          >
            {t.hero.lead}
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#contact" onClick={go('contact')} className="btn btn-primary">
              {t.hero.cta}
            </a>
          </motion.div>
        </motion.div>

        {/* The figure sits where a photograph would: one large rounded panel, and the two sheets on it. */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
          className="mt-14 lg:mt-20"
          aria-label={t.hero.figureLabel}
        >
          <div className="rounded-[20px] bg-mist p-4 sm:p-8 lg:rounded-[28px] lg:p-12">
            <Extract />
          </div>
          <figcaption className="mx-auto mt-5 max-w-[44rem] text-center text-[13px] leading-[1.5] text-muted">
            {t.hero.figureCaption}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
