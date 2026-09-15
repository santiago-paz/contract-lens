'use client';

import Link from 'next/link';

import { useLanguage } from './LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Brand } from './Logo';

export function Footer() {
  const { t } = useLanguage();

  const sections = [
    ['how-it-works', t.nav.howItWorks],
    ['what-it-reads', t.nav.whatItReads],
    ['deadlines', t.nav.deadlines],
    ['confidentiality', t.nav.confidentiality],
  ] as const;

  return (
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Brand />
            <p className="mt-4 text-[15px] leading-[1.6] text-muted">{t.footer.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-[14px]">
            <nav aria-label="Sections" className="flex flex-col gap-3">
              {sections.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="text-body underline-offset-4 hover:text-ink hover:underline">
                  {label}
                </a>
              ))}
            </nav>
            <nav aria-label="Account" className="flex flex-col gap-3">
              <Link href="/login" className="text-body underline-offset-4 hover:text-ink hover:underline">
                {t.nav.signIn}
              </Link>
              <a href="#contact" className="text-body underline-offset-4 hover:text-ink hover:underline">
                {t.nav.requestDemo}
              </a>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-rule py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {t.footer.copyright}
          </span>
          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}
