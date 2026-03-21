import { httpClient } from '@/common/api/httpClient';

import type { CreditRatesResponse } from '../model/creditRates';

// Получение процентных ставок по кредиту для текущего клиента
export async function getCreditRates(): Promise<CreditRatesResponse> {
  const CREDIT_RATES_API = '/credit/credit-rates';

  const response = await httpClient.get<CreditRatesResponse>(CREDIT_RATES_API);
  return response.data;
}
