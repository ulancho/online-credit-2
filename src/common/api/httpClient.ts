import axios from 'axios';

import { applyCsrfInterceptor } from 'Common/api/csrfInterceptor.ts';
import { applyLanguageInterceptor } from 'Common/api/languageInterceptor.ts';

const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const baseURL = isLocalhost
  ? import.meta.env.VITE_API_BASE_URL
  : `${window.location.origin}/oauth2/v1/api`;

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

applyLanguageInterceptor(httpClient);
applyCsrfInterceptor(httpClient);
