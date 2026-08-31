/**
 * Scrolls to a landing-page section, falling back to an instant jump when the
 * visitor prefers reduced motion (JS smooth scrolling ignores the CSS override).
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}
