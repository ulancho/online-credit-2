import axios from 'axios';

const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';

// temporary token implementation
const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZJamcwTmpObVpHRTBMV0U1WWpjdE5ERTNOaTA1TnpSbExUVTBNREJoTURsaE1XTmtPU0lzSW1saGRDSTZNVGMzTXpnME5UUTVOeXdpWlhod0lqb3hOemN6T0RRMU56azNmUS50YkVtbkloUXV3ZENPRkktRDN3alAyZ3hMbWZCaVZyZGhKLUl0SElZUGhZ';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    token: token,
  },
  timeout: 10000,
});
