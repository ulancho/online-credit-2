export type CreditRatesType = {
  clientRateWithInsurance: number;
  clientRateWithoutInsurance: number;
  employeeRateWithInsurance: number;
  employeeRateWithoutInsurance: number;
  loyaltyLevel: string;
  productCode: string;
  availableLoanTerms: number[];
  availablePaymentDates: number[];
  minSumCredit: number;
  maxSumCredit: number;
};
