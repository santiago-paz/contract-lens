'use client';

import { MotionConfig } from 'framer-motion';

import { Confidentiality } from '@/components/landing/Confidentiality';
import { ContactForm } from '@/components/landing/ContactForm';
import { CookieConsent } from '@/components/landing/CookieConsent';
import { CookieProvider } from '@/components/landing/CookieContext';
import { Deadlines } from '@/components/landing/Deadlines';
import { Firm } from '@/components/landing/Firm';
import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LanguageProvider, useLanguage } from '@/components/landing/LanguageContext';
import { Navbar } from '@/components/landing/Navbar';
import { WhatItReads } from '@/components/landing/WhatItReads';

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

export default function LandingPage() {
  return (
    <LanguageProvider>
      <CookieProvider>
        <MotionConfig reducedMotion="user">
          <div className="landing min-h-screen bg-paper text-ink selection:bg-mist">
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
            <CookieConsent />
          </div>
        </MotionConfig>
      </CookieProvider>
    </LanguageProvider>
  );
}
