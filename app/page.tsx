'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { BauhausFeatures } from '@/components/landing/BauhausFeatures';
import { TeamSection } from '@/components/landing/TeamSection';
import { Security } from '@/components/landing/Security';
import { ContactForm } from '@/components/landing/ContactForm';
import { Footer } from '@/components/landing/Footer';
import { CookieConsent } from '@/components/landing/CookieConsent';
import { LanguageProvider } from '@/components/landing/LanguageContext';
import { CookieProvider } from '@/components/landing/CookieContext';

export default function LandingPage() {
  return (
    <LanguageProvider>
      <CookieProvider>
        <main className="min-h-screen bg-white text-black selection:bg-[var(--accent)] selection:text-white overflow-x-hidden max-w-[100vw]">
          <Navbar />
          <Hero />
          <BauhausFeatures />
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
