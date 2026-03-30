import { AxiosHeaders, type AxiosInstance } from 'axios';

const TOKEN_HEADER = 'Authorization';
const TOKEN_STORAGE_KEY = 'online-credit.auth.token';

const parseTokenFromUrl = (): string | null => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(TOKEN_HEADER);
};

const getStoredToken = (): string | null => {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

const persistToken = (token: string) => {
  try {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Ignore storage errors.
  }
};

const resolveToken = (): string | null => {
  const tokenFromUrl = parseTokenFromUrl();

  if (tokenFromUrl) {
    persistToken(tokenFromUrl);
    return tokenFromUrl;
  }

  return getStoredToken();
};

export const applyTokenInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use((config) => {
    const token = resolveToken();

    if (!token) {
      return config;
    }

    const headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : AxiosHeaders.from(config.headers ?? {});

    headers.set(TOKEN_HEADER, token);
    config.headers = headers;

    return config;
  });
};
