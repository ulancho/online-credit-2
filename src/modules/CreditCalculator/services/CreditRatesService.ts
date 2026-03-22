import { action, computed, observable } from 'mobx';

import { getCreditRates } from 'Modules/CreditCalculator/api/creditRatesApi.ts';
import { generatePdfLkd } from 'Modules/CreditCalculator/services/pdfLkdApi.ts';

import type { CreditRatesResponse } from 'Modules/CreditCalculator/models/creditRates';
import type { LoanRateOptions } from 'Modules/CreditCalculator/services/LoanCalculatorService.ts';

// Получение процентных ставок по кредиту для текущего клиента
export class CreditRatesService {
  @observable creditRates: CreditRatesResponse | null = null;
  @observable pdfLkdBase64 = '';

  @action
  async getCreditRates() {
    this.creditRates = await getCreditRates();
  }

  @action
  async generatePdfLkd({
    amount,
    termMonths,
    category,
    insuranceOption,
  }: { amount: number; termMonths: number } & LoanRateOptions) {
    if (!this.creditRates) {
      return null;
    }

    const nominalRate =
      category === 'employee'
        ? insuranceOption === 'withInsurance'
          ? this.creditRates.employeeRateWithInsurance
          : this.creditRates.employeeRateWithoutInsurance
        : insuranceOption === 'withInsurance'
          ? this.creditRates.clientRateWithInsurance
          : this.creditRates.clientRateWithoutInsurance;

    const response = await generatePdfLkd({
      amount,
      termMonths,
      nominalRate,
    });

    this.pdfLkdBase64 = response.pdf_base64;

    return response.pdf_base64;
  }

  @computed
  get availableLoanTerms() {
    return this.creditRates?.availableLoanTerms ?? [];
  }
}
