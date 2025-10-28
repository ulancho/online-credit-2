import { httpClient } from 'Common/api/httpClient.ts';

export interface QrStatusRequestPayload {
  id: string;
  state: string | null;
  redirect_uri: string | null;
  original_url?: string | null;
}

export interface QrStatusResponse {
  id: string;
  deeplink_url: string;
  redirect_url: string;
  status: string;
  expires_in: string;
  expiration_seconds: number;
}

export async function fetchQrStatus(payload: QrStatusRequestPayload) {
  const { data } = await httpClient.post<QrStatusResponse>('/oauth/web/qr/status', payload);

  return data;
}
