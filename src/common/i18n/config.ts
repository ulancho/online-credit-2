export const SUPPORTED_LANGUAGES = [
  { code: 'kg', label: 'KG' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const DEFAULT_LANGUAGE: LanguageCode = 'ru';

export const LANGUAGE_STORAGE_KEY = 'online-credit-language';
