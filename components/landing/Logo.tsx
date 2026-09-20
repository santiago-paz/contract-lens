import Link from 'next/link';

import { MARK_PATH, MARK_VIEWBOX } from '@/lib/brand-mark';

/** The brand mark: the section sign, drawn, on the red of the commentaries. */
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={MARK_VIEWBOX}
      className={`h-8 w-8 shrink-0 ${className}`}
    >
      <circle cx="32" cy="32" r="32" fill="var(--color-beck)" />
      <path d={MARK_PATH} fill="var(--color-paper)" />
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
