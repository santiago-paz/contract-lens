import { useSyncExternalStore } from 'react';

/**
 * A media query, read in a way that survives hydration. The server has no
 * viewport and no preferences, so it answers `false`, and the browser swaps in
 * the real answer right after hydration. Anything that must not flash reads the
 * query again inside an effect instead.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
export const NO_PREFERENCE = '(prefers-reduced-motion: no-preference)';
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';
/** Wide enough for the hero's two-column stage. (The pinned tour is a little narrower: 1100px.) */
export const WIDE = '(min-width: 1200px)';

export const usePrefersReducedMotion = () => useMediaQuery(REDUCED_MOTION);
