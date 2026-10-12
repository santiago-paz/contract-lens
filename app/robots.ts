import type { MetadataRoute } from 'next';

/** The landing is public; the app's routes and APIs are not for crawlers. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
    sitemap: 'https://trycontractlens.com/sitemap.xml',
  };
}
