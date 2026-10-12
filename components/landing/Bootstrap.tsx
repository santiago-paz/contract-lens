/*
 * A server component that renders one inline script, before the landing's own
 * markup. It does two things.
 *
 * It adds `js` to <html>, which is what lets the CSS hold the hero's analysis
 * at its starting state until the motion code takes over. Without JS the class
 * never appears and the finished figure shows. And on the German page it sets
 * the document language, because the root layout says `en`.
 *
 * The failsafe: if the page's own code has not signalled `__landingReady`
 * after 4.5 seconds (a blocked or very slow bundle), the class comes off again
 * and the finished figure shows. Content never waits on a script that is not
 * coming.
 */
const script = (language: string) =>
  '(function(){var d=document.documentElement;d.classList.add("js");' +
  (language === 'en' ? '' : `d.lang=${JSON.stringify(language)};`) +
  'setTimeout(function(){if(!window.__landingReady)d.classList.remove("js")},4500)})();';

export function Bootstrap({ language }: { language: 'en' | 'de' }) {
  return <script dangerouslySetInnerHTML={{ __html: script(language) }} />;
}
