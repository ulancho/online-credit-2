import { action, computed, makeObservable, observable } from 'mobx';

export class PassportService {
  @observable private isSending = false;
  @observable private errorMessage: string | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  resetStatus() {
    this.errorMessage = null;
  }

  @computed
  get isLoading() {
    return this.isSending;
  }

  @computed
  get error(): string | null {
    return this.errorMessage;
  }
}
