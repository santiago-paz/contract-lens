'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import { useLanguage } from './LanguageContext';

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
    <div className="flex border-2 border-black bg-white h-8 items-center">
      <button
        onClick={() => setLanguage('en')}
        className={`h-full px-3 text-xs font-mono font-bold transition-colors ${
          language === 'en' ? 'bg-black text-[#CCFF00]' : 'text-black hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <div className="w-0.5 h-full bg-black" />
      <button
        onClick={() => setLanguage('de')}
        className={`h-full px-3 text-xs font-mono font-bold transition-colors ${
          language === 'de' ? 'bg-black text-[#CCFF00]' : 'text-black hover:bg-gray-100'
        }`}
      >
        DE
      </button>
    </div>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b-2 ${
        scrolled ? 'bg-white border-black py-3' : 'bg-transparent border-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#CCFF00] border-2 border-black w-10 h-10 flex items-center justify-center shadow-hard-sm">
                 <span className="font-mono font-bold text-xl leading-none text-black">S</span>
              </div>
              <span className="text-xl font-bold tracking-tighter font-mono uppercase">
                Split Berlin
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavButton onClick={() => scrollToSection('product-showcase')}>{t.nav.howItWorks}</NavButton>
              <NavButton onClick={() => scrollToSection('bento-grid')}>{t.nav.features}</NavButton>
              <NavButton onClick={() => scrollToSection('teams-section')}>{t.nav.teams}</NavButton>
              <NavButton onClick={() => scrollToSection('security')}>{t.nav.security}</NavButton>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-4">
               <LanguageToggle />

               <Link 
                href="/login" 
                className="text-sm font-mono font-bold uppercase tracking-wider hover:underline underline-offset-4 decoration-2"
              >
                {t.nav.signIn}
              </Link>
              <button
                onClick={() => scrollToSection('contact-form')}
                className="inline-flex items-center justify-center px-6 py-2 text-sm font-bold font-mono uppercase bg-black text-white border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black"
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
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            className="fixed inset-0 top-[64px] z-40 bg-white md:hidden overflow-y-auto"
          >
            <div className="flex flex-col p-6 space-y-6">
              <div className="space-y-4">
                <MobileNavButton onClick={() => scrollToSection('product-showcase')}>{t.nav.howItWorks}</MobileNavButton>
                <MobileNavButton onClick={() => scrollToSection('bento-grid')}>{t.nav.features}</MobileNavButton>
                <MobileNavButton onClick={() => scrollToSection('teams-section')}>{t.nav.teams}</MobileNavButton>
                <MobileNavButton onClick={() => scrollToSection('security')}>{t.nav.security}</MobileNavButton>
              </div>
              
              <div className="h-0.5 bg-black w-full" />
              
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-4 text-sm font-mono font-bold uppercase border-2 border-black hover:bg-[#CCFF00] transition-colors"
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
      className="text-sm font-mono font-medium uppercase tracking-wide hover:bg-[#CCFF00] px-2 py-1 transition-colors"
    >
      {children}
    </button>
  );
}

function MobileNavButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left text-2xl font-mono font-bold uppercase tracking-tight hover:text-[#CCFF00] hover:bg-black px-2 transition-colors"
    >
      {children}
    </button>
  );
}
