import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export interface StartQueryParams {
  clientId: string | null;
  codeChallenge: string | null;
  codeChallengeMethod: string | null;
  redirectUri: string | null;
  responseType: string | null;
  scope: string | null;
  scopeList: string[];
  state: string | null;
}

const SCOPE_DELIMITER = /\s+/;

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
      scopeList: scope?.split(SCOPE_DELIMITER).filter(Boolean) ?? [],
      state: searchParams.get('state'),
    };
  }, [search]);
}
