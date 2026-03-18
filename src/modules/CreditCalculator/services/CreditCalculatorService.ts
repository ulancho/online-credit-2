import { action, computed, observable } from 'mobx';

import { httpClient } from '@/common/api/httpClient';

import { CREDIT_RATES_API } from '../constants/urls';

import type { CreditRatesType } from '../model/creditRates';

export class CreditCalculatorService {
  @observable creditRates: CreditRatesType | null = null;

  @action
  async getCreditRates() {
    try {
      const response = await httpClient.get(`${CREDIT_RATES_API}`);
      this.creditRates = response.data;
    } finally {
      console.log('finally');
    }
  }
  @computed
  get availableLoanTerms() {
    return this.creditRates?.availableLoanTerms ?? [];
  }
}
