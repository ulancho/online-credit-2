import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchStartInfo,
  type StartInfoRequestPayload,
  type StartInfoResponse,
} from '../api/startInfoApi.ts';

import type { StartQueryParams } from 'Common/hooks/useQueryParams.ts';
import type { QueryParamsService } from 'Common/services/queryParamsService.ts';

interface StartInfoData {
  clientId: string;
  clientName: string;
  clientDescription: string;
  logoUrl: string;
  offerUrl: string;
  agreementUrl: string;
  privacyPolicyUrl: string;
  termOfServiceUrl: string;
  redirectUri: string;
  state: string;
}

export class StartInfoService {
  @observable.ref private startInfoData: StartInfoData | null = null;
  @observable private isFetchingStartInfo = false;
  @observable private startInfoErrorMessage: string | null = null;

  constructor(
    private readonly queryParamsService: QueryParamsService,
    private readonly startInfoFetcher: typeof fetchStartInfo = fetchStartInfo,
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
    this.startInfoData = null;
    this.isFetchingStartInfo = false;
    this.startInfoErrorMessage = null;
  }

  @action
  async fetchStartInfo(type = 'web'): Promise<boolean> {
    this.isFetchingStartInfo = true;
    this.startInfoErrorMessage = null;

    const payload = this.buildStartInfoPayload(this.queryParamsService.queryParams);

    try {
      const data = await this.startInfoFetcher(payload);

      runInAction(() => {
        this.startInfoData = this.transformStartInfo(data);
      });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось получить стартовую информацию.';

      runInAction(() => {
        this.startInfoData = null;
        this.startInfoErrorMessage = message;
      });

      const status = (error as { response?: { status?: number } }).response?.status;
      const redirectUri =
        this.startInfo?.redirectUri ?? this.queryParamsService.queryParamRedirectUri;
      if (status && status !== 200) {
        if (redirectUri) {
          window.location.replace(redirectUri);
        } else {
          window.location.assign(`/error-${type}`);
        }
      }
      return false;
    } finally {
      runInAction(() => {
        this.isFetchingStartInfo = false;
      });
    }
  }

  @computed
  get startInfo(): StartInfoData | null {
    return this.startInfoData ? { ...this.startInfoData } : null;
  }

  @computed
  get isLoadingStartInfo() {
    return this.isFetchingStartInfo;
  }

  @computed
  get startInfoError() {
    return this.startInfoErrorMessage;
  }

  private buildStartInfoPayload(params: StartQueryParams): StartInfoRequestPayload {
    return {
      scope: params.scope,
      state: params.state,
      client_id: params.clientId,
      redirect_uri: params.redirectUri,
      response_type: params.responseType,
      code_challenge: params.codeChallenge,
      code_challenge_method: params.codeChallengeMethod,
    };
  }

  private transformStartInfo(data: StartInfoResponse): StartInfoData {
    return {
      clientId: data.client_id,
      clientName: data.client_name,
      clientDescription: data.client_description,
      logoUrl: data.logo_url,
      offerUrl: data.offer_url,
      agreementUrl: data.agreement_url,
      privacyPolicyUrl: data.privacy_policy_url,
      termOfServiceUrl: data.term_of_service_url,
      redirectUri: data.redirect_uri,
      state: data.state,
    };
  }
}
