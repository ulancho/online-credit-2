import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { fetchAwaitingIssue, type AwaitingIssueResponse } from '../api/coolingApi';

export class CoolingService {
  @observable.ref private awaitingIssue: AwaitingIssueResponse | null = null;
  @observable private isAwaitingIssueLoading = false;

  constructor() {
    makeObservable(this);
  }

  async loadAwaitingIssue(requestId: string) {
    this.isAwaitingIssueLoading = true;

    try {
      const response = await fetchAwaitingIssue(requestId);

      runInAction(() => {
        this.awaitingIssue = response;
        this.isAwaitingIssueLoading = false;
      });
    } catch (error) {
      alert('Failed to load cooling data: ' + error);

      runInAction(() => {
        this.awaitingIssue = null;
        this.isAwaitingIssueLoading = false;
      });
    }
  }

  @action
  reset() {
    this.awaitingIssue = null;
    this.isAwaitingIssueLoading = false;
  }

  @computed
  get isLoading() {
    return this.isAwaitingIssueLoading;
  }

  @computed
  get awaitingIssueInfo() {
    return this.awaitingIssue;
  }
}
