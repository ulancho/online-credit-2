import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { getInsuranceCompaniesItems } from '../api/insureCompaniesDirectoryApi';

import type { InsuranceCompaniesItem } from '../models/InsuranceCompanies';

export class InsuranceCompaniesService {
  @observable InsuranceCompaniesItems: InsuranceCompaniesItem[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  async getInsuranceCompaniesItems() {
    const response = await getInsuranceCompaniesItems();
    runInAction(() => {
      this.InsuranceCompaniesItems = response;
    });
  }

  @computed
  get availableInsuranceCompaniesItems() {
    return this.InsuranceCompaniesItems;
  }
}
