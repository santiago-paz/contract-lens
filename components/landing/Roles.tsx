'use client';

import { useRef, useState } from 'react';

import { useLanguage } from './LanguageContext';
import { gsap, useGSAP } from './motion/gsap';
import { NO_PREFERENCE } from './motion/media';
import { Section } from './Section';
import { ROLE_ORDER, type Role } from './translations/types';

/**
 * Who can do what, as the product's permissions have it. The five roles run
 * from least to most access and each one can do what the ones before it can,
 * so the matrix fills in from the top left like a staircase. A tick is the
 * page's own mark: a tall one for "can", a short faint one for "cannot".
 *
 * The roles above the matrix are a control: pick one and its column is lit.
 * On a phone only the picked role's column shows, because five columns do not
 * fit, and the picker is what moves between them.
 */
export function Roles() {
  const { t } = useLanguage();
  const { names, capabilities } = t.roles;
  const [selected, setSelected] = useState<Role>('manager');
  const rootRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const has = (role: Role, from: Role) => ROLE_ORDER.indexOf(role) >= ROLE_ORDER.indexOf(from);

  // The ticks of the picked column stand up. The first time, every column does, as the matrix comes into view.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(NO_PREFERENCE, () => {
        const grow = (ticks: Element[]) =>
          gsap.fromTo(
            ticks,
            { scaleY: 0, transformOrigin: '50% 100%' },
            { scaleY: 1, duration: 0.5, ease: 'power3.out', stagger: 0.045, overwrite: 'auto' },
          );

        if (!first.current) {
          grow(gsap.utils.toArray(root.querySelectorAll(`[data-col="${selected}"] [data-on]`)));
          return;
        }
        const all = gsap.utils.toArray<Element>(root.querySelectorAll('[data-on]'));
        gsap.set(all, { scaleY: 0 });
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            first.current = false;
            io.disconnect();
            // Column by column, so the staircase builds from the left.
            ROLE_ORDER.forEach((role, i) => {
              gsap.fromTo(
                root.querySelectorAll(`[data-col="${role}"] [data-on]`),
                { scaleY: 0, transformOrigin: '50% 100%' },
                { scaleY: 1, duration: 0.5, ease: 'power3.out', stagger: 0.05, delay: i * 0.12 },
              );
            });
          },
          { threshold: 0.4 },
        );
        io.observe(root);
        return () => io.disconnect();
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [selected], revertOnUpdate: true },
  );

  return (
    <Section id="roles" title={t.roles.title} summary={t.roles.summary}>
      <div ref={rootRef}>
        <div role="group" aria-label={t.roles.selectLabel} className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-ledger p-1">
          {ROLE_ORDER.map((role) => (
            <button
              key={role}
              type="button"
              aria-pressed={selected === role}
              onClick={() => setSelected(role)}
              className={`rounded-full px-4 py-2 text-row font-medium transition-colors ${
                selected === role ? 'bg-paper text-ink shadow-[0_1px_2px_rgba(22,24,29,0.14)]' : 'text-muted hover:text-ink'
              }`}
            >
              {names[role]}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-paper">
          <table className="roles-table w-full border-collapse text-left">
            <caption className="sr-only">{t.roles.matrixLabel}</caption>
            <thead>
              <tr className="border-b border-rule">
                <th scope="col" className="px-5 py-3.5 text-[12px] font-normal text-muted">
                  <span className="sr-only">{t.roles.matrixLabel}</span>
                </th>
                {ROLE_ORDER.map((role) => (
                  <th
                    key={role}
                    scope="col"
                    data-col={role}
                    data-selected={selected === role || undefined}
                    className="roles-col px-2 py-3.5 text-center text-[13px] font-semibold text-ink"
                  >
                    {names[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {capabilities.map((capability) => (
                <tr key={capability.label} className="border-b border-rule last:border-b-0">
                  <th scope="row" className="px-5 py-3.5 text-row font-normal text-body">
                    {capability.label}
                  </th>
                  {ROLE_ORDER.map((role) => (
                    <td
                      key={role}
                      data-col={role}
                      data-selected={selected === role || undefined}
                      className="roles-col px-2 py-3.5 text-center"
                    >
                      {has(role, capability.from) ? (
                        <>
                          <span data-on aria-hidden="true" className="roles-tick roles-tick-on" />
                          <span className="sr-only">{t.roles.can}</span>
                        </>
                      ) : (
                        <>
                          <span aria-hidden="true" className="roles-tick roles-tick-off" />
                          <span className="sr-only">{t.roles.cannot}</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-[34rem] text-small text-muted">{t.roles.note}</p>
      </div>
    </Section>
  );
}
