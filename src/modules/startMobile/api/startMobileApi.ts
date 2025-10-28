import { httpClient } from 'Common/api/httpClient.ts';

export interface StartMobileRequestPayload {
  scope: string | null;
  state: string | null;
  client_id: string | null;
  redirect_uri: string | null;
  original_url?: string | null;
  response_type: string | null;
  code_challenge: string | null;
  code_challenge_method: string | null;
}

export interface StartMobileResponse {
  id: string;
  redirect_url: string | null;
  deep_link_url: string | null;
  status: string;
  expires_in: string;
}

export interface StartMobileStatusRequestPayload {
  id: string;
  state: string | null;
  redirect_uri: string | null;
  original_url: string | null;
}

export interface StartMobileStatusResponse {
  id: string;
  redirect_url: string | null;
  deep_link_url: string | null;
  status: string;
  expires_in: string;
}

export async function fetchStartMobileAuthorization(
  payload: StartMobileRequestPayload,
): Promise<StartMobileResponse> {
  const { data } = await httpClient.post<StartMobileResponse>('/oauth/web/mobile', payload);

  return data;
}

export async function fetchStartMobileStatus(
  payload: StartMobileStatusRequestPayload,
): Promise<StartMobileStatusResponse> {
  const { data } = await httpClient.post<StartMobileStatusResponse>(
    '/oauth/web/mobile/status',
    payload,
  );

  return data;
}
