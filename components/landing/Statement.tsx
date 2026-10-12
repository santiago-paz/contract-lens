'use client';

import { useRef } from 'react';

import { useLanguage } from './LanguageContext';
import { gsap, SplitText, useGSAP } from './motion/gsap';
import { NO_PREFERENCE } from './motion/media';

/**
 * The questions every contract raises, set large, and the one line that says
 * what Contract Lens does about them. The words light up as the visitor scrolls
 * past, so the reading speed is theirs. Nothing moves on its own, and the text
 * never leaves its place: only its brightness follows the scroll.
 *
 * Without the script, or with reduced motion, the whole statement is simply lit.
 */
export function Statement() {
  const { t } = useLanguage();
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = textRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(NO_PREFERENCE, () => {
        const split = SplitText.create(el, { type: 'words' });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: 0.5 },
          },
        );
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: textRef },
  );

  return (
    <section aria-label={t.facts.label} className="bg-paper">
      <div className="mx-auto max-w-[1200px] px-6 py-24 lg:py-36">
        <p ref={textRef} className="display max-w-[58rem] text-[clamp(1.875rem,4.4vw,3.25rem)] leading-[1.14]">
          {t.facts.questions.join(' ')} <span className="mt-6 block">{t.facts.answer}</span>
        </p>
      </div>
    </section>
  );
}
