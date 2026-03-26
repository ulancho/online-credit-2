import { AxiosError } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { processPassportImages, type PassportProcessResponse } from '../api/passportApi';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data;

    if (typeof responseData === 'string') {
      return responseData;
    }

    if (responseData && typeof responseData === 'object') {
      return JSON.stringify(responseData, null, 2);
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Не удалось обработать фотографии паспорта.';
};

export class PassportService {
  @observable private isSending = false;
  @observable private errorMessage: string | null = null;
  @observable.ref private processedPassport: PassportProcessResponse | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  resetStatus() {
    this.errorMessage = null;
  }

  @action
  reset() {
    this.isSending = false;
    this.errorMessage = null;
    this.processedPassport = null;
  }

  @action
  clearError() {
    this.errorMessage = null;
  }

  async processPassportPhotos(frontDataUrl: string, backDataUrl: string) {
    this.isSending = true;
    this.errorMessage = null;

    try {
      const response = await processPassportImages(frontDataUrl, backDataUrl);

      runInAction(() => {
        this.processedPassport = response;
        this.isSending = false;
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.errorMessage = getErrorMessage(error);
        this.isSending = false;
      });

      throw error;
    }
  }

  @computed
  get isLoading() {
    return this.isSending;
  }

  @computed
  get error(): string | null {
    return this.errorMessage;
  }

  @computed
  get passportData(): PassportProcessResponse | null {
    return this.processedPassport;
  }
}
