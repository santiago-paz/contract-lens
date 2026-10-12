import { translations, type Language } from './translations';

/**
 * The FAQ as structured data, built from the same strings the page shows, so
 * the two cannot drift. A server component: it renders one data script and no
 * markup. It describes the questions and nothing else: no ratings, no offers,
 * no reviews, because the product has none.
 */
export function JsonLd({ language }: { language: Language }) {
  const { faq } = translations[language];
  const plain = (text: string) => text.replace(/\u00a0/g, ' ');
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: language,
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: plain(item.q),
      acceptedAnswer: { '@type': 'Answer', text: plain(item.a) },
    })),
  };
  // "<" is escaped so a string can never close the script early.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
