import { AxiosError } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { type CreditApplicationInitPayload } from 'Modules/CreditCalculator/api/creditApplicationApi.ts';
import { initCreditApplication } from 'Modules/CreditCalculator/api/creditApplicationApi.ts';

type CreditApplicationInitParams = Omit<
  CreditApplicationInitPayload,
  'acceptAgreement' | 'deviceReport'
>;

type InitCreditApplicationErrorResponse = {
  code?: string;
  message?: string;
  details?: {
    title?: string[];
  };
};

type AccountNotAvailableModalContent = {
  title: string;
  description: string;
};

const ACCOUNT_NOT_AVAILABLE_ERROR_CODE =
  'unified.svc.biz.ib.cbk.private.credits.error.account-not-available-for-credit';

export class CreditApplicationService {
  @observable.ref
  private accountNotAvailableModalContent: AccountNotAvailableModalContent | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  resetAccountNotAvailableModal() {
    this.accountNotAvailableModalContent = null;
  }

  @action
  async initCreditApplication(payload: CreditApplicationInitParams) {
    this.accountNotAvailableModalContent = null;

    try {
      return await initCreditApplication({
        ...payload,
        acceptAgreement: true,
        deviceReport: '',
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const responseData = error.response?.data as InitCreditApplicationErrorResponse | undefined;

        if (
          error.response?.status === 500 &&
          responseData?.code === ACCOUNT_NOT_AVAILABLE_ERROR_CODE
        ) {
          runInAction(() => {
            this.accountNotAvailableModalContent = {
              title: responseData.details?.title?.[0] || '',
              description: responseData.message || '',
            };
          });

          return null;
        }
      }

      throw error;
    }
  }

  @computed
  get accountNotAvailableModal() {
    return this.accountNotAvailableModalContent;
  }
}
