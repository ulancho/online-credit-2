import { action, makeObservable, observable } from 'mobx';

import { httpClient } from '@/common/api/httpClient';
import { errorHandler } from '@/common/utils/errorHandler';

import type { submitCreditType } from '@/modules/LoanConfirmation/services/LoanConfirmationService';

type FormDataSecondStep = {
  additionalPhoneNumber: string;
  relativeFullName: string;
  relationToBorrow: string;
};

export type SubmitApplicationType = FormDataSecondStep &
  submitCreditType & {
    applicationId: string;
    responseCode: string;
    serviceBranch: string;
    factOblast: string;
    factRaion: string;
    factCity: string;
    factStreet: string;
    factAddress: string;
    factCityCftId?: string;
  };

export class DataFillStep2Service {
  @observable formData: FormDataSecondStep | null = null;
  @observable awaiting: boolean = false;

  constructor() {
    makeObservable(this);
  }

  @action
  setFormData(formData: FormDataSecondStep) {
    this.formData = formData;
  }

  @action
  async submitApplication(data: SubmitApplicationType) {
    this.awaiting = true;
    try {
      await httpClient.post('credit/application/confirm', data);
      return { success: true };
    } catch (error) {
      const err = errorHandler(error);
      return { success: false, error: err };
    } finally {
      this.awaiting = false;
    }
  }
}
