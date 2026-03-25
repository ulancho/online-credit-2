import { httpClient } from '@/common/api/httpClient';

import type {
  CreditDirectoryItem,
  CreditDirectoryResponse,
} from 'Modules/LoanConfirmation/models/CreditDirectory';

const CREDIT_DIRECTORY_API = '/directory/unauthorized-api/directory/items';

const CREDIT_DIRECTORY_REQUEST_BODY = {
  namespace: 'cbk',
  source: 'private',
  code: 'credits',
};

const normalizeItem = (item: CreditDirectoryResponse[number]): CreditDirectoryItem | null => {
  const itemCode = item.itemCode?.trim();

  if (!itemCode) {
    return null;
  }

  return {
    itemCode,
    position: item.position ?? 0,
    name: item.name,
    localizedName: item.localizedName,
    payDateList: JSON.parse(item.paramList?.payDateList),
    code: item.paramList.code,
  };
};

export async function getCreditDirectoryItems(): Promise<CreditDirectoryItem[]> {
  const response = await httpClient.post<CreditDirectoryResponse>(
    CREDIT_DIRECTORY_API,
    CREDIT_DIRECTORY_REQUEST_BODY,
  );

  return response.data
    .map((item) => normalizeItem(item))
    .filter((item): item is CreditDirectoryItem => item !== null)
    .sort((left, right) => left.position - right.position);
}
