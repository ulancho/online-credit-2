import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from './config';
import { type TranslationDictionary, translations } from './translations';

import type { LanguageCode } from './config';

type TranslateParams = Record<string, string | number>;

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  languages: typeof SUPPORTED_LANGUAGES;
  t: (key: string, params?: TranslateParams) => string;
}
/**
 * Создаёт React контекст для языка и переводов
 * */
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * Определяет, является ли переданное значение допустимым языковым кодом (из поддерживаемых языков).
 * */
const isSupportedLanguage = (value: string | null | undefined): value is LanguageCode => {
  return SUPPORTED_LANGUAGES.some((language) => language.code === value);
};

/**
 * Берём язык из localStorage, иначе берём язык браузера.
 *
 * Если и это не подходит - подставляем язык по умолчанию.
 */
const resolveInitialLanguage = (): LanguageCode => {
  const fromStorage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupportedLanguage(fromStorage)) {
    return fromStorage;
  }

  const navigatorLanguage = window.navigator.language?.slice(0, 2).toLowerCase();
  if (isSupportedLanguage(navigatorLanguage)) {
    return navigatorLanguage;
  }

  return DEFAULT_LANGUAGE;
};

/**
 * const template = 'Привет, {{name}}! У тебя {{count}} новых сообщений.';
 *
 * const result = interpolate(template, { name: 'Улан', count: 5 });
 */
const interpolate = (template: string, params?: TranslateParams): string => {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = params[key];
    return value == null ? match : String(value);
  });
};

const resolveTemplate = (dictionary: TranslationDictionary | undefined, key: string) => {
  if (!dictionary) {
    return undefined;
  }

  const segments = key.split('.');
  let current: TranslationDictionary | string | undefined = dictionary;

  for (let index = 0; index < segments.length; index++) {
    if (current == null) {
      return undefined;
    }

    if (typeof current === 'string') {
      return index === segments.length - 1 ? current : undefined;
    }

    current = current[segments[index]];
  }

  return typeof current === 'string' ? current : undefined;
};

/**
 * Определяет нужный словарь по языку.
 *
 * Ищет текст по ключу, с резервом на язык по умолчанию.
 *
 * Подставляет параметры в шаблон.
 *
 * Возвращает готовую локализованную строку.
 * */
const translate = (language: LanguageCode, key: string, params?: TranslateParams) => {
  const dictionary = translations[language];
  const fallbackDictionary = translations[DEFAULT_LANGUAGE];
  const template =
    resolveTemplate(dictionary, key) ?? resolveTemplate(fallbackDictionary, key) ?? key;

  return interpolate(template, params);
};

/**
 * Определяет текущий язык при запуске;
 *
 * Сохраняет его в HTML и localStorage;
 *
 * Предоставляет в контекст функцию перевода и смены языка;
 *
 * Делает локализацию доступной во всём приложении.
 * */
export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => resolveInitialLanguage());

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  const setLanguage = useCallback((nextLanguage: LanguageCode) => {
    setLanguageState((current) => {
      if (current === nextLanguage) {
        return current;
      }
      return nextLanguage;
    });
  }, []);

  const contextValue = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      t: (key: string, params?: TranslateParams) => translate(language, key, params),
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

/**
 * Хук для получения языкового контекста (ко всем данным и методам из LanguageProvider).
 * */
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }

  return context;
};
