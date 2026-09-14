import type { Variants } from 'framer-motion';

/**
 * Motion for the landing page. There is one orchestrated moment, the hero
 * figure filling in, and it lives in Extract.tsx. Everything else is a short
 * rise as a section header enters, on one curve, so the figure is the only
 * thing that reads as animation.
 */

/** Quick approach, soft stop. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DUR = {
  quick: 0.28,
  base: 0.45,
} as const;

/** Fire once, a quarter of the way in. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

export const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.base, ease: EASE } },
};

/** Parent for `rise` or `fade` children; the stagger lives here, not in per-child delays. */
export function group(stagger = 0.08, delayChildren = 0): Variants {
  return { hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren } } };
}
