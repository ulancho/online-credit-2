import { action, computed, observable } from 'mobx';

import { getLoanOffer, getPublicLoanOffer } from 'Modules/CreditCalculator/api/loanOffersApi.ts';

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

  @computed
  get publicLoanOfferData() {
    return this.publicLoanOffer;
  }

  @computed
  get loanOfferData() {
    return this.loanOffer;
  }
}
