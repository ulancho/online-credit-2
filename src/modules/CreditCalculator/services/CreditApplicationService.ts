import { action } from 'mobx';

import {
  initCreditApplication,
  type CreditApplicationInitPayload,
} from 'Modules/CreditCalculator/api/creditApplicationApi.ts';

type CreditApplicationInitParams = Omit<
  CreditApplicationInitPayload,
  'acceptAgreement' | 'deviceReport'
>;

export class CreditApplicationService {
  @action
  async initCreditApplication(payload: CreditApplicationInitParams) {
    return initCreditApplication({
      ...payload,
      acceptAgreement: true,
      deviceReport: '',
    });
  }
}
