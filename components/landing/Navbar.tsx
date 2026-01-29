'use client';

import Link from 'next/link';
import { Globe, Menu, X } from 'lucide-react';
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

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const LanguageToggle = () => (
    <div className="flex bg-gray-100/50 backdrop-blur-sm rounded-full p-1 relative w-[72px] h-8 items-center border border-gray-200/50">
      <motion.div
        className="absolute bg-white rounded-full shadow-sm border border-gray-100"
        initial={false}
        animate={{
          x: language === 'en' ? 0 : "100%"
        }}
        style={{
          top: '3px',
          bottom: '3px',
          left: '3px',
          width: 'calc(50% - 3px)'
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      <button
        onClick={() => setLanguage('en')}
        className={`relative z-10 w-1/2 text-[10px] font-bold transition-colors text-center ${
          language === 'en' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('de')}
        className={`relative z-10 w-1/2 text-[10px] font-bold transition-colors text-center ${
          language === 'de' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        DE
      </button>
    </div>
  );

  return (
    <>
      <nav className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'px-4' : 'px-4 sm:px-8'}`}>
        <div className={`max-w-5xl mx-auto transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg shadow-gray-200/20 rounded-full py-3 px-6' 
            : 'bg-transparent py-4 px-0'
        }`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-black text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-black/20">
                 <div className="font-bold text-sm leading-none">S</div>
              </div>
              <span className={`text-lg font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>
                Split Berlin
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className={`hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50 backdrop-blur-sm ${scrolled ? 'hidden lg:flex' : ''}`}>
              <NavButton onClick={() => scrollToSection('product-showcase')}>{t.nav.howItWorks}</NavButton>
              <NavButton onClick={() => scrollToSection('bento-grid')}>{t.nav.features}</NavButton>
              <NavButton onClick={() => scrollToSection('teams-section')}>{t.nav.teams}</NavButton>
              <NavButton onClick={() => scrollToSection('security')}>{t.nav.security}</NavButton>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-3">
               <LanguageToggle />

               <Link 
                href="/login" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
              >
                {t.nav.signIn}
              </Link>
              <button
                onClick={() => scrollToSection('contact-form')}
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white shadow-lg shadow-gray-200 hover:bg-gray-800 hover:-translate-y-0.5 transition-all"
              >
                {t.nav.getStarted}
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="flex md:hidden items-center gap-3">
              <LanguageToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white p-2 rounded-full border border-gray-200 shadow-sm text-gray-600 hover:text-gray-900"
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
            className="fixed inset-x-4 top-24 z-40 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:hidden"
          >
            <div className="flex flex-col space-y-2">
              <MobileNavButton onClick={() => scrollToSection('product-showcase')}>{t.nav.howItWorks}</MobileNavButton>
              <MobileNavButton onClick={() => scrollToSection('bento-grid')}>{t.nav.features}</MobileNavButton>
              <MobileNavButton onClick={() => scrollToSection('teams-section')}>{t.nav.teams}</MobileNavButton>
              <MobileNavButton onClick={() => scrollToSection('security')}>{t.nav.security}</MobileNavButton>
              
              <div className="h-px bg-gray-100 my-2" />
              
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                {t.nav.signIn}
              </Link>
              <button
                onClick={() => scrollToSection('contact-form')}
                className="w-full py-3 text-sm font-medium text-white bg-black rounded-xl shadow-lg shadow-gray-200"
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
      className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-full transition-all duration-200"
    >
      {children}
    </button>
  );
}

function MobileNavButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
    >
      {children}
    </button>
  );
}
