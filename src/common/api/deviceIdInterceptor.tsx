import { AxiosHeaders, type AxiosInstance } from 'axios';

const DEVICE_ID_QUERY_PARAM = 'device-id';
const DEVICE_ID_HEADER = 'x-u6-device-id';
const DEVICE_ID_STORAGE_KEY = 'online-credit.device-id';

const parseDeviceIdFromUrl = (): string | null => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(DEVICE_ID_QUERY_PARAM);
};

const getStoredDeviceId = (): string | null => {
  try {
    return sessionStorage.getItem(DEVICE_ID_STORAGE_KEY);
  } catch {
    return null;
  }
};

const persistDeviceId = (deviceId: string) => {
  try {
    sessionStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  } catch {
    // Ignore storage errors.
  }
};

const resolveDeviceId = (): string | null => {
  const deviceIdFromUrl = parseDeviceIdFromUrl();

  if (deviceIdFromUrl) {
    persistDeviceId(deviceIdFromUrl);
    return deviceIdFromUrl;
  }

  return getStoredDeviceId();
};

export const applyDeviceIdInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use((config) => {
    const deviceId = resolveDeviceId();

    if (!deviceId) {
      return config;
    }

    const headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : AxiosHeaders.from(config.headers ?? {});

    headers.set(DEVICE_ID_HEADER, deviceId);
    config.headers = headers;

    return config;
  });
};
