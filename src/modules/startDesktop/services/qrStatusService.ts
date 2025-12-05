import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchQrStatus,
  type QrStatusRequestPayload,
  type QrStatusResponse,
} from '../api/qrStatusApi.ts';

import type { StartInfoService } from './startInfoService.ts';
import type { QueryParamsService } from 'Common/services/queryParamsService.ts';
import type { AuthStatus } from 'Common/types/authStatus.ts';
import type { QrInfoService } from 'Modules/startDesktop/services/qrInfoService.ts';

interface QrStatusData {
  id: string;
  deeplinkUrl: string;
  redirectUrl: string;
  status: AuthStatus;
  expiresIn: string;
  expirationSeconds: number;
}

function createDefaultQrStatus(): QrStatusData | null {
  return null;
}

export class QrStatusService {
  @observable.ref private data: QrStatusData | null = createDefaultQrStatus();
  @observable private isFetching = false;
  @observable private errorMessage: string | null = null;
  @observable private errorRedirectUri: string | null = null;
  @observable private errorStatusCode: number | null = null;
  private isRefreshingQrInfo = false;

  constructor(
    private readonly startInfoService: StartInfoService,
    private readonly queryParamsService: QueryParamsService,
    private readonly qrInfoService: QrInfoService,
    private readonly qrStatusFetcher: typeof fetchQrStatus = fetchQrStatus,
  ) {
    makeObservable(this);
  }

  @action
  reset() {
    this.data = createDefaultQrStatus();
    this.isFetching = false;
    this.errorMessage = null;
    this.errorRedirectUri = null;
    this.errorStatusCode = null;
  }

  @action
  async fetchQrStatus(id: string) {
    if (this.isRefreshingQrInfo) {
      return;
    }

    this.isFetching = true;
    this.errorMessage = null;

    const payload = this.buildRequestPayload(id);

    try {
      const data = await this.qrStatusFetcher(payload);

      runInAction(() => {
        this.data = this.transformResponse(data);
      });

      if (data.status === 'EXPIRED') {
        await this.handleExpiredStatus();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось получить статус QR-кода.';

      const status = (error as { response?: { status?: number } }).response?.status ?? null;
      const redirectUri =
        this.startInfoService.startInfo?.redirectUri ??
        this.queryParamsService.queryParamRedirectUri ??
        null;

      runInAction(() => {
        this.data = null;
        this.errorMessage = message;
        this.errorRedirectUri = redirectUri;
        this.errorStatusCode = status;
      });
    } finally {
      runInAction(() => {
        this.isFetching = false;
      });
    }
  }

  @computed
  get qrStatusData(): QrStatusData | null {
    return this.data ? { ...this.data } : null;
  }

  @computed
  get status(): AuthStatus | null {
    return this.data?.status ?? null;
  }

  @computed
  get redirectUrl(): string | null {
    return this.data?.redirectUrl ?? null;
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

  private buildRequestPayload(id: string): QrStatusRequestPayload {
    const queryParams = this.queryParamsService.queryParams;

    return {
      id,
      state: queryParams.state,
      redirect_uri: queryParams.redirectUri,
      client_id: queryParams.clientId,
    };
  }

  private transformResponse(data: QrStatusResponse): QrStatusData {
    return {
      id: data.id,
      deeplinkUrl: data.deeplink_url,
      redirectUrl: data.redirect_url,
      status: data.status,
      expiresIn: data.expires_in,
      expirationSeconds: data.expiration_seconds,
    };
  }

  private async handleExpiredStatus() {
    if (this.isRefreshingQrInfo) {
      return;
    }

    this.isRefreshingQrInfo = true;

    try {
      await this.qrInfoService.fetchQrInfo();
    } finally {
      this.isRefreshingQrInfo = false;
    }
  }
}
