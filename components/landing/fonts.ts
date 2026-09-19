import { IBM_Plex_Sans, Source_Serif_4 } from 'next/font/google';

/*
 * The landing page's two faces. They are loaded here, and only app/page.tsx
 * uses them, so only the landing route preloads them; the dashboard keeps
 * Geist from the root layout.
 */

/** Headlines. The optical-size axis gives large sizes the display cut. */
export const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
});

/** Everything read or pressed. Variable, so light text on navy can sit a touch heavier than 400. */
export const plexSans = IBM_Plex_Sans({
  variable: '--font-plex',
  subsets: ['latin'],
  display: 'swap',
});
