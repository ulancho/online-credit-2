import { AxiosHeaders, type AxiosInstance } from 'axios';

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from 'Common/i18n/config.ts';

const acceptLanguages = {
  ky: 'ky-KG',
  en: 'en-US',
  ru: 'ru-RU',
};

const isSupportedLanguage = (value: string | null | undefined): value is LanguageCode => {
  if (!value) {
    return false;
  }

  return SUPPORTED_LANGUAGES.some((language) => language.code === value);
};

const resolveAcceptLanguage = (): string => {
  const documentLanguage = document.documentElement.getAttribute('lang');
  if (isSupportedLanguage(documentLanguage)) {
    return acceptLanguages[documentLanguage];
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupportedLanguage(storedLanguage)) {
    return acceptLanguages[storedLanguage];
  }

  const navigatorLanguage = window.navigator.language?.slice(0, 2).toLowerCase();
  if (isSupportedLanguage(navigatorLanguage)) {
    return acceptLanguages[navigatorLanguage];
  }

  return acceptLanguages[DEFAULT_LANGUAGE];
};

export const applyLanguageInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use((config) => {
    const acceptLanguage = resolveAcceptLanguage();
    const headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : AxiosHeaders.from(config.headers ?? {});

    headers.set('Accept-Language', acceptLanguage);
    config.headers = headers;

    return config;
  });
};
