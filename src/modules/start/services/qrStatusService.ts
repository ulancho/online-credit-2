import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchQrStatus,
  type QrStatusRequestPayload,
  type QrStatusResponse,
} from '../api/qrStatusApi.ts';

import type { StartInfoService } from './startInfoService.ts';

interface QrStatusData {
  id: string;
  deeplinkUrl: string;
  redirectUrl: string;
  status: string;
  expiresIn: string;
}

function createDefaultQrStatus(): QrStatusData | null {
  return null;
}

export class QrStatusService {
  @observable.ref private qrStatusData: QrStatusData | null = createDefaultQrStatus();
  @observable private isFetchingQrStatus = false;
  @observable private qrStatusErrorMessage: string | null = null;

  constructor(
    private readonly startInfoService: StartInfoService,
    private readonly qrStatusFetcher: typeof fetchQrStatus = fetchQrStatus,
  ) {
    makeObservable(this);
  }

  @action
  reset() {
    this.qrStatusData = createDefaultQrStatus();
    this.isFetchingQrStatus = false;
    this.qrStatusErrorMessage = null;
  }

  @action
  async fetchQrStatus(id: string) {
    this.isFetchingQrStatus = true;
    this.qrStatusErrorMessage = null;

    const payload = this.buildQrStatusPayload(id);

    try {
      const data = await this.qrStatusFetcher(payload);

      runInAction(() => {
        this.qrStatusData = this.transformQrStatus(data);
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось получить статус QR-кода.';

      runInAction(() => {
        this.qrStatusData = null;
        this.qrStatusErrorMessage = message;
      });

      const status = (error as { response?: { status?: number } }).response?.status;
      const redirectUri =
        this.startInfoService.startInfo?.redirectUri ?? this.startInfoService.queryParamRedirectUri;

      if (redirectUri && status && status !== 200) {
        window.location.replace(redirectUri);
      }
    } finally {
      runInAction(() => {
        this.isFetchingQrStatus = false;
      });
    }
  }

  @computed
  get qrStatus(): QrStatusData | null {
    return this.qrStatusData ? { ...this.qrStatusData } : null;
  }

  @computed
  get status(): string | null {
    return this.qrStatusData?.status ?? null;
  }

  @computed
  get isLoading() {
    return this.isFetchingQrStatus;
  }

  @computed
  get error(): string | null {
    return this.qrStatusErrorMessage;
  }

  private buildQrStatusPayload(id: string): QrStatusRequestPayload {
    const queryParams = this.startInfoService.queryParams;

    return {
      id,
      state: queryParams.state,
      redirect_uri: queryParams.redirectUri,
    };
  }

  private transformQrStatus(data: QrStatusResponse): QrStatusData {
    return {
      id: data.id,
      deeplinkUrl: data.deeplink_url,
      redirectUrl: data.redirect_url,
      status: data.status,
      expiresIn: data.expires_in,
    };
  }
}
