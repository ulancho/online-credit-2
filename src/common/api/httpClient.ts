import axios from 'axios';

const baseURL = '/svc-biz-ib-cbk-private-credits/v1/api/webview';

// temporary token implementation
const token =
  'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFpDSTZJakF6T1RjME5EQTVMV0ZrTldFdE5EWXdNUzFpTXpSa0xUWTVaREUxTWpjNU9XWmxNQ0lzSW1saGRDSTZNVGMzTkRReU9ESTBOQ3dpWlhod0lqb3hOemMwTkRJNE5UUTBmUS5aSjVvdUlkR0txVGMyUFhIZmR2amVYR3RBMHBsMm8xMDhvb3B0Z1ZGck8w';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    token: token,
  },
  timeout: 10000,
});
