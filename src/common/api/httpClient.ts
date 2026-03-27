import axios from 'axios';

const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';

// temporary token implementation
const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZJakF6T1RjME5EQTVMV0ZrTldFdE5EWXdNUzFpTXpSa0xUWTVaREUxTWpjNU9XWmxNQ0lzSW1saGRDSTZNVGMzTkRZeU5qQTFPQ3dpWlhod0lqb3hOemMwTmpJMk16VTRmUS5va1RZcU42OXZrRnVvS0ppbDlDTGhRUUthUHVLSC1wYUJ0WU5ER2tCSllv';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    token: token,
  },
  timeout: 10000,
});
