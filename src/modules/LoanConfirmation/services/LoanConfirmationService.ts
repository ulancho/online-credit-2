import { action, computed, makeObservable, observable } from 'mobx';

import { getCreditDirectoryItems } from '../api/creditDirectoryApi';
import { MBANK_CREDIT } from '../constants/payDateCode';

export class LoanConfirmationService {
  @observable payDateList: number[] | undefined = [];

  constructor() {
    makeObservable(this);
  }

  @action
  async getCreditDirectoryItems() {
    const response = await getCreditDirectoryItems();
    this.payDateList = response.find((item) => item.code === MBANK_CREDIT)?.payDateList;
  }

  @computed
  get availablePayDateList() {
    return this.payDateList;
  }
}
