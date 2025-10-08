import { isAxiosError } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { sendPhoneAuthRequest, type PhoneAuthRequestPayload } from '../api/phoneAuthApi.ts';

import type { StartQueryParamsService } from './startQueryParamsService.ts';

export class PhoneAuthService {
  @observable private isSendingPhoneAuth = false;
  @observable private phoneAuthErrorMessage: string | null = null;
  @observable private isPhoneAuthSent = false;

  constructor(
    private readonly queryParamsService: StartQueryParamsService,
    private readonly phoneAuthRequester: typeof sendPhoneAuthRequest = sendPhoneAuthRequest,
  ) {
    makeObservable(this);
  }

  @action
  resetStatus() {
    this.isPhoneAuthSent = false;
    this.phoneAuthErrorMessage = null;
  }

  @action
  async sendPhoneAuth(phone: string) {
    if (!phone.trim()) {
      return;
    }

    this.isSendingPhoneAuth = true;
    this.phoneAuthErrorMessage = null;
    this.isPhoneAuthSent = false;

    const payload = this.buildPhoneAuthPayload(phone.trim());

    try {
      await this.phoneAuthRequester(payload);

      runInAction(() => {
        this.isPhoneAuthSent = true;
      });
    } catch (error) {
      let message = 'Не удалось отправить запрос на вход.';

      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          message = 'Такой номер не найден, проверьте номер';
        } else if (typeof error.message === 'string' && error.message.trim()) {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      runInAction(() => {
        this.phoneAuthErrorMessage = message;
        this.isPhoneAuthSent = false;
      });
    } finally {
      runInAction(() => {
        this.isSendingPhoneAuth = false;
      });
    }
  }

  @computed
  get isLoading() {
    return this.isSendingPhoneAuth;
  }

  @computed
  get error(): string | null {
    return this.phoneAuthErrorMessage;
  }

  @computed
  get isSuccess() {
    return this.isPhoneAuthSent;
  }

  private buildPhoneAuthPayload(phone: string): PhoneAuthRequestPayload {
    const queryParams = this.queryParamsService.queryParams;
    const sanitizedPhone = phone.replace(/\+/g, '');

    return {
      phone: sanitizedPhone,
      scope: queryParams.scope,
      state: queryParams.state,
      client_id: queryParams.clientId,
      redirect_uri: queryParams.redirectUri,
      response_type: queryParams.responseType,
      code_challenge: queryParams.codeChallenge,
      code_challenge_method: queryParams.codeChallengeMethod,
      original_url: queryParams.originalUrl || null,
    };
  }
}
