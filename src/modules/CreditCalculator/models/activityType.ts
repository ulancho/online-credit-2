export type ActivityTypeDirectoryItem = {
  itemCode: string;
  position: number;
  nameRu: string;
  nameEn: string;
  nameKg: string;
};

export type ActivityTypeDirectoryApiItem = {
  itemCode?: string;
  position?: number;
  paramList?: {
    Name_EN?: string;
    Name_KG?: string;
    Name_RU?: string;
  };
};

export type ActivityTypeDirectoryResponse = ActivityTypeDirectoryApiItem[];
