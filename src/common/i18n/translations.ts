import en from './localization/en.json';
import kg from './localization/kg.json';
import ru from './localization/ru.json';

import type { LanguageCode } from './config';

type TranslationDictionary = Record<string, string>;

type TranslationsMap = Record<LanguageCode, TranslationDictionary>;

export const translations: TranslationsMap = {
  kg: kg as TranslationDictionary,
  ru: ru as TranslationDictionary,
  en: en as TranslationDictionary,
};
