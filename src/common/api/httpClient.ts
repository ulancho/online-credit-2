import axios from 'axios';

import { applyLanguageInterceptor } from 'Common/api/languageInterceptor.ts';
import { applyTokenInterceptor } from 'Common/api/tokenInterceptor.ts';
import { appEnv } from 'Common/config/env.ts';

// const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';
// const baseURL = 'https://preprodib.mbank.kg/svc-biz-ib-cbk-private-credits/v1/api/webview';
// const baseURL = 'https://mbank.cbk.kg/svc-biz-ib-cbk-private-credits/v1/api/webview';

export const httpClient = axios.create({
  baseURL: appEnv.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

applyTokenInterceptor(httpClient);
applyLanguageInterceptor(httpClient);
