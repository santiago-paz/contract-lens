'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useLanguage } from './LanguageContext';
import { Logo } from './Logo';
import { scrollToSection } from './scroll';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goToSection = (id: string) => {
    setIsOpen(false);
    scrollToSection(id);
  };

  const LanguageToggle = () => (
    <div
      role="group"
      aria-label={t.nav.languageLabel}
      className="flex border-2 border-black bg-white h-10 items-center shadow-hard-sm"
    >
      <button
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`h-full px-4 text-xs font-mono font-bold transition-colors ${language === 'en' ? 'bg-black text-[#CCFF00]' : 'text-black hover:bg-gray-100'
          }`}
      >
        EN
      </button>
      <div className="w-0.5 h-full bg-black" aria-hidden="true" />
      <button
        onClick={() => setLanguage('de')}
        aria-pressed={language === 'de'}
        className={`h-full px-4 text-xs font-mono font-bold transition-colors ${language === 'de' ? 'bg-black text-[#CCFF00]' : 'text-black hover:bg-gray-100'
          }`}
      >
        DE
      </button>
    </div>
  );

  return (
    <>
      <nav aria-label="Main" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 ${scrolled ? 'bg-white border-black py-3 shadow-sm' : 'bg-white/90 backdrop-blur-md border-transparent py-5'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-[#CCFF00] border-2 border-black w-12 h-12 flex items-center justify-center shadow-hard-sm" aria-hidden="true">
                <Logo className="text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter font-mono uppercase leading-none">
                  Contract Lens
                </span>
                <span className="hidden sm:block text-[11px] font-mono uppercase tracking-widest text-gray-600 leading-none mt-1">
                  {t.hero.badge}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              <NavButton onClick={() => goToSection('how-it-works')}>{t.nav.howItWorks}</NavButton>
              <NavButton onClick={() => goToSection('features')}>{t.nav.features}</NavButton>
              <NavButton onClick={() => goToSection('teams-section')}>{t.nav.teams}</NavButton>
              <NavButton onClick={() => goToSection('security')}>{t.nav.security}</NavButton>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-6">
              <LanguageToggle />

              <Link
                href="/login"
                className="text-sm font-mono font-bold uppercase tracking-wider border-b-2 border-transparent hover:border-[#CCFF00] transition-all"
              >
                {t.nav.signIn}
              </Link>
              <button
                onClick={() => goToSection('contact-form')}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold font-mono uppercase bg-black text-white border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black"
              >
                {t.nav.getStarted}
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="flex md:hidden items-center gap-4">
              <LanguageToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                className="p-2 border-2 border-black shadow-hard-sm bg-white active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "circOut" }}
            className="fixed inset-0 top-[80px] z-40 bg-white md:hidden overflow-y-auto overscroll-contain border-t-2 border-black"
          >
            <div className="bg-grid-pattern absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true" />
            <div className="flex flex-col p-8 space-y-8 relative z-10">
              <div className="space-y-6">
                <MobileNavButton onClick={() => goToSection('how-it-works')}>{t.nav.howItWorks}</MobileNavButton>
                <MobileNavButton onClick={() => goToSection('features')}>{t.nav.features}</MobileNavButton>
                <MobileNavButton onClick={() => goToSection('teams-section')}>{t.nav.teams}</MobileNavButton>
                <MobileNavButton onClick={() => goToSection('security')}>{t.nav.security}</MobileNavButton>
              </div>

              <div className="h-0.5 bg-black w-full opacity-20" aria-hidden="true" />

              <div className="space-y-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full py-4 text-sm font-mono font-bold uppercase border-2 border-black bg-white hover:bg-[#CCFF00] transition-colors shadow-hard-sm"
                >
                  {t.nav.signIn}
                </Link>
                <button
                  onClick={() => goToSection('contact-form')}
                  className="w-full py-4 text-sm font-bold font-mono uppercase bg-black text-white border-2 border-black shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  {t.nav.getStarted}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative text-sm font-mono font-bold uppercase tracking-wide group py-1"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute bottom-0 left-0 w-0 h-2 bg-[#CCFF00] transition-all duration-300 group-hover:w-full -z-0" aria-hidden="true"></span>
    </button>
  );
}

function MobileNavButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left text-3xl font-black font-mono uppercase tracking-tighter hover:translate-x-4 transition-all duration-300 flex items-center gap-4 group"
    >
      <span className="w-2 h-2 bg-black group-hover:bg-[#CCFF00] group-hover:scale-125 transition-all" aria-hidden="true" />
      {children}
    </button>
  );
}
