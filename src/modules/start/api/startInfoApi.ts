import axios from 'axios';

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

const startInfoClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://mbank-idtest.cbk.kg/oauth2/v1',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

export async function fetchStartInfo(payload: StartInfoRequestPayload) {
  const { data } = await startInfoClient.post<StartInfoResponse>('/oauth/web/info', payload);

  return data;
}
