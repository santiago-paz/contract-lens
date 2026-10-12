'use client';

import { Lock } from 'lucide-react';
import { useRef } from 'react';

import { useLanguage } from './LanguageContext';
import { gsap, useGSAP } from './motion/gsap';
import { NO_PREFERENCE } from './motion/media';
import { Section } from './Section';

const PALE = 'rgba(255, 255, 255, 0.62)';

/** Node titles may break between words: on a phone the card is narrower than "Contract Lens" set on one line. */
const breakable = (text: string) => text.replace(/\u00a0/g, ' ');

/**
 * Where a contract goes, drawn as the page's trust section on a navy layer.
 * Four nodes (the firm, Contract Lens, the outside AI providers, the database)
 * and the lines between them, each line labelled with what travels on it. The
 * lock marks exactly what the product encrypts before it writes: the file, the
 * summary and the conditions. The other fields travel beside them in an
 * outlined chip, because the product does not encrypt them, and the picture
 * says so.
 *
 * Under the diagram, the same path in four steps. When the diagram scrolls into
 * view it plays once: each line fills in the direction the data moves, and the
 * step it belongs to lights up, its bar filling. The nodes are always there;
 * only the flow between them is drawn in. Without the script, or with reduced
 * motion, the finished diagram shows, every line full and every step lit.
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
        const link = (name: string) => q(`[data-link="${name}"]`);
        const nums = q('[data-fnum]');
        const bars = q('[data-fbar]');
        const lamps = q('[data-lamp]');
        const diagram = q('[data-flow]')[0];

        // Steps up to this one are lit, the ones after it wait.
        const lit = (index: number, at: number) =>
          nums.forEach((num, i) => {
            tl.to(num, { color: i <= index ? '#ffffff' : PALE, duration: 0.3 }, at);
            tl.to(bars[i], { scaleX: i <= index ? 1 : 0, duration: 0.5 }, at);
          });
        const glow = (name: string, at: number) =>
          tl.to(q(`[data-node="${name}"] [data-lamp]`), { backgroundColor: '#16181d', borderColor: '#16181d', duration: 0.3 }, at);

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
        tl.set([...link('file'), ...link('text'), ...link('fields'), ...link('store')], { '--p': 0 }, 0)
          .set(bars, { scaleX: 0 }, 0)
          .set(nums, { color: PALE }, 0)
          .set(lamps, { backgroundColor: 'rgba(22, 24, 29, 0)', borderColor: '#8f949b' }, 0);

        // 1. You upload the file.
        lit(0, 0.4);
        tl.to(link('file'), { '--p': 1, duration: 0.8, ease: 'power1.inOut' }, 0.5);
        glow('firm', 0.4);
        glow('lens', 1.3);
        // 2. Contract Lens reads it: the text goes out, the filled-in fields come back.
        lit(1, 2.2);
        tl.to(link('text'), { '--p': 1, duration: 0.8, ease: 'power1.inOut' }, 2.3);
        glow('ai', 3.0);
        tl.to(link('fields'), { '--p': 1, duration: 0.8, ease: 'power1.inOut' }, 3.5);
        // 3. You check the record. Nothing is stored yet, so nothing moves.
        lit(2, 4.8);
        // 4. You save: the file, the summary and the conditions go in encrypted, the other fields beside them.
        lit(3, 6.2);
        tl.to(link('store'), { '--p': 1, duration: 0.9, ease: 'power1.inOut' }, 6.3);
        glow('db', 7.1);

        // A paused timeline draws nothing until it plays, so the start state is rendered now.
        tl.progress(0);

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
    <Section id="your-data" title={t.yourData.title} summary={t.yourData.summary} tone="navy">
      <div ref={rootRef}>
        {/* The path, drawn */}
        <figure aria-label={t.yourData.figureLabel}>
          <div aria-hidden="true" data-flow className="flow">
            <div data-node="firm" className="flow-node" style={{ gridArea: 'firm' }}>
              <span data-lamp className="flow-lamp" />
              <span className="flow-node-title">{breakable(nodes.firm)}</span>
            </div>

            <div className="flow-links" style={{ gridArea: 'fl' }}>
              <Link name="file" label={packets.file} axis="fl" />
            </div>

            <div data-node="lens" className="flow-node" style={{ gridArea: 'lens' }}>
              <span data-lamp className="flow-lamp" />
              <span className="flow-node-title">{breakable(nodes.lens)}</span>
            </div>

            <div className="flow-links" style={{ gridArea: 'la' }}>
              <Link name="text" label={packets.text} axis="x" />
              <Link name="fields" label={packets.fields} axis="x" back />
            </div>

            <div data-node="ai" className="flow-node" style={{ gridArea: 'ai' }}>
              <span data-lamp className="flow-lamp" />
              <span className="flow-node-title">{breakable(nodes.ai)}</span>
              <span className="flow-node-note">{breakable(nodes.aiNote)}</span>
            </div>

            <div className="flow-links" style={{ gridArea: 'dll' }}>
              <span data-link="store" data-axis="y" className="flow-link">
                <span className="flow-track">
                  <span className="flow-fill" />
                  <span className="flow-head" />
                </span>
                {/* One line, two kinds of thing: only the first kind is locked. The chips hang off the line. */}
                <span className="flow-chips">
                  <span className="flow-chip flow-chip-locked">
                    <Lock className="h-3 w-3 shrink-0" strokeWidth={2} />
                    {packets.locked}
                  </span>
                  <span className="flow-chip">{packets.fields}</span>
                </span>
              </span>
            </div>

            <div data-node="db" className="flow-node" style={{ gridArea: 'db' }}>
              <span data-lamp className="flow-lamp" />
              <span className="flow-node-title">{breakable(nodes.db)}</span>
              <span className="flow-node-note">{breakable(nodes.dbNote)}</span>
            </div>
          </div>
        </figure>

        {/* The same path, in words, one step under another */}
        <ol aria-label={t.yourData.stepsLabel} className="mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="relative pt-5">
              <span aria-hidden="true" className="step-bar">
                <span data-fbar className="step-bar-fill" />
              </span>
              <span data-fnum aria-hidden="true" className="display block text-[1.375rem] leading-none text-paper">
                {index + 1}
              </span>
              <h3 className="mt-3 text-title text-paper">{step.title}</h3>
              {/* Light text on navy reads thinner, so it gets a touch more weight, leading and tracking. */}
              <p className="mt-1.5 max-w-[22rem] text-copy font-[430] leading-[1.65] tracking-[0.005em] text-paper/75">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <dl className="mt-14 grid gap-x-10 gap-y-10 border-t border-paper/20 pt-8 md:grid-cols-2">
          {t.yourData.facts.map((fact) => (
            <div key={fact.term}>
              <dt className="text-title text-paper">{fact.term}</dt>
              <dd className="mt-2 max-w-[34rem] text-copy font-[430] leading-[1.65] tracking-[0.005em] text-paper/75">
                {fact.body}
              </dd>
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
