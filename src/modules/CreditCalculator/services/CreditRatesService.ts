import { action, computed, observable } from 'mobx';

import { getCreditRates } from 'Modules/CreditCalculator/api/creditRatesApi.ts';

import type { CreditRatesResponse } from '../model/creditRates';

export class CreditRatesService {
  @observable creditRates: CreditRatesResponse | null = null;

  @action
  async getCreditRates() {
    this.creditRates = await getCreditRates();
  }

  @computed
  get availableLoanTerms() {
    return this.creditRates?.availableLoanTerms ?? [];
  }
}
