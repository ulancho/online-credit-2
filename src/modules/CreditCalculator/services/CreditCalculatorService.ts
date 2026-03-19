import axios from 'axios';
import { action, computed, observable } from 'mobx';

import { httpClient } from '@/common/api/httpClient';

import { CREDIT_RATES_API } from '../constants/urls';

import type { CreditRatesType } from '../model/creditRates';
import type { DirectoryList } from '../model/directory';

export class CreditCalculatorService {
  @observable creditRates: CreditRatesType | null = null;
  @observable directoryList: DirectoryList[] = [];

  @action
  async getCreditRates() {
    try {
      const response = await httpClient.get(`${CREDIT_RATES_API}`);
      this.creditRates = response.data;
    } finally {
      console.log('finally');
    }
  }

  @action
  public async loadDirectory(code: string) {
    try {
      const response = await axios.post(`svc-common-directory/v2/unauthorized-api/directory`, {
        code,
        namespace: 'cbk',
        source: 'private',
      });

      this.directoryList = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  @computed
  get availableLoanTerms() {
    return this.creditRates?.availableLoanTerms ?? [];
  }
}
