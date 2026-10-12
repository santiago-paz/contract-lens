import { useSyncExternalStore } from 'react';

/**
 * The visitor's "pause motion" choice, shared by everything on the page that
 * moves on its own: the two WebGL ruler fields and the pulse on "Save record".
 * Anything that runs longer than five seconds beside other content needs a way
 * to stop it (WCAG 2.2.2), whatever the system's reduced-motion setting says.
 *
 * It lives outside React so the WebGL loop can read it every frame. React reads
 * it through useSyncExternalStore, and `data-motion-paused` on <html> lets the
 * CSS stop its own loops.
 */
let paused = false;
const listeners = new Set<() => void>();

export const motionPause = {
  get: () => paused,
  set(next: boolean) {
    paused = next;
    if (next) document.documentElement.setAttribute('data-motion-paused', '');
    else document.documentElement.removeAttribute('data-motion-paused');
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export const usePausedMotion = () => useSyncExternalStore(motionPause.subscribe, motionPause.get, () => false);
