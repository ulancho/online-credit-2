import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export interface StartQueryParams {
  clientId: string | null;
  codeChallenge: string | null;
  codeChallengeMethod: string | null;
  redirectUri: string | null;
  responseType: string | null;
  scope: string | null;
  state: string | null;
}

export function useStartQueryParams(): StartQueryParams {
  const { search } = useLocation();

  return useMemo(() => {
    const searchParams = new URLSearchParams(search);

    const scope = searchParams.get('scope');

    return {
      clientId: searchParams.get('client_id'),
      codeChallenge: searchParams.get('code_challenge'),
      codeChallengeMethod: searchParams.get('code_challenge_method'),
      redirectUri: searchParams.get('redirect_uri'),
      responseType: searchParams.get('response_type'),
      scope,
      state: searchParams.get('state'),
    };
  }, [search]);
}
