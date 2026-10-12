import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/*
 * One place that registers GSAP's plugins, so every section imports from here
 * and a plugin is never used before it is registered. GSAP is free to use,
 * including these plugins, under its standard no-charge licence.
 *
 * ScrollTrigger drives the tour and the statement from scroll position, and
 * SplitText splits the statement into words. useGSAP is the React hook: it scopes selectors to a ref and reverts
 * every tween and trigger on unmount, which keeps Strict Mode's double mount
 * and route changes from leaking.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
  // A phone's toolbar growing or shrinking is not a reason to rebuild every trigger.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Eases the page uses. Quick approach, soft stop; nothing bounces. */
export const EASES = {
  out: 'expo.out',
  soft: 'power3.out',
  inOut: 'power2.inOut',
} as const;
