import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://mbank.cbk.kg/svc-common-directory/v2/unauthorized-api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
