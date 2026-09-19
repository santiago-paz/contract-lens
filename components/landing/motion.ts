/**
 * Motion for the landing page. The one authored moment is the hero figure
 * filling in, and it lives in Extract.tsx. Everything else on the page is
 * there from the first paint; only state changes move (the mobile menu, the
 * contact form turning into its sent note), on this one curve.
 */

/** Quick approach, soft stop. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DUR = {
  quick: 0.28,
} as const;
