import { isAxiosError } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  ERROR_CODE_TOO_MANY_REQUEST,
  ERROR_CODE_USER_NOT_FOUND,
} from 'Modules/startDesktop/services/helpers/constants.ts';

import {
  fetchPhoneAuthStatus,
  sendPhoneAuthRequest,
  type PhoneAuthRequestPayload,
  type PhoneAuthResponse,
  type PhoneAuthStatusRequestPayload,
} from '../api/phoneAuthApi.ts';

import type { QueryParamsService } from 'Common/services/queryParamsService.ts';
import type { StartInfoService } from 'Modules/startDesktop/services/startInfoService.ts';

export class PhoneAuthService {
  @observable private isSending = false;
  @observable private errorMessage: string | null = null;
  @observable private isPhoneAuthSent = false;
  @observable private phoneAuthResponse: PhoneAuthResponse | null = null;
  private statusPollingTimer: ReturnType<typeof setInterval> | null = null;
  private isStatusPollingActive = false;
  private isFetchingStatus = false;

  constructor(
    private readonly startInfoService: StartInfoService,
    private readonly queryParamsService: QueryParamsService,
    private readonly phoneAuthRequester: typeof sendPhoneAuthRequest = sendPhoneAuthRequest,
    private readonly phoneAuthStatusFetcher: typeof fetchPhoneAuthStatus = fetchPhoneAuthStatus,
  ) {
    makeObservable(this);
  }

  @action
  resetStatus() {
    this.stopStatusPolling();
    this.isPhoneAuthSent = false;
    this.errorMessage = null;
    this.phoneAuthResponse = null;
  }

  @action
  async sendPhoneAuth(phone: string) {
    if (!phone.trim()) {
      return;
    }

    this.stopStatusPolling();
    this.isSending = true;
    this.errorMessage = null;
    this.isPhoneAuthSent = false;
    this.phoneAuthResponse = null;

    const payload = this.buildPhoneAuthPayload(phone.trim());

    try {
      const response = await this.phoneAuthRequester(payload);

      runInAction(() => {
        this.phoneAuthResponse = response;
        this.isPhoneAuthSent = true;
      });

      if (response.status === 'BOUND') {
        this.startStatusPolling(response.id);
      } else {
        this.stopStatusPolling();
      }
    } catch (error) {
      let message = 'Не удалось отправить запрос на вход.';

      if (isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData.code === ERROR_CODE_USER_NOT_FOUND) {
          message = responseData.message;
        } else if (responseData.code === ERROR_CODE_TOO_MANY_REQUEST) {
          message = responseData.message;
        } else if (typeof error.message === 'string' && error.message.trim()) {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      runInAction(() => {
        this.errorMessage = message;
        this.isPhoneAuthSent = false;
        this.phoneAuthResponse = null;
      });
      this.stopStatusPolling();
    } finally {
      runInAction(() => {
        this.isSending = false;
      });
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
  get isSuccess() {
    return this.isPhoneAuthSent;
  }

  @computed
  get response(): PhoneAuthResponse | null {
    return this.phoneAuthResponse;
  }

  @computed
  get redirectUrl(): string | null {
    return this.phoneAuthResponse?.redirect_url ?? null;
  }

  private buildPhoneAuthPayload(phone: string): PhoneAuthRequestPayload {
    const queryParams = this.queryParamsService.queryParams;
    const sanitizedPhone = phone.replace(/\+/g, '');
    const clientId = this.startInfoService.startInfo?.clientId ?? queryParams.clientId;

    return {
      phone: sanitizedPhone,
      scope: queryParams.scope,
      state: queryParams.state,
      client_id: clientId,
      redirect_uri: queryParams.redirectUri,
      response_type: queryParams.responseType,
      code_challenge: queryParams.codeChallenge,
      code_challenge_method: queryParams.codeChallengeMethod,
      original_url: queryParams.originalUrl || null,
    };
  }

  private buildPhoneAuthStatusPayload(id: string): PhoneAuthStatusRequestPayload {
    const queryParams = this.queryParamsService.queryParams;
    const clientId = this.startInfoService.startInfo?.clientId ?? queryParams.clientId;

    return {
      id,
      state: queryParams.state,
      client_id: clientId,
      redirect_uri: queryParams.redirectUri,
      original_url: queryParams.originalUrl || null,
    };
  }

  private startStatusPolling(id: string) {
    if (!id) {
      return;
    }

    this.stopStatusPolling();
    this.isStatusPollingActive = true;

    const poll = async () => {
      if (!this.isStatusPollingActive || this.isFetchingStatus) {
        return;
      }

      this.isFetchingStatus = true;

      try {
        const payload = this.buildPhoneAuthStatusPayload(id);
        const response = await this.phoneAuthStatusFetcher(payload);

        if (!this.isStatusPollingActive) {
          return;
        }

        runInAction(() => {
          this.phoneAuthResponse = response;
          this.isPhoneAuthSent = true;
        });

        if (response.status !== 'BOUND') {
          this.stopStatusPolling();
        }
      } catch (error) {
        if (!this.isStatusPollingActive) {
          return;
        }

        const message =
          error instanceof Error ? error.message : 'Не удалось обновить статус входа.';

        runInAction(() => {
          this.errorMessage = message;
          this.isPhoneAuthSent = false;
          this.phoneAuthResponse = null;
        });

        this.stopStatusPolling();
      } finally {
        this.isFetchingStatus = false;
      }
    };

    void poll();
    this.statusPollingTimer = setInterval(() => {
      void poll();
    }, 1500);
  }

  private stopStatusPolling() {
    this.isStatusPollingActive = false;

    if (this.statusPollingTimer !== null) {
      clearInterval(this.statusPollingTimer);
      this.statusPollingTimer = null;
    }

    this.isFetchingStatus = false;
  }
}
