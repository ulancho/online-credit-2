import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchStartInfo,
  type StartInfoRequestPayload,
  type StartInfoResponse,
} from '../api/startInfoApi.ts';

import type { StartQueryParams } from '../hooks/useStartQueryParams.ts';

function createDefaultParams(): StartQueryParams {
  return {
    clientId: null,
    codeChallenge: null,
    codeChallengeMethod: null,
    redirectUri: null,
    responseType: null,
    scope: null,
    state: null,
  };
}

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
  @observable.shallow private queryParameters: StartQueryParams = createDefaultParams();
  @observable.ref private startInfoData: StartInfoData | null = null;
  @observable private isFetchingStartInfo = false;
  @observable private startInfoErrorMessage: string | null = null;

  constructor(private readonly startInfoFetcher: typeof fetchStartInfo = fetchStartInfo) {
    makeObservable(this);
  }

  @action
  setQueryParams(queryParams: StartQueryParams) {
    this.queryParameters = {
      ...createDefaultParams(),
      ...queryParams,
    };
  }

  @action
  reset() {
    this.queryParameters = createDefaultParams();
    this.startInfoData = null;
    this.isFetchingStartInfo = false;
    this.startInfoErrorMessage = null;
  }

  @action
  async fetchStartInfo(queryParams: StartQueryParams) {
    this.isFetchingStartInfo = true;
    this.startInfoErrorMessage = null;

    const payload = this.buildStartInfoPayload(queryParams);

    try {
      const data = await this.startInfoFetcher(payload);

      runInAction(() => {
        this.startInfoData = this.transformStartInfo(data);
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось получить стартовую информацию.';

      runInAction(() => {
        this.startInfoData = null;
        this.startInfoErrorMessage = message;
      });

      const status = (error as { response?: { status?: number } }).response?.status;
      const redirectUri = this.startInfo?.redirectUri ?? this.queryParamRedirectUri;

      if (redirectUri && status && status !== 200) {
        window.location.replace(redirectUri);
      }
    } finally {
      runInAction(() => {
        this.isFetchingStartInfo = false;
      });
    }
  }

  @computed
  get queryParamClientId() {
    return this.queryParameters.clientId;
  }

  @computed
  get queryParamCodeChallenge() {
    return this.queryParameters.codeChallenge;
  }

  @computed
  get queryParamCodeChallengeMethod() {
    return this.queryParameters.codeChallengeMethod;
  }

  @computed
  get queryParamRedirectUri() {
    return this.queryParameters.redirectUri;
  }

  @computed
  get queryParamResponseType() {
    return this.queryParameters.responseType;
  }

  @computed
  get queryParamScope() {
    return this.queryParameters.scope;
  }

  @computed
  get queryParamState() {
    return this.queryParameters.state;
  }

  @computed
  get hasQueryParams() {
    return Boolean(
      this.queryParameters.clientId ||
        this.queryParameters.codeChallenge ||
        this.queryParameters.codeChallengeMethod ||
        this.queryParameters.redirectUri ||
        this.queryParameters.responseType ||
        this.queryParameters.scope ||
        this.queryParameters.state,
    );
  }

  @computed
  get queryParams(): StartQueryParams {
    return {
      ...this.queryParameters,
    };
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
