'use client';

import { MotionConfig } from 'framer-motion';

import { ContactForm } from '@/components/landing/ContactForm';
import { CookieConsent } from '@/components/landing/CookieConsent';
import { CookieProvider } from '@/components/landing/CookieContext';
import { FeaturesShowcase } from '@/components/landing/FeaturesShowcase';
import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { LanguageProvider, useLanguage } from '@/components/landing/LanguageContext';
import { Navbar } from '@/components/landing/Navbar';
import { Security } from '@/components/landing/Security';
import { TeamSection } from '@/components/landing/TeamSection';
import { VideoShowcase } from '@/components/landing/VideoShowcase';

function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-black focus:text-white focus:font-mono focus:font-bold focus:text-sm focus:uppercase focus:tracking-wide focus:border-2 focus:border-black focus:shadow-hard"
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
          <div className="min-h-screen bg-white text-black selection:bg-[var(--accent)] selection:text-black overflow-x-hidden max-w-[100vw]">
            <SkipLink />
            <Navbar />
            <main id="main-content">
              <Hero />
              <VideoShowcase />
              <FeaturesShowcase />
              <TeamSection />
              <Security />
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
