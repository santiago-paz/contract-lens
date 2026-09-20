import Link from 'next/link';

import {
  MARK_CENTRE,
  MARK_LIT,
  MARK_LIT_FROM,
  MARK_LIT_TO,
  MARK_PATH,
  MARK_SHADE,
  MARK_TILE_RADIUS,
  MARK_VIEWBOX,
} from '@/lib/brand-mark';

/**
 * The gradient that lights the lens. Every mark on a page draws the same
 * fade, so they share one definition rather than one per instance.
 */
const LIT_ID = 'mark-lit';

/** The tile's box, which is the viewBox the path is drawn in. */
const BOX = MARK_CENTRE * 2;

type Tone = 'tile' | 'paper';

/**
 * The brand mark: the lens.
 *
 * On light ground it is the lens on an ink tile, lit from the top the way
 * every band on the page is. On dark ground the tile drops away and the lens
 * carries the mark on its own, in paper, because a second near-black box
 * inside a dark bar only muddies the edge.
 *
 * The lens is drawn at one size in both tones. Only its field comes and goes.
 */
export function Mark({ tone = 'tile', className = '' }: { tone?: Tone; className?: string }) {
  const hasTile = tone === 'tile';
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={MARK_VIEWBOX}
      className={`h-8 w-8 shrink-0 ${className}`}
    >
      {hasTile && (
        <>
          <defs>
            <linearGradient
              id={LIT_ID}
              x1={MARK_CENTRE}
              y1={MARK_LIT_FROM}
              x2={MARK_CENTRE}
              y2={MARK_LIT_TO}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--color-paper)" stopOpacity={MARK_LIT} />
              <stop offset="1" stopColor="var(--color-paper)" stopOpacity={MARK_SHADE} />
            </linearGradient>
          </defs>
          <rect width={BOX} height={BOX} rx={MARK_TILE_RADIUS} fill="var(--color-ink)" />
        </>
      )}
      <path
        fillRule="evenodd"
        d={MARK_PATH}
        fill={hasTile ? `url(#${LIT_ID})` : 'var(--color-paper)'}
      />
    </svg>
  );
}

export function Brand({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em] text-ink">
      <Mark />
      <span translate="no">Contract Lens</span>
    </Link>
  );
}
