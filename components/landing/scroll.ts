/**
 * Scrolls to a landing-page section, falling back to an instant jump when the
 * visitor prefers reduced motion (JS smooth scrolling ignores the CSS override).
 *
 * The click also moves keyboard focus into the section, the way a plain anchor
 * jump would. Without it a screen reader stays in the nav after "jumping", and
 * the next Tab continues at the top of the page.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
