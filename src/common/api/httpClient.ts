import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://mbank-idtest.cbk.kg/oauth2/v1/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
