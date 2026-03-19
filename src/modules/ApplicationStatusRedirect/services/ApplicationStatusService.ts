import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  getActiveApplicationStatus,
  type ActiveApplicationResponse,
} from '../api/ApplicationStatusApi.ts';

const STATUS_ROUTE_MAP: Record<string, string> = {
  NO_REQUESTS: '/credit-calculator',
  Waiting: '/loan-conditions',
};

const FALLBACK_ROUTE = '/credit-calculator';

export class ApplicationStatusService {
  @observable private isStatusLoading = false;
  @observable.ref private activeApplication: ActiveApplicationResponse | null = null;

  constructor() {
    makeObservable(this);
  }

  async loadActiveApplicationStatus() {
    this.isStatusLoading = true;

    try {
      const response = await getActiveApplicationStatus();

      runInAction(() => {
        this.activeApplication = response;
        this.isStatusLoading = false;
      });
    } catch (error) {
      console.error('Failed to load application status', error);

      runInAction(() => {
        this.activeApplication = { status: undefined };
        this.isStatusLoading = false;
      });
    }
  }

  @action
  reset() {
    this.isStatusLoading = false;
    this.activeApplication = null;
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
  get redirectRoute() {
    const status = this.activeApplication?.status;

    return (status && STATUS_ROUTE_MAP[status]) || FALLBACK_ROUTE;
  }
}
