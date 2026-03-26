import { httpClient } from 'Common/api/httpClient';

export interface AwaitingIssueResponse {
  awaitingLifetime: string;
  description: string;
  timerDescription: string;
  additionalDescription: string;
}

export async function fetchAwaitingIssue(requestId: string): Promise<AwaitingIssueResponse> {
  const response = await httpClient.get<AwaitingIssueResponse>(
    `/credit/application/awaiting-issue/${requestId}`,
  );

  return response.data;
}
