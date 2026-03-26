import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  checkActiveApplicationStatus,
  type ApplicationStatusResponse,
  // eslint-disable-next-line import/no-unresolved
} from 'Modules/Loader/api/loanProcessingApi.ts';

export class LoanProcessingService {
  @observable.ref private activeApplicationStatus: ApplicationStatusResponse | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  reset() {
    this.activeApplicationStatus = null;
  }

  async loadActiveApplicationStatus(lastRequest: boolean, signal?: AbortSignal) {
    const response = await checkActiveApplicationStatus({
      lastRequest,
      signal,
    });

    runInAction(() => {
      this.activeApplicationStatus = response;
    });

    return response;
  }

  @computed
  get applicationStatus() {
    return this.activeApplicationStatus;
  }
}
