import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export interface QueryParams {
  token: string | null;
  deviceId: string | null;
  lang: string | null;
  theme: string | null;
}

export function useQueryParams(): QueryParams {
  const { search } = useLocation();

  return useMemo(() => {
    const searchParams = new URLSearchParams(search);

    alert(JSON.stringify(searchParams));

    return {
      token: searchParams.get('token'),
      deviceId: searchParams.get('device-id'),
      lang: searchParams.get('lang'),
      theme: searchParams.get('theme'),
    };
  }, [search]);
}
