'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { VIEWPORT, group, rise } from './motion';

type Tone = 'paper' | 'ledger' | 'navy';
type Layout = 'stack' | 'split' | 'center';

const TONE: Record<Tone, string> = {
  paper: 'bg-paper text-ink',
  ledger: 'bg-ledger text-ink',
  navy: 'tone-navy bg-navy text-paper',
};

/**
 * The page's section layout. A heading block names the section and sums it
 * up, and the content follows: below it (`stack`), beside it (`split`), or
 * under a centred heading (`center`). Sections sit on white, on the warm grey
 * band, or on the navy block, and the heading takes its colours from that.
 */
export function Section({
  id,
  eyebrow,
  title,
  summary,
  tone = 'paper',
  layout = 'stack',
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  summary?: string;
  tone?: Tone;
  layout?: Layout;
  children: ReactNode;
}) {
  const titleId = `${id}-title`;
  const onNavy = tone === 'navy';

  const header = (
    <motion.header
      variants={group()}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={
        layout === 'center'
          ? 'mx-auto max-w-[40rem] text-center'
          : layout === 'split'
            ? 'max-w-[36rem] lg:sticky lg:top-28 lg:self-start'
            : 'max-w-[40rem]'
      }
    >
      {eyebrow && (
        <motion.p variants={rise} className="eyebrow">
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={rise}
        id={titleId}
        className={`text-[2rem] leading-[1.1] sm:text-[2.5rem] lg:text-[2.75rem] ${eyebrow ? 'mt-4' : ''}`}
      >
        {title}
      </motion.h2>
      {summary && (
        <motion.p
          variants={rise}
          className={`mt-5 text-[1.0625rem] leading-[1.6] lg:text-lg ${onNavy ? 'text-paper/75' : 'text-body'}`}
        >
          {summary}
        </motion.p>
      )}
    </motion.header>
  );

  return (
    <section id={id} aria-labelledby={titleId} className={`relative scroll-mt-16 ${TONE[tone]}`}>
      {onNavy && <LedgerLines />}
      <div className="relative mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        {layout === 'split' ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-5">{header}</div>
            <div className="mt-12 lg:col-span-7 lg:mt-0">{children}</div>
          </div>
        ) : (
          <>
            {header}
            <div className="mt-12 lg:mt-16">{children}</div>
          </>
        )}
      </div>
    </section>
  );
}

/** Faint ruled lines in the corner of the navy blocks, like the lines of a form. */
function LedgerLines() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 hidden h-80 w-[34rem] lg:block"
      style={{
        backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.13) 0 1px, transparent 1px 16px)',
        maskImage: 'radial-gradient(farthest-side at 100% 0%, rgba(0,0,0,0.9), rgba(0,0,0,0))',
        WebkitMaskImage: 'radial-gradient(farthest-side at 100% 0%, rgba(0,0,0,0.9), rgba(0,0,0,0))',
      }}
    />
  );
}
