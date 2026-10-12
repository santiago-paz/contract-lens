export {};

declare global {
  interface Window {
    /** Set once the landing's own code has started. Bootstrap.tsx reads it for its failsafe. */
    __landingReady?: boolean;
  }
}
