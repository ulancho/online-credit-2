import { action, computed, makeObservable, observable } from 'mobx';

import type { QueryParams } from 'Common/hooks/useQueryParams.ts';

function createDefaultParams(): QueryParams {
  return {
    token: null,
    deviceId: null,
    lang: null,
    theme: null,
  };
}

export class QueryParamsService {
  @observable.shallow private queryParameters: QueryParams = createDefaultParams();

  constructor() {
    makeObservable(this);
  }

  @action
  setQueryParams(queryParams: QueryParams) {
    this.queryParameters = {
      ...createDefaultParams(),
      ...queryParams,
    };
  }

  @action
  reset() {
    this.queryParameters = createDefaultParams();
  }

  @computed
  get token() {
    return this.queryParameters.token;
  }

  @computed
  get deviceId() {
    return this.queryParameters.deviceId;
  }

  @computed
  get lang() {
    return this.queryParameters.lang;
  }

  @computed
  get theme() {
    return this.queryParameters.theme;
  }

  @computed
  get queryParams(): QueryParams {
    return {
      ...this.queryParameters,
    };
  }
}
