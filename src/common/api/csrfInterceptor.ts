import { AxiosHeaders, type AxiosInstance } from 'axios';

const CSRF_HEADER = 'x-csrf-token';
const CSRF_STORAGE_KEY = 'mbankid.csrf.token';
const CSRF_STORAGE_TS_KEY = 'mbankid.csrf.token.ts';
const CSRF_TTL_MS = 15 * 60 * 1000;

let csrfToken: string | null = loadStoredToken();

const now = () => Date.now();

function loadStoredToken() {
  try {
    const storedToken = sessionStorage.getItem(CSRF_STORAGE_KEY);
    const storedTs = sessionStorage.getItem(CSRF_STORAGE_TS_KEY);

    console.log('storedToken: ', storedToken);
    console.log('storedTs: ', storedTs);

    if (!storedToken || !storedTs) {
      return null;
    }

    const ts = Number(storedTs);

    if (Number.isNaN(ts) || now() - ts > CSRF_TTL_MS) {
      console.log('remove ');
      sessionStorage.removeItem(CSRF_STORAGE_KEY);
      sessionStorage.removeItem(CSRF_STORAGE_TS_KEY);
      return null;
    }

    return storedToken;
  } catch {
    return null;
  }
}

function persistToken(token: string) {
  csrfToken = token;
  try {
    sessionStorage.setItem(CSRF_STORAGE_KEY, token);
    sessionStorage.setItem(CSRF_STORAGE_TS_KEY, String(now()));
  } catch {
    // Ignore storage errors
  }
}

function clearExpiredToken() {
  try {
    const storedTs = sessionStorage.getItem(CSRF_STORAGE_TS_KEY);
    if (!storedTs) {
      return;
    }

    const ts = Number(storedTs);

    if (Number.isNaN(ts) || now() - ts > CSRF_TTL_MS) {
      console.log('clearExpiredToken');
      sessionStorage.removeItem(CSRF_STORAGE_KEY);
      sessionStorage.removeItem(CSRF_STORAGE_TS_KEY);
      csrfToken = null;
    }
  } catch {
    // Ignore storage errors.
  }
}

export const applyCsrfInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use((response) => {
    console.log('interceptors.response');
    const csrfHeader = response.headers[CSRF_HEADER];
    if (csrfHeader) {
      console.log('csrfHeader: ', csrfHeader);
      const token = Array.isArray(csrfHeader) ? csrfHeader[0] : csrfHeader;
      if (token) {
        persistToken(token);
        client.defaults.headers.common[CSRF_HEADER] = token;
      }
    }

    return response;
  });

  client.interceptors.request.use((config) => {
    console.log('interceptors.request');
    clearExpiredToken();

    console.log('csrfToken request: ', csrfToken);
    if (csrfToken) {
      console.log('csrfToken in interceptors.request: ', csrfToken);
      const headers =
        config.headers instanceof AxiosHeaders
          ? config.headers
          : AxiosHeaders.from(config.headers ?? {});

      headers.set(CSRF_HEADER, csrfToken);
      config.headers = headers;
    }

    return config;
  });
};
