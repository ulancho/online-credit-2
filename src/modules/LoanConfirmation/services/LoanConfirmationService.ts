import { action, computed, makeObservable, observable } from 'mobx';

import { getCreditDirectoryItems } from '../api/creditDirectoryApi';
import { MBANK_CREDIT } from '../constants/payDateCode';

export type submitCreditType = {
  acceptAgreement?: boolean;
  insureCompanyId?: string;
  paymentDay?: number;
  type?: string;
};

export class LoanConfirmationService {
  @observable payDateList: number[] | undefined = [];
  @observable selectedDay: number = 0;
  @observable dataSubmitCredit: submitCreditType | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  async getCreditDirectoryItems() {
    const response = await getCreditDirectoryItems();
    this.selectedDay = 0;
    this.payDateList = response.find((item) => item.code === MBANK_CREDIT)?.payDateList;
  }

  @action
  async setSubmitCredit(data: submitCreditType) {
    this.dataSubmitCredit = data;
  }

  @computed
  get availablePayDateList() {
    return this.payDateList;
  }

  set selectedPaymentDay(value: number) {
    this.selectedDay = value;
  }

  @computed
  get selectedPaymentDay() {
    return this.selectedDay;
  }
}
