import type { ApiLoyaltyLevel } from 'Modules/CreditCalculator/models/loyalty.ts';

export type CreditRatesResponse = {
  rateWithInsurance: number;
  rateWithoutInsurance: number;
  loyaltyLevel: ApiLoyaltyLevel | string;
  productCode: string;
  availableLoanTerms: number[];
  availablePaymentDates: number[];
  minSumCredit: number;
  maxSumCredit: number;
};
