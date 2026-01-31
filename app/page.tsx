'use client';

import { ContactForm } from '@/components/landing/ContactForm';
import { CookieConsent } from '@/components/landing/CookieConsent';
import { CookieProvider } from '@/components/landing/CookieContext';
import { FeaturesShowcase } from '@/components/landing/FeaturesShowcase';
import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { LanguageProvider } from '@/components/landing/LanguageContext';
import { Navbar } from '@/components/landing/Navbar';
import { Security } from '@/components/landing/Security';
import { TeamSection } from '@/components/landing/TeamSection';

export default function LandingPage() {
  return (
    <LanguageProvider>
      <CookieProvider>
        <main className="min-h-screen bg-white text-black selection:bg-[var(--accent)] selection:text-white overflow-x-hidden max-w-[100vw]">
          <Navbar />
          <Hero />
          <FeaturesShowcase />
          <TeamSection />
          <Security />
          <ContactForm />
          <Footer />
          <CookieConsent />
        </main>
      </CookieProvider>
    </LanguageProvider>
  );
}
