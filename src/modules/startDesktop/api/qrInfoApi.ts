import { httpClient } from 'Common/api/httpClient.ts';

export interface QrInfoRequestPayload {
  scope: string | null;
  state: string | null;
  client_id: string | null;
  redirect_uri: string | null;
  original_url?: string | null;
  response_type: string | null;
  code_challenge: string | null;
  code_challenge_method: string | null;
}

export interface QrInfoResponse {
  id: string;
  deeplink_url: string;
  redirect_url: string;
  status: string;
  expires_in: string;
}

export async function fetchQrInfo(payload: QrInfoRequestPayload) {
  const { data } = await httpClient.post<QrInfoResponse>('/oauth/web/qr', payload);

  return data;
}
