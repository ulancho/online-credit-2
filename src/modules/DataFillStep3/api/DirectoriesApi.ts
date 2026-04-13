import { httpClient } from 'Common/api/httpClient.ts';
import { appEnv } from 'Common/config/env.ts';

export type CitiesItemDto = {
  itemCode?: string;
  position: number;
  name?: string;
  active: boolean;
  localizedName: string;
};

export type BranchesItemDto = {
  itemCode?: string;
  position: number;
  paramList: {
    address: string;
    depart: string;
  };
};

export type CitiesItem = {
  code: string;
  name: string;
};

const DIRECTORY_API = '/unauthorized-api/directory';

const BASE_DIRECTORY_URL = appEnv.directoryBaseUrl;

const CITIES_REQUEST_BODY = {
  namespace: 'cbk',
  source: 'global',
  code: 'regions',
  itemFilter: null,
  notLocalize: false,
};

const BRANCHES_REQUEST_BODY = (value: string) => ({
  namespace: 'cbk',
  source: 'private',
  code: 'branches',
  itemFilter: {
    page: 0,
    size: 1000,
    sort: null,
    criteria: {
      criteriaItems: [
        {
          field: 'paramList.credit',
          operator: 'equal',
          value: 'true',
        },
        {
          field: 'paramList.region_code',
          operator: 'equal',
          value,
        },
      ],
    },
  },
  notLocalize: true,
});

export async function getCities(): Promise<CitiesItem[]> {
  const response = await httpClient.post<CitiesItemDto[]>(
    `${BASE_DIRECTORY_URL}/svc-biz-ib-cbk-private-credits/v1/api/webview/directory${DIRECTORY_API}/items`,
    CITIES_REQUEST_BODY,
  );

  return response.data
    .sort((left, right) => left.position - right.position)
    .map((item) => normalizeCitiesItem(item))
    .filter((item): item is CitiesItem => item !== null);
}

const normalizeCitiesItem = (item: CitiesItemDto): CitiesItem | null => {
  const itemCode = item.itemCode?.trim();

  if (!itemCode) {
    return null;
  }

  return {
    code: itemCode,
    name: item.localizedName,
  };
};

export async function getBranches(cityCode: string): Promise<CitiesItem[]> {
  const response = await httpClient.post<BranchesItemDto[]>(
    `${BASE_DIRECTORY_URL}/svc-biz-ib-cbk-private-credits/v1/api/webview/directory${DIRECTORY_API}/items`,
    BRANCHES_REQUEST_BODY(cityCode),
  );

  return response.data
    .sort((left, right) => left.position - right.position)
    .map((item) => normalizeBranchesItem(item))
    .filter((item): item is CitiesItem => item !== null);
}

const normalizeBranchesItem = (item: BranchesItemDto): CitiesItem | null => {
  const itemCode = item.itemCode?.trim();

  if (!itemCode) {
    return null;
  }

  return {
    name: item.paramList.address,
    code: item.paramList.depart,
  };
};
