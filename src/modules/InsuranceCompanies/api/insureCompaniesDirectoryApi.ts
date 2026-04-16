import { httpClient } from '@/common/api/httpClient';

import type {
  InsuranceCompaniesItem,
  InsuranceCompaniesResponse,
} from 'Modules/InsuranceCompanies/models/InsuranceCompanies';

const INSURANCE_COMPANIES_API = '/directory/unauthorized-api/directory/items';

const INSURANCE_COMPANIES_REQUEST_BODY = {
  namespace: 'cbk',
  source: 'private',
  code: 'insure-companies',
  itemFilter: null,
  notLocalize: true,
};

export async function getInsuranceCompaniesItems(): Promise<InsuranceCompaniesItem[]> {
  const response = await httpClient.post<InsuranceCompaniesResponse>(
    INSURANCE_COMPANIES_API,
    INSURANCE_COMPANIES_REQUEST_BODY,
  );

  return response.data
    .map((item) => normalizeItem(item))
    .filter((item): item is InsuranceCompaniesItem => item !== null)
    .sort((left, right) => left.position - right.position);
}

const normalizeItem = (item: InsuranceCompaniesResponse[number]): InsuranceCompaniesItem | null => {
  const itemCode = item.itemCode?.trim();

  // скрываем отображение itemCode=1, согласно задаче = MB-4785, опция "Отказаться от страховки"
  if (!itemCode || itemCode === '1') {
    return null;
  }

  return {
    insureCompanyId: item.itemCode,
    position: item.position ?? 0,
    name: item.paramList.insureCompany,
    insurePrc: item.paramList.insurePrc,
  };
};
