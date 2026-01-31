'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useLanguage } from './LanguageContext';
import { Logo } from './Logo';

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

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const LanguageToggle = () => (
    <div className="flex border-2 border-black bg-white h-10 items-center shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
      <button
        onClick={() => setLanguage('en')}
        className={`h-full px-4 text-xs font-mono font-bold transition-colors ${language === 'en' ? 'bg-black text-[#CCFF00]' : 'text-black hover:bg-gray-100'
          }`}
      >
        EN
      </button>
      <div className="w-0.5 h-full bg-black" />
      <button
        onClick={() => setLanguage('de')}
        className={`h-full px-4 text-xs font-mono font-bold transition-colors ${language === 'de' ? 'bg-black text-[#CCFF00]' : 'text-black hover:bg-gray-100'
          }`}
      >
        DE
      </button>
    </div>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 ${scrolled ? 'bg-white border-black py-3 shadow-sm' : 'bg-white/80 backdrop-blur-md border-transparent py-5'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-[#CCFF00] border-2 border-black w-12 h-12 flex items-center justify-center shadow-hard-sm transition-transform hover:rotate-3">
                <Logo className="text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter font-mono uppercase leading-none">
                  Herr Contrakt
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 leading-none mt-1">
                  System v1.0
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              <NavButton onClick={() => scrollToSection('features')}>{t.nav.features}</NavButton>
              <NavButton onClick={() => scrollToSection('teams-section')}>{t.nav.teams}</NavButton>
              <NavButton onClick={() => scrollToSection('security')}>{t.nav.security}</NavButton>
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
                onClick={() => scrollToSection('contact-form')}
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
                className="p-2 border-2 border-black shadow-hard-sm bg-white active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "circOut" }}
            className="fixed inset-0 top-[80px] z-40 bg-white md:hidden overflow-y-auto border-t-2 border-black"
          >
            <div className="bg-grid-pattern absolute inset-0 opacity-20 pointer-events-none" />
            <div className="flex flex-col p-8 space-y-8 relative z-10">
              <div className="space-y-6">
                <MobileNavButton onClick={() => scrollToSection('features')}>{t.nav.features}</MobileNavButton>
                <MobileNavButton onClick={() => scrollToSection('teams-section')}>{t.nav.teams}</MobileNavButton>
                <MobileNavButton onClick={() => scrollToSection('security')}>{t.nav.security}</MobileNavButton>
              </div>

              <div className="h-0.5 bg-black w-full opacity-20" />

              <div className="space-y-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full py-4 text-sm font-mono font-bold uppercase border-2 border-black bg-white hover:bg-[#CCFF00] transition-colors shadow-hard-sm"
                >
                  {t.nav.signIn}
                </Link>
                <button
                  onClick={() => scrollToSection('contact-form')}
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
      <span className="absolute bottom-0 left-0 w-0 h-2 bg-[#CCFF00] transition-all duration-300 group-hover:w-full -z-0 opacity-70"></span>
    </button>
  );
}

function MobileNavButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left text-3xl font-black font-mono uppercase tracking-tighter hover:text-[#CCFF00] hover:translate-x-4 transition-all duration-300 flex items-center gap-4 group"
    >
      <span className="w-2 h-2 bg-black group-hover:bg-[#CCFF00] transition-colors" />
      {children}
    </button>
  );
}
