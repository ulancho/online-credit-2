import { httpClient } from 'Common/api/httpClient';

export interface ActiveApplicationResponse {
  status?: string;
  message?: string;
  requestId?: string;
  amount?: number;
  currency?: string;
  period?: number;
  hasCreditOverdue?: boolean;
  hasMPlusOverdue?: boolean;
}

// Проверка наличия активной заявки
export async function getActiveApplicationStatus(): Promise<ActiveApplicationResponse> {
  const response = await httpClient.get<ActiveApplicationResponse>(
    '/credit/application/active/exists',
    {
      params: {
        checkStatusInKK: true,
        showHidden: true,
      },
    },
  );

  return response.data;
}
