import { action, computed, observable } from 'mobx';

import {
  downloadOfferFile as downloadOfferFileApi,
  getLoanOffer,
  getPublicLoanOffer,
} from 'Modules/CreditCalculator/api/loanOffersApi.ts';

import type { LoanOfferResponse } from 'Modules/CreditCalculator/models/publicLoanOffer.ts';

export class LoanOffersService {
  @observable publicLoanOffer: LoanOfferResponse | null = null;
  @observable loanOffer: LoanOfferResponse | null = null;

  @action
  async getPublicLoanOffer() {
    this.publicLoanOffer = await getPublicLoanOffer();
  }

  @action
  async getLoanOffer() {
    this.loanOffer = await getLoanOffer();
  }

  async downloadOfferFile(code: string, hash: string) {
    return downloadOfferFileApi(code, hash);
  }

  @computed
  get publicLoanOfferData() {
    return this.publicLoanOffer;
  }

  @computed
  get loanOfferData() {
    return this.loanOffer;
  }
}
