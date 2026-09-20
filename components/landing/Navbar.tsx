'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useLanguage } from './LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Brand } from './Logo';
import { DUR, EASE } from './motion';
import { scrollToSection } from './scroll';

const SECTIONS = ['how-it-works', 'what-it-reads', 'deadlines', 'confidentiality'] as const;
type SectionId = (typeof SECTIONS)[number];

export function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const labels: Record<SectionId, string> = {
    'how-it-works': t.nav.howItWorks,
    'what-it-reads': t.nav.whatItReads,
    deadlines: t.nav.deadlines,
    confidentiality: t.nav.confidentiality,
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Real anchors for semantics; the click scrolls with the page's own easing.
  const go = (id: string) => (event: React.MouseEvent) => {
    // A modified click (new tab, new window) keeps the browser's own behaviour.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <nav
        aria-label="Main"
        className={`fixed inset-x-0 top-0 z-50 border-b bg-paper/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
          scrolled || open ? 'border-rule shadow-nav' : 'border-transparent shadow-nav-none'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Brand />

          {/* The links sit in the middle column, so they stay centred whatever the two sides weigh. */}
          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {SECTIONS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={go(id)}
                className="text-row font-medium text-body transition-colors hover:text-ink"
              >
                {labels[id]}
              </a>
            ))}
          </div>

          <div className="hidden items-center justify-end gap-4 lg:flex xl:gap-6">
            <LanguageToggle />
            <Link href="/login" className="text-row font-medium text-body transition-colors hover:text-ink">
              {t.nav.signIn}
            </Link>
            <a href="#contact" onClick={go('contact')} className="btn btn-primary btn-sm">
              {t.nav.requestDemo}
            </a>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rule text-ink"
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.quick, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto overscroll-contain bg-paper lg:hidden"
          >
            <div className="mx-auto flex max-w-[1200px] flex-col px-6 py-6">
              <ul className="divide-y divide-rule border-b border-rule">
                {SECTIONS.map((id) => (
                  <li key={id}>
                    <a href={`#${id}`} onClick={go(id)} className="display block py-4 text-[1.75rem] text-ink">
                      {labels[id]}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3">
                <a href="#contact" onClick={go('contact')} className="btn btn-primary">
                  {t.nav.requestDemo}
                </a>
                <Link href="/login" onClick={() => setOpen(false)} className="btn btn-secondary">
                  {t.nav.signIn}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
