import axios from 'axios';

const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';

// temporary token implementation
const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZJakF6T1RjME5EQTVMV0ZrTldFdE5EWXdNUzFpTXpSa0xUWTVaREUxTWpjNU9XWmxNQ0lzSW1saGRDSTZNVGMzTkRNME56ZzNPQ3dpWlhod0lqb3hOemMwTXpRNE1UYzRmUS5YVGhlc1IwbTJkd1NjbHNEMWpfbGV6RGNmY1oxdFJJRXlqZEJRci0tbGtv';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    token: token,
  },
  timeout: 10000,
});
