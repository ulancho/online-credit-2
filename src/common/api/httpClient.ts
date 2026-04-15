import axios from 'axios';

import { applyDeviceIdInterceptor } from 'Common/api/deviceIdInterceptor.tsx';
import { applyLanguageInterceptor } from 'Common/api/languageInterceptor.ts';
import { applyTokenInterceptor } from 'Common/api/tokenInterceptor.ts';
import { appEnv } from 'Common/config/env.ts';

export const httpClient = axios.create({
  baseURL: appEnv.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

applyTokenInterceptor(httpClient);
applyDeviceIdInterceptor(httpClient);
applyLanguageInterceptor(httpClient);
