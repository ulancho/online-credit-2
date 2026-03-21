import type { ApiLoyaltyLevel } from 'Modules/CreditCalculator/models/loyalty.ts';

export type CreditRatesResponse = {
  clientRateWithInsurance: number;
  clientRateWithoutInsurance: number;
  employeeRateWithInsurance: number;
  employeeRateWithoutInsurance: number;
  loyaltyLevel: ApiLoyaltyLevel | string;
  productCode: string;
  availableLoanTerms: number[];
  availablePaymentDates: number[];
  minSumCredit: number;
  maxSumCredit: number;
};
