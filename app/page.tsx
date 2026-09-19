import { LandingPage } from '@/components/landing/LandingPage';
import { plexSans, sourceSerif } from '@/components/landing/fonts';

// A server page on purpose: the landing's fonts are called from here, so Next
// preloads them on this route only (see next/font "Preloading").
export default function Page() {
  return <LandingPage fontClassName={`${sourceSerif.variable} ${plexSans.variable}`} />;
}
