/**
 * No-break spaces for the places a line must not split: a number and its unit
 * ("24 months", "EUR 50,000"), a date's day and month, a legal form
 * ("Nordlicht Software GmbH"), a title or initial and the name after it
 * ("Dr. K. Weber"), the section sign and its number, and the brand name.
 *
 * It runs once over the whole copy, so the strings in en.ts and de.ts stay
 * plain and readable. The page's title and description (`meta`) are left alone:
 * search engines and link previews want ordinary spaces.
 */
const MONTHS =
  'January|February|March|April|May|June|July|August|September|October|November|December|Januar|Februar|März|Mai|Juni|Juli|Oktober|Dezember|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|Okt|Dez';

const RULES: [RegExp, string][] = [
  // 24 months, 5 Tagen, 1 January: a short number and the word after it (but not a year before a word)
  [/(?<!\d)(\d{1,3})[ ](?=[A-Za-zÄÖÜäöüß€%])/g, '$1\u00a0'],
  [/\b(EUR|USD)[ ](?=\d)/g, '$1\u00a0'], // EUR 50,000
  [/[ ](?=(GmbH|AG|KG|AB)\b)/g, '\u00a0'], // Nordlicht Software GmbH
  [/\b(Dr\.|[A-Z]\.)[ ](?=[A-Z])/g, '$1\u00a0'], // S. Brandt, Dr. K. Weber
  [/§[ ](?=\d)/g, '§\u00a0'], // § 2
  [/Contract[ ]Lens/g, 'Contract\u00a0Lens'], // the brand name
  [/\b(Ihr|Ihre|Ihren|Ihrem|Ihrer|Ihres)[ ](?=[A-Z\u00c4\u00d6\u00dc])/g, '$1\u00a0'], // Ihre Kanzlei: a line never ends on the pronoun
];

// A month and its year stay together: "January 2025", "Sep. 2026".
const MONTH_YEAR = new RegExp(`\\b(${MONTHS})(\\.?)[ ](?=\\d{4})`, 'g');

export function nbsp(text: string): string {
  let out = text;
  for (const [pattern, replacement] of RULES) {
    out = out.replace(pattern, replacement);
  }
  return out.replace(MONTH_YEAR, '$1$2\u00a0');
}

/** Applies nbsp to every string in a structure, except under the keys named in `skip`. */
export function nbspDeep<T>(value: T, skip: readonly string[] = []): T {
  if (typeof value === 'string') return nbsp(value) as T;
  if (Array.isArray(value)) return value.map((item) => nbspDeep(item, skip)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, skip.includes(key) ? item : nbspDeep(item, skip)]),
    ) as T;
  }
  return value;
}
