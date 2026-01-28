'use client';

import Link from 'next/link';
import { Globe, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { useLanguage } from './LanguageContext';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const LanguageToggle = () => (
    <div className="flex bg-gray-100 rounded-full p-1 relative w-[72px]">
      <motion.div
        className="absolute bg-white rounded-full shadow-sm"
        initial={false}
        animate={{
          x: language === 'en' ? 0 : "100%"
        }}
        style={{
          top: '4px',
          bottom: '4px',
          left: '4px',
          width: 'calc(50% - 4px)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <button
        onClick={() => setLanguage('en')}
        className={`relative z-10 w-1/2 py-1 text-xs font-bold transition-colors text-center rounded-full ${
          language === 'en' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('de')}
        className={`relative z-10 w-1/2 py-1 text-xs font-bold transition-colors text-center rounded-full ${
          language === 'de' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        DE
      </button>
    </div>
  );

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Split Berlin</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 mr-8">
            <button 
              onClick={() => scrollToSection('product-showcase')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t.nav.howItWorks}
            </button>
            <button 
              onClick={() => scrollToSection('bento-grid')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t.nav.features}
            </button>
            <button 
              onClick={() => scrollToSection('teams-section')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t.nav.teams}
            </button>
            <button 
              onClick={() => scrollToSection('security')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t.nav.security}
            </button>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
             <div className="pr-4 border-r border-gray-200">
               <LanguageToggle />
             </div>

             <Link 
              href="/login" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t.nav.signIn}
            </Link>
            <button
              onClick={() => scrollToSection('contact-form')}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              {t.nav.getStarted}
            </button>
          </div>

          {/* Mobile Right Section (Language Toggle + Menu Button) */}
          <div className="flex md:hidden items-center gap-3">
            <LanguageToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('product-showcase')}
                className="text-left text-base font-medium text-gray-600 hover:text-gray-900 py-2"
              >
                {t.nav.howItWorks}
              </button>
              <button 
                onClick={() => scrollToSection('bento-grid')}
                className="text-left text-base font-medium text-gray-600 hover:text-gray-900 py-2"
              >
                {t.nav.features}
              </button>
              <button 
                onClick={() => scrollToSection('teams-section')}
                className="text-left text-base font-medium text-gray-600 hover:text-gray-900 py-2"
              >
                {t.nav.teams}
              </button>
              <button 
                onClick={() => scrollToSection('security')}
                className="text-left text-base font-medium text-gray-600 hover:text-gray-900 py-2"
              >
                {t.nav.security}
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-gray-600 hover:text-gray-900 py-2"
              >
                {t.nav.signIn}
              </Link>
              <button
                onClick={() => scrollToSection('contact-form')}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-500 transition-colors text-center"
              >
                {t.nav.getStarted}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
