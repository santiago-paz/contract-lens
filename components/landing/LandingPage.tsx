'use client';

import { MotionConfig } from 'framer-motion';
import { useEffect } from 'react';

import { ContactForm } from './ContactForm';
import { Faq } from './Faq';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { Navbar } from './Navbar';
import { Roles } from './Roles';
import { Statement } from './Statement';
import { Tour } from './Tour';
import { WhatItReads } from './WhatItReads';
import { YourData } from './YourData';
import type { Language } from './translations';

import './landing.css';

function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-paper"
    >
      {t.nav.skipToContent}
    </a>
  );
}

/**
 * The whole landing page, in the language its route asks for. `fontClassName`
 * carries the font variables that the server page loads.
 */
export function LandingPage({ language, fontClassName }: { language: Language; fontClassName: string }) {
  // Tells Bootstrap's failsafe that the page's own code is running.
  useEffect(() => {
    window.__landingReady = true;
  }, []);

  return (
    <LanguageProvider language={language}>
      <MotionConfig reducedMotion="user">
        <div className={`landing ${fontClassName} min-h-screen bg-paper text-ink selection:bg-mist`}>
          <SkipLink />
          <Navbar />
          <main id="main-content">
            <Hero />
            <Statement />
            <Tour />
            <WhatItReads />
            <YourData />
            <Roles />
            <Faq />
            <ContactForm />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </LanguageProvider>
  );
}
