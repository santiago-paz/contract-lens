import type { MetadataRoute } from 'next';

const SITE = 'https://trycontractlens.com';

/** The two landing pages, each pointing at the other, so search engines serve the right language. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: SITE, de: `${SITE}/de` };
  return [
    { url: SITE, alternates: { languages }, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE}/de`, alternates: { languages }, changeFrequency: 'monthly', priority: 1 },
  ];
}
