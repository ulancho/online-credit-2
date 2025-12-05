import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchStartMobileStatus,
  type StartMobileStatusRequestPayload,
  type StartMobileStatusResponse,
} from '../api/startMobileApi.ts';

import type { QueryParamsService } from 'Common/services/queryParamsService.ts';
import type { AuthStatus } from 'Common/types/authStatus.ts';

interface StartMobileStatusData {
  id: string;
  redirectUrl: string | null;
  deepLinkUrl: string | null;
  status: AuthStatus;
  expiresIn: string;
}

export class StartMobileStatusService {
  @observable.ref private data: StartMobileStatusData | null = null;
  @observable private isFetching = false;
  @observable private errorMessage: string | null = null;
  private pollingIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly queryParamsService: QueryParamsService,
    private readonly startMobileStatusFetcher: typeof fetchStartMobileStatus = fetchStartMobileStatus,
  ) {
    makeObservable(this);
  }

  @action
  reset() {
    this.stopStatusPolling();
    this.data = null;
    this.isFetching = false;
    this.errorMessage = null;
  }

  @action
  async fetchStartMobileStatus(id: string) {
    if (this.isFetching) {
      return;
    }

    this.isFetching = true;
    this.errorMessage = null;

    const payload = this.buildStatusPayload(id);

    try {
      const response = await this.startMobileStatusFetcher(payload);

      runInAction(() => {
        this.data = this.transformStatusData(response);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось получить статус авторизации мобильного приложения.';

      runInAction(() => {
        this.data = null;
        this.errorMessage = message;
      });
    } finally {
      runInAction(() => {
        this.isFetching = false;
      });
    }
  }

  @action
  startStatusPolling(id: string) {
    this.stopStatusPolling();

    void this.fetchStartMobileStatus(id);

    this.pollingIntervalId = setInterval(() => {
      void this.fetchStartMobileStatus(id);
    }, 1000);
  }

  @action
  stopStatusPolling() {
    if (this.pollingIntervalId !== null) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
  }

  @computed
  get mobileStatus(): StartMobileStatusData | null {
    return this.data ? { ...this.data } : null;
  }

  @computed
  get isLoadingStatus() {
    return this.isFetching;
  }

  @computed
  get mobileStatusError() {
    return this.errorMessage;
  }

  private buildStatusPayload(id: string): StartMobileStatusRequestPayload {
    return {
      id,
      state: this.queryParamsService.queryParamState,
      redirect_uri: this.queryParamsService.queryParamRedirectUri,
      original_url: this.queryParamsService.queryParamOriginalUrl ?? null,
    };
  }

  private transformStatusData(data: StartMobileStatusResponse): StartMobileStatusData {
    return {
      id: data.id,
      redirectUrl: data.redirect_url,
      deepLinkUrl: data.deep_link_url,
      status: data.status,
      expiresIn: data.expires_in,
    };
  }
}
