import axios from 'axios';

const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';

// temporary token implementation
const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZJamcwTmpObVpHRTBMV0U1WWpjdE5ERTNOaTA1TnpSbExUVTBNREJoTURsaE1XTmtPU0lzSW1saGRDSTZNVGMzTXpnNU9EQXlNaXdpWlhod0lqb3hOemN6T0RrNE16SXlmUS40cVkzbnQxdHliM2lHZmt0akJtNS1DaDNRZXEzUkc4eUdOcjNhM1JDbEI4';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    token: token,
  },
  timeout: 10000,
});
