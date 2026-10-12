import type { Metadata } from 'next';

import { Bootstrap } from '@/components/landing/Bootstrap';
import { JsonLd } from '@/components/landing/JsonLd';
import { LandingPage } from '@/components/landing/LandingPage';
import { plexSans, sourceSerif } from '@/components/landing/fonts';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    languages: { en: '/', de: '/de', 'x-default': '/' },
  },
};

// A server page on purpose: the landing's fonts are called from here, so Next
// preloads them on this route only (see next/font "Preloading"). The English
// page is `/`; the German one is app/de/page.tsx.
export default function Page() {
  return (
    <>
      <Bootstrap />
      <JsonLd language="en" />
      <LandingPage language="en" fontClassName={`${sourceSerif.variable} ${plexSans.variable}`} />
    </>
  );
}
