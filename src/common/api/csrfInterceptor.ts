import { AxiosHeaders, type AxiosInstance } from 'axios';

let csrfToken: string | null = null;

export const applyCsrfInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use((response) => {
    const csrfHeader = response.headers['x-csrf-token'];

    console.log('csrfHeader: ', csrfHeader);
    console.log('response.headers: ', response.headers);

    if (csrfHeader) {
      csrfToken = Array.isArray(csrfHeader) ? csrfHeader[0] : csrfHeader;
      client.defaults.headers.common['x-csrf-token'] = csrfToken;
    }

    return response;
  });

  client.interceptors.request.use((config) => {
    if (csrfToken) {
      console.log('csrfToken: ', csrfToken);

      const headers =
        config.headers instanceof AxiosHeaders
          ? config.headers
          : AxiosHeaders.from(config.headers ?? {});

      headers.set('x-csrf-token', csrfToken);
      config.headers = headers;
    }

    return config;
  });
};
