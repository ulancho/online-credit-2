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

export const OTP_TYPE_CONSTANTS = {
  SOCFOND_OTP: 'SOCFOND',
  MBANK_OTP: 'MBANK',
} as const;

export type OtpType = (typeof OTP_TYPE_CONSTANTS)[keyof typeof OTP_TYPE_CONSTANTS];

export type CreditApplicationInitResponse = {
  type?: OtpType;
};

const CREDIT_APPLICATION_INIT_API = '/credit/application/init';

export async function initCreditApplication(payload: CreditApplicationInitPayload) {
  return await httpClient.post<CreditApplicationInitResponse>(CREDIT_APPLICATION_INIT_API, payload);
}
