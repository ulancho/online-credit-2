export type InsuranceCompaniesItemDto = {
  itemCode?: string;
  position: number;
  name?: string;
  paramList: {
    offerCode?: string;
    insurePrc: string;
    isActive?: boolean;
    insureCompany: string;
  };
};

export type InsuranceCompaniesItem = {
  position: number;
  name: string;
  insurePrc: string;
};

export type InsuranceCompaniesResponse = InsuranceCompaniesItemDto[];
