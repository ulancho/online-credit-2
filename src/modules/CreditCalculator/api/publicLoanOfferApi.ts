import { httpClient } from '@/common/api/httpClient';

import type { PublicLoanOfferResponse } from 'Modules/CreditCalculator/models/publicLoanOffer.ts';

const PUBLIC_LOAN_OFFER_API =
  'https://mbank.cbk.kg/svc-biz-ib-cbk-documents/v1/api/documents/by-code/offer-public-loans';

export async function getPublicLoanOffer(): Promise<PublicLoanOfferResponse> {
  const response = await httpClient.get<PublicLoanOfferResponse>(PUBLIC_LOAN_OFFER_API);

  return response.data;
}
