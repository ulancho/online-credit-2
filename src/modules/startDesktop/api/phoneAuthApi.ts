import { httpClient } from 'Common/api/httpClient.ts';

import type { AuthStatus } from 'Common/types/authStatus.ts';

export interface PhoneAuthRequestPayload {
  scope: string | null;
  state: string | null;
  phone: string;
  client_id: string | null;
  redirect_uri: string | null;
  original_url: string | null;
  response_type: string | null;
  code_challenge: string | null;
  code_challenge_method: string | null;
}

export interface PhoneAuthResponse {
  id: string;
  redirect_url?: string | null;
  status: AuthStatus;
  expires_in: string;
  expiration_seconds: number;
}

export interface PhoneAuthStatusRequestPayload {
  id: string;
  state: string | null;
  redirect_uri: string | null;
  original_url: string | null;
}

export async function sendPhoneAuthRequest(
  payload: PhoneAuthRequestPayload,
): Promise<PhoneAuthResponse> {
  const { data } = await httpClient.post<PhoneAuthResponse>('/oauth/web/push', payload);
  return data;
}

export async function fetchPhoneAuthStatus(
  payload: PhoneAuthStatusRequestPayload,
): Promise<PhoneAuthResponse> {
  const { data } = await httpClient.post<PhoneAuthResponse>('/oauth/web/push/status', payload);

  return data;
}
