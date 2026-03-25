import { httpClient } from 'Common/api/httpClient';

import type { ApplicationStatus } from 'Modules/Loader/models/applicationStatus.ts';

interface ApplicationStatusResponse {
  id: string;
  status: ApplicationStatus;
  tokenLifetime?: string;
}

interface CheckStatusParams {
  lastRequest: boolean;
  signal?: AbortSignal;
}

export async function fetchActiveApplicationStatus(
  signal?: AbortSignal,
): Promise<ApplicationStatusResponse> {
  const response = await httpClient.get<ApplicationStatusResponse>('/credit/application/status', {
    signal,
  });

  return response.data;
}

export async function checkActiveApplicationStatus({
  lastRequest,
  signal,
}: CheckStatusParams): Promise<ApplicationStatusResponse> {
  void lastRequest;

  return fetchActiveApplicationStatus(signal);
}
