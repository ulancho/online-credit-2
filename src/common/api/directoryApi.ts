import { httpClient } from './httpClient';

export interface DirectoryResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  isNotUseCache: boolean;
  isUnauthorized: boolean;
  type: string;
  namespace: string;
  source: string;
  localizedName?: string;
  localizedDesc?: string;
  directoryItemList: DirectoryItem[];
}

export interface DirectoryItem {
  itemCode: string;
  name: string;
  active: boolean;
  position: number;
  localizedName?: string;
  paramList?: DirectoryItemParams;
}

export type DirectoryItemParams = Record<string, string | undefined> & {
  code?: string;
  phone_mask?: string;
  phone_code?: string;
};

interface DirectoryRequestPayload {
  namespace: string;
  source: string;
  code: string;
  notLocalize: boolean;
  itemFilter: null;
}

export async function fetchDirectory(code: string) {
  const payload: DirectoryRequestPayload = {
    namespace: 'cbk',
    source: 'global',
    code,
    notLocalize: false,
    itemFilter: null,
  };

  const { data } = await httpClient.post<DirectoryResponse>('/directory', payload);

  return data;
}
