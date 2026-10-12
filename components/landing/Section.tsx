'use client';

import type { ReactNode } from 'react';

type Tone = 'paper' | 'ledger' | 'navy';
type Layout = 'stack' | 'split' | 'center';

const TONE: Record<Tone, string> = {
  paper: 'bg-paper text-ink',
  ledger: 'tone-ledger bg-ledger text-ink',
  navy: 'tone-navy bg-navy text-paper',
};

/**
 * The page's section layout. The headline names the section, a summary sums
 * it up, and the content follows: below it (`stack`), beside it (`split`), or
 * under a centred heading (`center`). Sections sit on white, on the warm grey
 * band, or on the navy block, and the heading takes its colours from that.
 * Headers do not animate in: the motion on this page belongs to the figures.
 */
export function Section({
  id,
  title,
  summary,
  tone = 'paper',
  layout = 'stack',
  flip = false,
  backdrop,
  children,
}: {
  id: string;
  title: string;
  summary?: string;
  tone?: Tone;
  layout?: Layout;
  /** In a split, puts the content on the left and the heading on the right. The heading still comes first in the document. */
  flip?: boolean;
  /** Sits behind the content, inside the section's own ground (the contact block's ruler field). */
  backdrop?: ReactNode;
  children: ReactNode;
}) {
  const titleId = `${id}-title`;
  const onNavy = tone === 'navy';

  const header = (
    <header
      className={
        layout === 'center'
          ? 'mx-auto max-w-[40rem] text-center'
          : layout === 'split'
            ? 'max-w-[36rem] lg:sticky lg:top-28 lg:self-start'
            : 'max-w-[40rem]'
      }
    >
      <h2 id={titleId} className="text-[1.875rem] leading-[1.1] sm:text-[2.5rem] lg:text-[2.75rem]">
        {title}
      </h2>
      {summary && (
        // Light text on navy reads thinner, so it gets a touch more weight, leading and tracking.
        <p
          className={`mt-5 max-w-[36rem] text-lead lg:text-lead-lg ${
            onNavy ? 'font-[430] leading-[1.65] tracking-[0.005em] text-paper/75' : 'text-body'
          }`}
        >
          {summary}
        </p>
      )}
    </header>
  );

  // No scroll margin on the section: `html` already carries scroll-padding-top
  // for the fixed bar, and the two would stack into a double offset.
  return (
    <section id={id} aria-labelledby={titleId} className={TONE[tone]}>
      {backdrop && <div className="contact-backdrop">{backdrop}</div>}
      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        {layout === 'split' ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className={`lg:col-span-5 ${flip ? 'lg:col-start-8 lg:row-start-1' : ''}`}>{header}</div>
            <div className={`mt-12 lg:col-span-7 lg:mt-0 ${flip ? 'lg:col-start-1 lg:row-start-1' : ''}`}>{children}</div>
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
