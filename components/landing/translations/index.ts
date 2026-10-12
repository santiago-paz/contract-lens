import { de } from './de';
import { en } from './en';
import type { Language } from './types';

export const translations = { en, de };

export type { Language };
export type Translations = typeof en;

/** The languages the landing is written in, English first. */
export const LANGUAGES: readonly Language[] = ['en', 'de'];
