import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { BentoGrid } from '@/components/landing/BentoGrid';
import { Security } from '@/components/landing/Security';
import { ContactForm } from '@/components/landing/ContactForm';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero />
      <ProductShowcase />
      <BentoGrid />
      <Security />
      <ContactForm />
      <Footer />
    </main>
  );
}
