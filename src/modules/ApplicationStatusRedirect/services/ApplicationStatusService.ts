import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  type ActiveApplicationResponse,
  fetchActiveApplicationsExist,
} from '../api/ApplicationStatusApi.ts';

const STATUS_ROUTE_MAP: Record<string, string> = {
  NO_REQUESTS: '/credit-calculator',
  DENIED: '/declined',
  EXTENDED: '/declined?extended',
  WAITING: '/loan-conditions',
  WAITING2: '/loan-conditions',
  AWAITING_ISSUE: '/cooling',
};

const FALLBACK_ROUTE = '/credit-calculator';

export class ApplicationStatusService {
  @observable private isStatusLoading = false;
  @observable private activeApplication: ActiveApplicationResponse | null = null;
  @observable private hasStatusLoadingError = false;

  constructor() {
    makeObservable(this);
  }

  async loadActiveApplicationExist() {
    this.isStatusLoading = true;
    this.hasStatusLoadingError = false;

    try {
      const response = await fetchActiveApplicationsExist();

      runInAction(() => {
        this.activeApplication = response;
        this.hasStatusLoadingError = false;
      });
    } catch (error) {
      runInAction(() => {
        this.activeApplication = null;
        this.hasStatusLoadingError = true;
      });
    } finally {
      runInAction(() => {
        this.isStatusLoading = false;
      });
    }
  }

  @action
  reset() {
    this.isStatusLoading = false;
    this.activeApplication = null;
    this.hasStatusLoadingError = false;
  }

  @computed
  get isLoading() {
    return this.isStatusLoading;
  }

  @computed
  get application() {
    return this.activeApplication;
  }

  @computed
  get hasLoadingError() {
    return this.hasStatusLoadingError;
  }

  @computed
  get requestId() {
    return this.activeApplication?.requestId;
  }

  @computed
  get redirectRoute() {
    const status = this.activeApplication?.status;

    return (status && STATUS_ROUTE_MAP[status]) || FALLBACK_ROUTE;
  }
}
