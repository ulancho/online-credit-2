export const SUPPORTED_LANGUAGES = [
  { code: 'ky', label: 'KG' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const DEFAULT_LANGUAGE: LanguageCode = 'ru';

export const LANGUAGE_STORAGE_KEY = 'language';
