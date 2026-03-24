export type ApplicationStatus =
  | 'waiting'
  | 'denied'
  | 'extended'
  | 'inProcess'
  | 'complete'
  | 'toIssue'
  | 'offline'
  | 'awaitingIssue'
  | 'unknown';

export interface CheckStatusResult {
  status: ApplicationStatus;
  message?: string;
}
