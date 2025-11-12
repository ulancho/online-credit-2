import { AxiosHeaders, type AxiosInstance } from 'axios';

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from 'Common/i18n/config.ts';

const isSupportedLanguage = (value: string | null | undefined): value is LanguageCode => {
  if (!value) {
    return false;
  }

  return SUPPORTED_LANGUAGES.some((language) => language.code === value);
};

const resolveAcceptLanguage = (): LanguageCode => {
  const documentLanguage =
    typeof document !== 'undefined' ? document.documentElement.getAttribute('lang') : null;
  if (isSupportedLanguage(documentLanguage)) {
    return documentLanguage;
  }

  const storedLanguage =
    typeof window !== 'undefined' ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY) : null;
  if (isSupportedLanguage(storedLanguage)) {
    return storedLanguage;
  }

  const navigatorLanguage =
    typeof window !== 'undefined'
      ? window.navigator.language?.slice(0, 2).toLowerCase()
      : undefined;
  if (isSupportedLanguage(navigatorLanguage)) {
    return navigatorLanguage;
  }

  return DEFAULT_LANGUAGE;
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
