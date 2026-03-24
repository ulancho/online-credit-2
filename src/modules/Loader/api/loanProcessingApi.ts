import { httpClient } from 'Common/api/httpClient';

import type { ApplicationStatus, CheckStatusResult } from '../models/types.ts';

interface FetchStatusResponse {
  status?: string;
  message?: string;
}

interface CheckStatusParams {
  lastRequest: boolean;
  signal?: AbortSignal;
}

const KNOWN_STATUSES: ReadonlySet<ApplicationStatus> = new Set([
  'waiting',
  'denied',
  'extended',
  'inProcess',
  'complete',
  'toIssue',
  'offline',
  'awaitingIssue',
  'unknown',
]);

function normalizeStatus(status?: string): ApplicationStatus {
  if (!status) {
    return 'unknown';
  }

  const normalized = status.trim() as ApplicationStatus;

  return KNOWN_STATUSES.has(normalized) ? normalized : 'unknown';
}

export async function fetchActiveApplicationStatus(
  signal?: AbortSignal,
): Promise<CheckStatusResult> {
  const response = await httpClient.get<FetchStatusResponse>('/credit/application/status', {
    signal,
  });

  return {
    status: normalizeStatus(response.data.status),
    message: response.data.message,
  };
}

export async function checkActiveApplicationStatus({
  lastRequest,
  signal,
}: CheckStatusParams): Promise<CheckStatusResult> {
  void lastRequest;

  return fetchActiveApplicationStatus(signal);
}
