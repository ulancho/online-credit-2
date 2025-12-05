import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { fetchQrInfo, type QrInfoRequestPayload, type QrInfoResponse } from '../api/qrInfoApi.ts';

import type { QueryParamsService } from 'Common/services/queryParamsService.ts';

interface QrInfoData {
  id: string;
  deeplinkUrl: string;
  redirectUrl: string;
  status: string;
  expiresIn: string;
}

function createDefaultQrInfo(): QrInfoData | null {
  return null;
}

export class QrInfoService {
  @observable.ref private data: QrInfoData | null = createDefaultQrInfo();
  @observable private isFetching = false;
  @observable private errorMessage: string | null = null;
  @observable private errorRedirectUri: string | null = null;
  @observable private errorStatusCode: number | null = null;

  constructor(
    private readonly queryParamsService: QueryParamsService,
    private readonly qrInfoFetcher: typeof fetchQrInfo = fetchQrInfo,
  ) {
    makeObservable(this);
  }

  @action
  reset() {
    this.data = createDefaultQrInfo();
    this.isFetching = false;
    this.errorMessage = null;
    this.errorRedirectUri = null;
    this.errorStatusCode = null;
  }

  @action
  async fetchQrInfo() {
    this.isFetching = true;
    this.errorMessage = null;
    this.errorRedirectUri = null;
    this.errorStatusCode = null;

    const payload = this.buildQrInfoPayload();

    try {
      const data = await this.qrInfoFetcher(payload);

      runInAction(() => {
        this.data = this.transformResponse(data);
      });
    } catch (error) {
      const response = (
        error as {
          response?: { status?: number; data?: { redirect_uri?: string | null } };
        }
      ).response;

      let message = error instanceof Error ? error.message : 'Не удалось получить данные QR-кода.';

      if (response?.status === 500) {
        message = 'Ошибка на сервере';
      }

      const redirectUri =
        response?.data?.redirect_uri ?? this.queryParamsService.queryParamRedirectUri;
      const status = response?.status ?? null;

      runInAction(() => {
        this.data = null;
        this.errorMessage = message;
        this.errorRedirectUri = redirectUri ?? null;
        this.errorStatusCode = status;
      });
    } finally {
      runInAction(() => {
        this.isFetching = false;
      });
    }
  }

  @computed
  get qrInfo(): QrInfoData | null {
    return this.data ? { ...this.data } : null;
  }

  @computed
  get deeplinkUrl(): string | null {
    return this.data?.deeplinkUrl ?? null;
  }

  @computed
  get isLoading() {
    return this.isFetching;
  }

  @computed
  get error(): string | null {
    return this.errorMessage;
  }

  @computed
  get redirectUriOnError(): string | null {
    return this.errorRedirectUri;
  }

  @computed
  get statusCodeOnError(): number | null {
    return this.errorStatusCode;
  }

  private buildQrInfoPayload(): QrInfoRequestPayload {
    const queryParams = this.queryParamsService.queryParams;

    return {
      scope: queryParams.scope,
      state: queryParams.state,
      client_id: queryParams.clientId,
      redirect_uri: queryParams.redirectUri,
      response_type: queryParams.responseType,
      code_challenge: queryParams.codeChallenge,
      code_challenge_method: queryParams.codeChallengeMethod,
    };
  }

  private transformResponse(data: QrInfoResponse): QrInfoData {
    return {
      id: data.id,
      deeplinkUrl: data.deeplink_url,
      redirectUrl: data.redirect_url,
      status: data.status,
      expiresIn: data.expires_in,
    };
  }
}
