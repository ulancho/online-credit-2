import { httpClient } from '../../../shared/api/httpClient';

export interface AuthenticationQrCodeResponse {
  link: string;
  expiresIn?: number;
}

const DEFAULT_QR_CODE_ENDPOINT = '/auth/qr-code';
const DEMO_QR_CODE_LINK = 'https://mbank.cbk.kg/';
const DEMO_QR_CODE_TTL = 120;

export async function fetchAuthenticationQrCode(signal?: AbortSignal) {
  const endpoint = import.meta.env.VITE_QR_CODE_ENDPOINT ?? DEFAULT_QR_CODE_ENDPOINT;
  const shouldUseDemo = import.meta.env.DEV && endpoint === DEFAULT_QR_CODE_ENDPOINT;

  try {
    const response = await httpClient.get<AuthenticationQrCodeResponse>(endpoint, { signal });
    const payload = response.data;

    if (!payload || typeof payload.link !== 'string' || payload.link.length === 0) {
      throw new Error('В ответе не найдена ссылка на QR-код.');
    }

    return {
      link: payload.link,
      expiresIn: typeof payload.expiresIn === 'number' ? payload.expiresIn : undefined,
    } satisfies AuthenticationQrCodeResponse;
  } catch (error) {
    if (shouldUseDemo) {
      console.warn(
        '[QR] Не удалось получить ссылку из API. Используется демонстрационная ссылка.',
        error,
      );

      return {
        link: DEMO_QR_CODE_LINK,
        expiresIn: DEMO_QR_CODE_TTL,
      } satisfies AuthenticationQrCodeResponse;
    }

    throw error;
  }
}
