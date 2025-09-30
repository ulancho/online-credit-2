import { action, computed, makeObservable, observable } from 'mobx';

import type { StartQueryParams } from '../../modules/start/hooks/useStartQueryParams.ts';

function createDefaultParams(): StartQueryParams {
  return {
    clientId: null,
    codeChallenge: null,
    codeChallengeMethod: null,
    redirectUri: null,
    responseType: null,
    scope: null,
    scopeList: [],
    state: null,
  };
}

export class StartStore {
  @observable.shallow private params: StartQueryParams = createDefaultParams();

  constructor() {
    makeObservable(this);
  }

  @action
  setQueryParams(params: StartQueryParams) {
    this.params = {
      ...createDefaultParams(),
      ...params,
      scopeList: [...(params.scopeList ?? [])],
    };
  }

  @action
  reset() {
    this.params = createDefaultParams();
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
  get scopeList() {
    return [...this.params.scopeList];
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
      scopeList: [...this.params.scopeList],
    };
  }
}
