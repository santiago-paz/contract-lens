import type { Metadata } from 'next';

import { Bootstrap } from '@/components/landing/Bootstrap';
import { JsonLd } from '@/components/landing/JsonLd';
import { LandingPage } from '@/components/landing/LandingPage';
import { plexSans, sourceSerif } from '@/components/landing/fonts';
import { translations } from '@/components/landing/translations';

const { title, description } = translations.de.meta;

// Page metadata replaces the layout's openGraph and twitter objects as a whole,
// so each is written out in full here, in German.
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/de',
    languages: { en: '/', de: '/de', 'x-default': '/' },
  },
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: 'Contract Lens',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    url: '/de',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

/** The German landing. `/` serves it to visitors whose browser prefers German (see proxy.ts). */
export default function Page() {
  return (
    <>
      <Bootstrap />
      <JsonLd language="de" />
      <LandingPage language="de" fontClassName={`${sourceSerif.variable} ${plexSans.variable}`} />
    </>
  );
}
