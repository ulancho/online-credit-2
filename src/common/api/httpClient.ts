import axios from 'axios';

// const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';
const baseURL = 'https://preprodib.mbank.kg/svc-biz-ib-cbk-private-credits/v1/api/webview';

// temporary token implementation
const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZJakF6T1RjME5EQTVMV0ZrTldFdE5EWXdNUzFpTXpSa0xUWTVaREUxTWpjNU9XWmxNQ0lzSW1saGRDSTZNVGMzTkRZeE1UazBPQ3dpWlhod0lqb3hOemMwTmpFeU1qUTRmUS5XY1NGSmlsX0xlb1NJdGt6RE8wWDFyNlVrSXl4d2lHVG8xc3JERmoxSXRF';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    token: token,
  },
  timeout: 10000,
});
