import { httpClient } from '@/common/api/httpClient';

import { CREDIT_RATES_API } from '../constants/urls';

import type { CreditRatesResponse } from '../model/creditRates';

export async function getCreditRates(): Promise<CreditRatesResponse> {
  const response = await httpClient.get<CreditRatesResponse>(CREDIT_RATES_API);

  return response.data;
}
