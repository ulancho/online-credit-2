import en from './localization/en.json';
import kg from './localization/kg.json';
import ru from './localization/ru.json';

import type { LanguageCode } from './config';

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}
type TranslationsMap = Record<LanguageCode, TranslationDictionary>;

export const translations: TranslationsMap = {
  ky: kg as TranslationDictionary,
  ru: ru as TranslationDictionary,
  en: en as TranslationDictionary,
};
