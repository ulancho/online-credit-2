import { httpClient } from '@/common/api/httpClient';

import type {
  ActivityTypeDirectoryItem,
  ActivityTypeDirectoryResponse,
} from 'Modules/CreditCalculator/models/activityType.ts';

const ACTIVITY_TYPES_API = '/directory/unauthorized-api/directory/items';

const ACTIVITY_TYPE_REQUEST_BODY = {
  namespace: 'cbk',
  source: 'private',
  code: 'vid-activity-kk',
};

const normalizeItem = (
  item: ActivityTypeDirectoryResponse[number],
): ActivityTypeDirectoryItem | null => {
  const itemCode = item.itemCode?.trim();
  const nameRu = item.paramList?.Name_RU?.trim();

  if (!itemCode || !nameRu) {
    return null;
  }

  return {
    itemCode,
    position: item.position ?? 0,
    nameRu,
    nameEn: item.paramList?.Name_EN?.trim() ?? '',
    nameKg: item.paramList?.Name_KG?.trim() ?? '',
  };
};

export async function getActivityTypes(): Promise<ActivityTypeDirectoryItem[]> {
  const response = await httpClient.post<ActivityTypeDirectoryResponse>(
    ACTIVITY_TYPES_API,
    ACTIVITY_TYPE_REQUEST_BODY,
  );

  return response.data
    .map((item) => normalizeItem(item))
    .filter((item): item is ActivityTypeDirectoryItem => item !== null)
    .sort((left, right) => left.position - right.position);
}
