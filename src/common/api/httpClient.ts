import axios from 'axios';

const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';

// temporary token implementation
const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZJakF6T1RjME5EQTVMV0ZrTldFdE5EWXdNUzFpTXpSa0xUWTVaREUxTWpjNU9XWmxNQ0lzSW1saGRDSTZNVGMzTkRJME1Ua3dOQ3dpWlhod0lqb3hOemMwTWpReU1qQTBmUS4tNVI0NzNUR3BQWlRvcFJqb29vRXBkRXowMGJpX3BXeWhaQkNHdTQ1TE5Z';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    token: token,
  },
  timeout: 10000,
});
