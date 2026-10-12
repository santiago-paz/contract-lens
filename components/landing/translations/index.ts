import { de } from './de';
import { en } from './en';
import { nbspDeep } from './nbsp';
import type { Language } from './types';

/**
 * The page's copy, with no-break spaces set once for dates, amounts, legal
 * forms and the brand name (see nbsp.ts). `meta` stays plain: it feeds the
 * page title and link previews.
 */
export const translations = {
  en: nbspDeep(en, ['meta']),
  de: nbspDeep(de, ['meta']),
};

export type { Language };
export type Translations = typeof en;

/** The languages the landing is written in, English first. */
export const LANGUAGES: readonly Language[] = ['en', 'de'];
