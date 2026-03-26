import { httpClient } from '@/common/api/httpClient';

export type CreditApplicationInitPayload = {
  amount: number;
  periodInterval: number;
  productCode: string;
  percent: number;
  level: string;
  acceptAgreement: boolean;
  hash: string;
  deviceReport: string;
  activityType: string;
  clientIncome: number;
  insuranceConsent: boolean;
};

const CREDIT_APPLICATION_INIT_API = '/credit/application/init';

export async function initCreditApplication(payload: CreditApplicationInitPayload) {
  return await httpClient.post(CREDIT_APPLICATION_INIT_API, payload);
}
