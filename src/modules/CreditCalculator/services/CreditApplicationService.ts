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
  details?: Record<string, string[]>;
};

type ModalContentType = {
  title: string;
  description?: string;
};

const ACCOUNT_NOT_AVAILABLE_ERROR_CODE =
  'unified.svc.biz.ib.cbk.private.credits.error.account-not-available-for-credit';

const NOT_ENOUGH_DATA_ERROR_CODE = 'unified.svc.biz.ib.cbk.private.credits.error.not-enough-data';

export class CreditApplicationValidationError extends Error {
  details: Record<string, string[]>;

  constructor(details: Record<string, string[]>) {
    super('Credit application validation failed');
    this.name = 'CreditApplicationValidationError';
    this.details = details;
  }
}

export class CreditApplicationService {
  @observable.ref
  private accountNotAvailableModalContent: ModalContentType | null = null;
  @observable.ref
  private notEnoughDataModalContent: ModalContentType | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  resetAccountNotAvailableModal() {
    this.accountNotAvailableModalContent = null;
  }

  @action
  resetNotEnoughDataModal() {
    this.notEnoughDataModalContent = null;
  }

  @action
  async initCreditApplication(payload: CreditApplicationInitParams) {
    this.accountNotAvailableModalContent = null;

    try {
      return await initCreditApplication({
        ...payload,
        acceptAgreement: true,
        deviceReport: 'test',
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const responseData = error.response?.data as InitCreditApplicationErrorResponse | undefined;
        const validationDetails = responseData?.details || {};

        if (error.response?.status === 400 && Object.keys(validationDetails).length) {
          throw new CreditApplicationValidationError(validationDetails);
        }

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

        if (error.response?.status === 500 && responseData?.code === NOT_ENOUGH_DATA_ERROR_CODE) {
          runInAction(() => {
            this.notEnoughDataModalContent = {
              title: responseData.message || '',
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

  @computed
  get notEnoughModal() {
    return this.notEnoughDataModalContent;
  }
}
