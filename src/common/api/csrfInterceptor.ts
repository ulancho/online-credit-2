import { AxiosHeaders, type AxiosInstance } from 'axios';

const CSRF_HEADER = 'x-csrf-token';
const CSRF_STORAGE_KEY = 'mbankid.csrf.token';
const CSRF_STORAGE_TS_KEY = 'mbankid.csrf.token.ts';
const CSRF_TTL_MS = 15 * 60 * 1000;

let csrfToken: string | null = null;

const now = () => Date.now();

function loadStoredToken() {
  try {
    const storedToken = sessionStorage.getItem(CSRF_STORAGE_KEY);
    const storedTs = sessionStorage.getItem(CSRF_STORAGE_TS_KEY);

    if (!storedToken || !storedTs) {
      return null;
    }

    const ts = Number(storedTs);

    if (Number.isNaN(ts) || now() - ts > CSRF_TTL_MS) {
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

function getCsrfToken() {
  if (csrfToken) {
    return csrfToken;
  }

  csrfToken = loadStoredToken();
  return csrfToken;
}

function clearExpiredToken() {
  try {
    const storedTs = sessionStorage.getItem(CSRF_STORAGE_TS_KEY);
    if (!storedTs) {
      return;
    }

    const ts = Number(storedTs);

    if (Number.isNaN(ts) || now() - ts > CSRF_TTL_MS) {
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
    const csrfHeader = response.headers[CSRF_HEADER];
    if (csrfHeader) {
      const token = Array.isArray(csrfHeader) ? csrfHeader[0] : csrfHeader;
      if (token) {
        persistToken(token);
        client.defaults.headers.common[CSRF_HEADER] = token;
      }
    }

    return response;
  });

  client.interceptors.request.use((config) => {
    clearExpiredToken();

    const token = getCsrfToken();
    if (token) {
      const headers =
        config.headers instanceof AxiosHeaders
          ? config.headers
          : AxiosHeaders.from(config.headers ?? {});

      headers.set(CSRF_HEADER, token);
      config.headers = headers;
    }

    return config;
  });
};
