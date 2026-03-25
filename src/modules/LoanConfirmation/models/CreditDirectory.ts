export type CreditDirectoryItem = {
  itemCode?: string;
  name: string;
  localizedName: string;
  position: number;
  minRateCli?: string;
  maxPerCredit?: string;
  minRateEmpl?: string;
  timeList?: number[];
  code?: string;
  maxSumCredit?: string;
  prcRateCredit?: string;
  minSumCredit?: string;
  payDateList: number[];
  minPerCredit?: string;
  prcRate?: string;
  sumList?: number[];
};

export type CreditDirectoryItemDto = {
  itemCode?: string;
  name: string;
  position?: number;
  localizedName: string;
  paramList: {
    minRateCli?: string;
    maxPerCredit?: string;
    minRateEmpl?: string;
    timeList?: number[];
    code?: string;
    maxSumCredit?: string;
    prcRateCredit?: string;
    minSumCredit?: string;
    payDateList: string;
    minPerCredit?: string;
    prcRate?: string;
    sumList?: number[];
  };
};

export type CreditDirectoryResponse = CreditDirectoryItemDto[];
