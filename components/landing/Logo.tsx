import Link from 'next/link';

/** The brand mark: the section sign on the red of the commentaries. */
export function Mark({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-beck font-serif text-[19px] font-semibold leading-none text-paper ${className}`}
    >
      §
    </span>
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
