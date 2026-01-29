'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { BentoGrid } from '@/components/landing/BentoGrid';
import { TeamSection } from '@/components/landing/TeamSection';
import { Security } from '@/components/landing/Security';
import { ContactForm } from '@/components/landing/ContactForm';
import { Footer } from '@/components/landing/Footer';
import { CookieConsent } from '@/components/landing/CookieConsent';
import { LanguageProvider } from '@/components/landing/LanguageContext';

export default function LandingPage() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-white text-black selection:bg-[#CCFF00] selection:text-black">
        <Navbar />
        <Hero />
        <ProductShowcase />
        <BentoGrid />
        <TeamSection />
        <Security />
        <ContactForm />
        <Footer />
        <CookieConsent />
      </main>
    </LanguageProvider>
  );
}
