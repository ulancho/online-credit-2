import { httpClient } from 'Common/api/httpClient.ts';

export interface StartInfoRequestPayload {
  scope: string | null;
  state: string | null;
  client_id: string | null;
  redirect_uri: string | null;
  original_url?: string | null;
  response_type: string | null;
  code_challenge: string | null;
  code_challenge_method: string | null;
}

export interface StartInfoResponse {
  client_id: string;
  client_name: string;
  client_description: string;
  logo_url: string;
  offer_url: string;
  agreement_url: string;
  privacy_policy_url: string;
  term_of_service_url: string;
  redirect_uri: string;
  state: string;
}

export async function fetchStartInfo(payload: StartInfoRequestPayload) {
  const { data } = await httpClient.post<StartInfoResponse>('/oauth/web/info', payload);
  return data;
}
