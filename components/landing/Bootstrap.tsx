/*
 * A server component that renders one inline script, before the landing's own
 * markup. It adds `js` to <html>, which is what lets the CSS hold the hero's
 * analysis at its starting state until the motion code takes over. Without JS
 * the class never appears and the finished figure shows.
 *
 * The failsafe: if the page's own code has not signalled `__landingReady` after
 * 4.5 seconds (a blocked or very slow bundle), the class comes off again and
 * the finished figure shows. Content never waits on a script that is not coming.
 */
const SCRIPT =
  '(function(){var d=document.documentElement;d.classList.add("js");' +
  'setTimeout(function(){if(!window.__landingReady)d.classList.remove("js")},4500)})();';

export function Bootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
