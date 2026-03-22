import { action, computed, observable } from 'mobx';

import { getPublicLoanOffer } from 'Modules/CreditCalculator/api/publicLoanOfferApi.ts';

import type { PublicLoanOfferResponse } from 'Modules/CreditCalculator/models/publicLoanOffer.ts';

export class PublicLoanOfferService {
  @observable publicLoanOffer: PublicLoanOfferResponse | null = null;

  @action
  async getPublicLoanOffer() {
    this.publicLoanOffer = await getPublicLoanOffer();
  }

  @computed
  get agreementText() {
    return this.publicLoanOffer?.agreementText;
  }
}
