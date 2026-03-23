import { httpClient } from '@/common/api/httpClient';

import type { LoanOfferResponse } from 'Modules/CreditCalculator/models/publicLoanOffer.ts';

const PUBLIC_LOAN_OFFER_API = 'document/by-code/offer-public-loans';

const LOAN_OFFER_API = '/document/by-code/offer-loans';

export async function getPublicLoanOffer(): Promise<LoanOfferResponse> {
  const response = await httpClient.get<LoanOfferResponse>(PUBLIC_LOAN_OFFER_API);

  return response.data;
}

export async function getLoanOffer(): Promise<LoanOfferResponse> {
  const response = await httpClient.get<LoanOfferResponse>(LOAN_OFFER_API);

  return response.data;
}
