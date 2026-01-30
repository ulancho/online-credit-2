import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchStartMobileAuthorization,
  type StartMobileRequestPayload,
  type StartMobileResponse,
} from '../api/startMobileApi.ts';

import type { StartQueryParams } from 'Common/hooks/useQueryParams.ts';
import type { QueryParamsService } from 'Common/services/queryParamsService.ts';
import type { StartMobileStatusService } from 'Modules/startMobile/services/startMobileStatusService.ts';

interface StartMobileData {
  id: string;
  redirectUrl: string | null;
  deepLinkUrl: string | null;
  status: string;
  expiresIn: string;
}

export class StartMobileInfoService {
  @observable.ref private data: StartMobileData | null = null;
  @observable private isFetching = false;
  @observable private errorMessage: string | null = null;

  constructor(
    private readonly queryParamsService: QueryParamsService,
    private readonly startMobileStatusService: StartMobileStatusService,
    private readonly startMobileFetcher: typeof fetchStartMobileAuthorization = fetchStartMobileAuthorization,
  ) {
    makeObservable(this);
  }

  @action
  setQueryParams(queryParams: StartQueryParams) {
    this.queryParamsService.setQueryParams(queryParams);
  }

  @action
  reset() {
    this.queryParamsService.reset();
    this.data = null;
    this.isFetching = false;
    this.errorMessage = null;
    this.startMobileStatusService.reset();
  }

  @action
  async fetchStartMobileInfo(): Promise<StartMobileData | null> {
    if (this.isFetching) {
      return this.data;
    }

    this.isFetching = true;
    this.errorMessage = null;

    const payload = this.buildRequestPayload(this.queryParamsService.queryParams);
    let result: StartMobileData | null = null;

    try {
      const response = await this.startMobileFetcher(payload);
      const transformedData = this.transformResponseData(response);

      runInAction(() => {
        this.data = transformedData;
      });

      this.startMobileStatusService.startStatusPolling(transformedData.id);

      result = transformedData;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось получить данные авторизации для мобильного приложения.';

      runInAction(() => {
        this.data = null;
        this.errorMessage = message;
      });
      result = null;
    } finally {
      runInAction(() => {
        this.isFetching = false;
      });
    }
    return result;
  }

  @computed
  get startMobileData(): StartMobileData | null {
    return this.data ? { ...this.data } : null;
  }

  @computed
  get isLoadingStartMobile() {
    return this.isFetching;
  }

  @computed
  get startMobileError() {
    return this.errorMessage;
  }

  private buildRequestPayload(params: StartQueryParams): StartMobileRequestPayload {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : null;

    return {
      scope: params.scope,
      state: params.state,
      client_id: params.clientId,
      redirect_uri: params.redirectUri,
      original_url: params.originalUrl,
      response_type: params.responseType,
      code_challenge: params.codeChallenge,
      code_challenge_method: params.codeChallengeMethod,
      url: currentUrl,
    };
  }

  private transformResponseData(data: StartMobileResponse): StartMobileData {
    return {
      id: data.id,
      redirectUrl: data.redirect_url,
      deepLinkUrl: data.deep_link_url,
      status: data.status,
      expiresIn: data.expires_in,
    };
  }
}
