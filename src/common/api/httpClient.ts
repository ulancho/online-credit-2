import axios from 'axios';

// const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';
const baseURL = 'https://preprodib.mbank.kg/svc-biz-ib-cbk-private-credits/v1/api/webview';

// temporary token implementation
const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZJakF6T1RjME5EQTVMV0ZrTldFdE5EWXdNUzFpTXpSa0xUWTVaREUxTWpjNU9XWmxNQ0lzSW1saGRDSTZNVGMzTkRnM01qRTVOeXdpWlhod0lqb3hOemMwT0RjeU5EazNmUS40bWVtaGh3T0ZWY2lvZElzYzZvQkhkSUNyY3p2ZjVKTERMY1pLZzdHVUdZ';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    token: token,
  },
  timeout: 10000,
});
