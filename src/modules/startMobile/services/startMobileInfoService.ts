import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchStartMobileAuthorization,
  type StartMobileRequestPayload,
  type StartMobileResponse,
} from '../api/startMobileApi.ts';

import type { StartQueryParams } from 'Common/hooks/useQueryParams.ts';
import type { QueryParamsService } from 'Common/services/queryParamsService.ts';

interface StartMobileData {
  id: string;
  redirectUrl: string | null;
  deepLinkUrl: string | null;
  status: string;
  expiresIn: string;
}

export class StartMobileInfoService {
  @observable.ref private data: StartMobileData | null = null;
  @observable private isFetchingStartMobile = false;
  @observable private startMobileErrorMessage: string | null = null;

  constructor(
    private readonly queryParamsService: QueryParamsService,
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
    this.isFetchingStartMobile = false;
    this.startMobileErrorMessage = null;
  }

  @action
  async fetchStartMobileInfo() {
    if (this.isFetchingStartMobile) {
      return;
    }

    this.isFetchingStartMobile = true;
    this.startMobileErrorMessage = null;

    const payload = this.buildAuthorizationPayload(this.queryParamsService.queryParams);

    try {
      const response = await this.startMobileFetcher(payload);

      runInAction(() => {
        this.data = this.transformAuthorizationData(response);
      });

      if (this.data?.deepLinkUrl) {
        window.location.replace(this.data?.deepLinkUrl);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось получить данные авторизации для мобильного приложения.';

      runInAction(() => {
        this.data = null;
        this.startMobileErrorMessage = message;
      });
    } finally {
      runInAction(() => {
        this.isFetchingStartMobile = false;
      });
    }
  }

  @computed
  get startMobileData(): StartMobileData | null {
    return this.data ? { ...this.data } : null;
  }

  @computed
  get isLoadingStartMobile() {
    return this.isFetchingStartMobile;
  }

  @computed
  get startMobileError() {
    return this.startMobileErrorMessage;
  }

  private buildAuthorizationPayload(params: StartQueryParams): StartMobileRequestPayload {
    return {
      scope: params.scope,
      state: params.state,
      client_id: params.clientId,
      redirect_uri: params.redirectUri,
      original_url: params.originalUrl,
      response_type: params.responseType,
      code_challenge: params.codeChallenge,
      code_challenge_method: params.codeChallengeMethod,
    };
  }

  private transformAuthorizationData(data: StartMobileResponse): StartMobileData {
    return {
      id: data.id,
      redirectUrl: data.redirect_url,
      deepLinkUrl: data.deep_link_url,
      status: data.status,
      expiresIn: data.expires_in,
    };
  }
}
