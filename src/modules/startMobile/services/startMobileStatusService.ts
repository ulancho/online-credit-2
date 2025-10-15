import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchStartMobileStatus,
  type StartMobileStatusRequestPayload,
  type StartMobileStatusResponse,
} from '../api/startMobileApi.ts';

import type { QueryParamsService } from 'Common/services/queryParamsService.ts';

interface StartMobileStatusData {
  id: string;
  redirectUrl: string | null;
  deepLinkUrl: string | null;
  status: string;
  expiresIn: string;
}

export class StartMobileStatusService {
  @observable.ref private statusData: StartMobileStatusData | null = null;
  @observable private isFetchingStatus = false;
  @observable private statusErrorMessage: string | null = null;
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
    this.statusData = null;
    this.isFetchingStatus = false;
    this.statusErrorMessage = null;
  }

  @action
  async fetchStartMobileStatus(id: string) {
    if (this.isFetchingStatus) {
      return;
    }

    this.isFetchingStatus = true;
    this.statusErrorMessage = null;

    const payload = this.buildStatusPayload(id);

    try {
      const response = await this.startMobileStatusFetcher(payload);

      runInAction(() => {
        this.statusData = this.transformStatusData(response);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось получить статус авторизации мобильного приложения.';

      runInAction(() => {
        this.statusData = null;
        this.statusErrorMessage = message;
      });
    } finally {
      runInAction(() => {
        this.isFetchingStatus = false;
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
    return this.statusData ? { ...this.statusData } : null;
  }

  @computed
  get isLoadingStatus() {
    return this.isFetchingStatus;
  }

  @computed
  get mobileStatusError() {
    return this.statusErrorMessage;
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
