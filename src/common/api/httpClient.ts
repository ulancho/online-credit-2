import axios from 'axios';

const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';

// temporary token implementation
const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZJamcwTmpObVpHRTBMV0U1WWpjdE5ERTNOaTA1TnpSbExUVTBNREJoTURsaE1XTmtPU0lzSW1saGRDSTZNVGMzTXpnNU1qUTJOeXdpWlhod0lqb3hOemN6T0RreU56WTNmUS5pOXpTZ1h6Mm1jTFpZYWJpOWs5ak9ZWGh5ZDN1bHN3bHdra0NjWGVXTVcw';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    token: token,
  },
  timeout: 10000,
});
