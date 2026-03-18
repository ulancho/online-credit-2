import axios from 'axios';

import { applyCsrfInterceptor } from 'Common/api/csrfInterceptor.ts';
import { applyLanguageInterceptor } from 'Common/api/languageInterceptor.ts';

const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';

// temporary token implementation
const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZJamcwTmpObVpHRTBMV0U1WWpjdE5ERTNOaTA1TnpSbExUVTBNREJoTURsaE1XTmtPU0lzSW1saGRDSTZNVGMzTXpnek5ETTNNU3dpWlhod0lqb3hOemN6T0RNME5qY3hmUS45bWhOUGs2LVZNN0pNcnU2Q0phaUdRNDcxNjJEODZHckt0Q2VoZFBsOGhN';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    token: token,
  },
  timeout: 10000,
});

applyLanguageInterceptor(httpClient);
applyCsrfInterceptor(httpClient);
