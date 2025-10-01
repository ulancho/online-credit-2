import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchStartInfo,
  type StartInfoRequestPayload,
  type StartInfoResponse,
} from '../../modules/start/api/startInfoApi.ts';

import type { StartQueryParams } from '../../modules/start/hooks/useStartQueryParams.ts';

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

export class StartStore {
  @observable.shallow private params: StartQueryParams = createDefaultParams();
  @observable.ref private startInfoData: StartInfoData | null = null;
  @observable private isFetchingStartInfo = false;
  @observable private startInfoErrorMessage: string | null = null;

  constructor(private readonly startInfoFetcher: typeof fetchStartInfo = fetchStartInfo) {
    makeObservable(this);
  }

  @action
  setQueryParams(params: StartQueryParams) {
    this.params = {
      ...createDefaultParams(),
      ...params,
    };
  }

  @action
  reset() {
    this.params = createDefaultParams();
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
    } finally {
      runInAction(() => {
        this.isFetchingStartInfo = false;
      });
    }
  }

  @computed
  get clientId() {
    return this.params.clientId;
  }

  @computed
  get codeChallenge() {
    return this.params.codeChallenge;
  }

  @computed
  get codeChallengeMethod() {
    return this.params.codeChallengeMethod;
  }

  @computed
  get redirectUri() {
    return this.params.redirectUri;
  }

  @computed
  get responseType() {
    return this.params.responseType;
  }

  @computed
  get scope() {
    return this.params.scope;
  }

  @computed
  get state() {
    return this.params.state;
  }

  @computed
  get hasQueryParams() {
    return Boolean(
      this.params.clientId ||
        this.params.codeChallenge ||
        this.params.codeChallengeMethod ||
        this.params.redirectUri ||
        this.params.responseType ||
        this.params.scope ||
        this.params.state,
    );
  }

  @computed
  get queryParams(): StartQueryParams {
    return {
      ...this.params,
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
