import axios from 'axios';

import { httpClient } from '@/common/api/httpClient';
import { getAcceptLanguage } from 'Common/api/languageInterceptor.ts';

import type { LoanOfferResponse } from 'Modules/CreditCalculator/models/publicLoanOffer.ts';

const PUBLIC_LOAN_OFFER_API = '/document/by-code/offer-public-loans';

const LOAN_OFFER_API = '/document/by-code/offer-loans';

// const DOCUMENT_FILE_API =
//   'https://preprodib.mbank.kg/svc-biz-ib-cbk-documents/v1/unauthorized-api/documents/by-code';

const DOCUMENT_FILE_API =
  'https://mbank.cbk.kg/svc-biz-ib-cbk-documents/v1/unauthorized-api/documents/by-code';

export async function getPublicLoanOffer(): Promise<LoanOfferResponse> {
  const response = await httpClient.get<LoanOfferResponse>(PUBLIC_LOAN_OFFER_API);

  return response.data;
}

export async function getLoanOffer(): Promise<LoanOfferResponse> {
  const response = await httpClient.get<LoanOfferResponse>(LOAN_OFFER_API);

  return response.data;
}

export async function downloadOfferFile(code: string, hash: string): Promise<Blob> {
  const response = await axios.get<Blob>(`${DOCUMENT_FILE_API}/${code}/file`, {
    params: {
      type: 'OFFER',
      hash,
    },
    headers: {
      'Accept-Language': getAcceptLanguage(),
    },
    responseType: 'blob',
  });

  return response.data;
}
