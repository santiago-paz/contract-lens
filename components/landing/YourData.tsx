'use client';

import { Lock } from 'lucide-react';
import { useRef } from 'react';

import { useLanguage } from './LanguageContext';
import { gsap, useGSAP } from './motion/gsap';
import { NO_PREFERENCE } from './motion/media';
import { Section } from './Section';

/**
 * Where a contract goes, drawn as the page's trust section. Four nodes (the
 * firm, Contract Lens, the outside AI providers, the database) and the lines
 * between them, each line labelled with what travels on it. The lock marks
 * exactly what the product encrypts before it writes: the file, the summary
 * and the conditions. The other fields travel on a plain line, because they
 * are not encrypted by the product, and the picture says so.
 *
 * Beside it, the same path in four steps. When the diagram scrolls into view
 * it plays once: each line fills in the direction the data moves, and the step
 * it belongs to lights up. Without the script, or with reduced motion, the
 * finished diagram shows, every line full.
 */
export function YourData() {
  const { t } = useLanguage();
  const { nodes, packets, steps } = t.yourData;
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(NO_PREFERENCE, () => {
        const q = gsap.utils.selector(root);
        const nodeEls = q('[data-node]');
        const link = (name: string) => q(`[data-link="${name}"]`);
        const nums = q('[data-fnum]');
        const rails = q('[data-frail]');
        const diagram = q('[data-flow]')[0];

        const lit = (index: number, at: number) =>
          nums.forEach((num, i) => {
            tl.to(num, { color: i === index ? '#16181d' : '#5f6670', duration: 0.3 }, at);
            tl.to(rails[i], { scaleY: i === index ? 1 : 0, duration: 0.4 }, at);
          });
        const glow = (name: string, at: number) =>
          tl.to(q(`[data-node="${name}"]`), { borderColor: '#16181d', duration: 0.3 }, at);

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
        tl.set(nodeEls, { autoAlpha: 0, y: 12 }, 0)
          .set([...link('file'), ...link('text'), ...link('fields'), ...link('store')], { '--p': 0 }, 0)
          .set(rails, { scaleY: 0 }, 0);

        tl.to(nodeEls, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1 }, 0.1);

        // 1. You upload the file.
        lit(0, 0.9);
        tl.to(link('file'), { '--p': 1, duration: 0.8, ease: 'power1.inOut' }, 1.0);
        glow('lens', 1.7);
        // 2. Contract Lens reads it: the text goes out, the filled-in fields come back.
        lit(1, 2.6);
        tl.to(link('text'), { '--p': 1, duration: 0.8, ease: 'power1.inOut' }, 2.7);
        glow('ai', 3.4);
        tl.to(link('fields'), { '--p': 1, duration: 0.8, ease: 'power1.inOut' }, 3.9);
        // 3. You check the record. Nothing is stored yet, so nothing moves.
        lit(2, 5.2);
        glow('firm', 5.3);
        // 4. You save: the file, the summary and the conditions go in encrypted, the other fields beside them.
        lit(3, 6.6);
        tl.to(link('store'), { '--p': 1, duration: 0.9, ease: 'power1.inOut' }, 6.7);
        glow('db', 7.5);

        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            tl.play();
          },
          { threshold: 0.4 },
        );
        io.observe(diagram);

        return () => io.disconnect();
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <Section id="your-data" title={t.yourData.title} summary={t.yourData.summary} tone="ledger">
      <div ref={rootRef}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-12">
          {/* The same path, in words */}
          <ol aria-label={t.yourData.stepsLabel} className="space-y-6 lg:col-span-5">
            {steps.map((step, index) => (
              <li key={step.title} data-fstep className="relative flex gap-4 pl-4">
                <span data-frail aria-hidden="true" className="flow-rail" />
                <span data-fnum aria-hidden="true" className="display w-5 shrink-0 text-[1.375rem] leading-none text-muted">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-title text-ink">{step.title}</h3>
                  <p className="mt-1.5 max-w-[30rem] text-copy text-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* The path, drawn */}
          <figure aria-label={t.yourData.figureLabel} className="lg:col-span-7">
            <div aria-hidden="true" data-flow className="flow">
              <div data-node="firm" className="flow-node" style={{ gridArea: 'firm' }}>
                <span className="flow-node-title">{nodes.firm}</span>
              </div>

              <div className="flow-links flow-links-fl" style={{ gridArea: 'fl' }}>
                <Link name="file" label={packets.file} axis="fl" />
              </div>

              <div data-node="lens" className="flow-node" style={{ gridArea: 'lens' }}>
                <span className="flow-node-title">{nodes.lens}</span>
              </div>

              <div className="flow-links flow-links-la" style={{ gridArea: 'la' }}>
                <Link name="text" label={packets.text} axis="x" />
                <Link name="fields" label={packets.fields} axis="x" back />
              </div>

              <div data-node="ai" className="flow-node" style={{ gridArea: 'ai' }}>
                <span className="flow-node-title">{nodes.ai}</span>
                <span className="flow-node-note">{nodes.aiNote}</span>
              </div>

              <div className="flow-links" style={{ gridArea: 'dll' }}>
                <span data-link="store" data-axis="y" className="flow-link">
                  <span className="flow-track">
                    <span className="flow-fill" />
                    <span className="flow-head" />
                  </span>
                </span>
              </div>
              {/* One line, two kinds of thing: only the first kind is locked. */}
              <div className="flow-chips" style={{ gridArea: 'dlc' }}>
                <span className="flow-chip flow-chip-locked">
                  <Lock className="h-3 w-3 shrink-0" strokeWidth={2} />
                  {packets.locked}
                </span>
                <span className="flow-chip">{packets.fields}</span>
              </div>

              <div data-node="db" className="flow-node" style={{ gridArea: 'db' }}>
                <span className="flow-node-title">{nodes.db}</span>
                <span className="flow-node-note">{nodes.dbNote}</span>
              </div>
            </div>
          </figure>
        </div>

        <dl className="mt-14 grid gap-x-10 gap-y-10 border-t border-rule pt-8 md:grid-cols-2">
          {t.yourData.facts.map((fact) => (
            <div key={fact.term}>
              <dt className="text-title text-ink">{fact.term}</dt>
              <dd className="mt-2 max-w-[34rem] text-copy text-body">{fact.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

/**
 * One line of the diagram. It fills in the direction the data moves: `--p` runs
 * from 0 to 1, and the CSS turns that into a scale from the line's tail. `back`
 * flips a horizontal line to point left.
 */
function Link({
  name,
  label,
  axis,
  back = false,
}: {
  name: string;
  label: string;
  axis: 'x' | 'fl';
  back?: boolean;
}) {
  return (
    <span data-link={name} data-axis={axis} data-back={back || undefined} className="flow-link">
      <span className="flow-label">{label}</span>
      <span className="flow-track">
        <span className="flow-fill" />
        <span className="flow-head" />
      </span>
    </span>
  );
}
