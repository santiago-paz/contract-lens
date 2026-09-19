'use client';

import { MotionConfig } from 'framer-motion';

import { Confidentiality } from './Confidentiality';
import { ContactForm } from './ContactForm';
import { Deadlines } from './Deadlines';
import { Firm } from './Firm';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { Navbar } from './Navbar';
import { WhatItReads } from './WhatItReads';

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

/** The whole landing page. `fontClassName` carries the font variables that app/page.tsx loads. */
export function LandingPage({ fontClassName }: { fontClassName: string }) {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <div className={`landing ${fontClassName} min-h-screen bg-paper text-ink selection:bg-mist`}>
          <SkipLink />
          <Navbar />
          <main id="main-content">
            <Hero />
            <HowItWorks />
            <WhatItReads />
            <Deadlines />
            <Firm />
            <Confidentiality />
            <ContactForm />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </LanguageProvider>
  );
}
