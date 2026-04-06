import { AxiosError } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  type CreditApplicationInitPayload,
  OTP_TYPE_CONSTANTS,
  type OtpType,
} from 'Modules/CreditCalculator/api/creditApplicationApi.ts';
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

type ModalType = 'accountNotAvailable' | 'notEnoughData' | 'hasActiveRequest';

type CreditApplicationModalState = {
  type: ModalType;
  content: ModalContentType;
};

const ACCOUNT_NOT_AVAILABLE_ERROR_CODE =
  'unified.svc.biz.ib.cbk.private.credits.error.account-not-available-for-credit';

const NOT_ENOUGH_DATA_ERROR_CODE = 'unified.svc.biz.ib.cbk.private.credits.error.not-enough-data';
const HAS_ACTIVE_REQUEST_ERROR_CODE =
  'unified.svc.biz.ib.cbk.private.credits.error.user-has-active-request';

export class CreditApplicationValidationError extends Error {
  details: Record<string, string[]>;

  constructor(details: Record<string, string[]>) {
    super('Credit application validation failed');
    this.name = 'CreditApplicationValidationError';
    this.details = details;
  }
}

export class CreditApplicationService {
  @observable
  private activeModal: CreditApplicationModalState | null = null;
  @observable
  awaiting: boolean = false;
  @observable
  private otpType: OtpType = OTP_TYPE_CONSTANTS.SOCFOND_OTP;

  constructor() {
    makeObservable(this);
  }

  @action
  resetModal() {
    this.activeModal = null;
  }

  @action
  async initCreditApplication(payload: CreditApplicationInitParams) {
    this.activeModal = null;
    this.awaiting = true;
    this.otpType = OTP_TYPE_CONSTANTS.SOCFOND_OTP;

    try {
      const deviceReport = await this.getDeviceReport();

      const response = await initCreditApplication({
        ...payload,
        acceptAgreement: true,
        deviceReport,
      });

      runInAction(() => {
        if (response?.data?.type) {
          this.otpType = response.data.type;
        }
      });

      return response;
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
            this.activeModal = {
              type: 'accountNotAvailable',
              content: {
                title: responseData.details?.title?.[0] || '',
                description: responseData.message || '',
              },
            };
          });

          return null;
        }

        if (error.response?.status === 500 && responseData?.code === NOT_ENOUGH_DATA_ERROR_CODE) {
          runInAction(() => {
            this.activeModal = {
              type: 'notEnoughData',
              content: {
                title: responseData.message || '',
              },
            };
          });

          return null;
        }

        if (
          error.response?.status === 500 &&
          responseData?.code === HAS_ACTIVE_REQUEST_ERROR_CODE
        ) {
          runInAction(() => {
            this.activeModal = {
              type: 'hasActiveRequest',
              content: {
                title: responseData.message || '',
              },
            };
          });

          return null;
        }
      }

      throw error;
    } finally {
      runInAction(() => {
        this.awaiting = false;
      });
    }
  }

  @computed
  get modal() {
    return this.activeModal;
  }

  @computed
  get currentOtpType() {
    return this.otpType;
  }

  private async getDeviceReport() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (typeof window.deviceReport === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const response = await window.deviceReport();

      return response ? String(response) : '';
    }

    return '';
  }
}
