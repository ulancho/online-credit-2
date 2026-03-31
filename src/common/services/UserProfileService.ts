import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { httpClient } from 'Common/api/httpClient.ts';

import type { QueryParamsService } from 'Common/services/QueryParamsService.ts';

const USER_ME_URL = '/user/me';

type UserProfileResponse = {
  fullName: string;
  phoneNumber: string;
};

export class UserProfileService {
  @observable private userProfile: UserProfileResponse | null = null;
  @observable awaiting = false;

  constructor(private readonly queryParamsService: QueryParamsService) {
    makeObservable(this);
  }

  @action
  async fetchUserProfile() {
    const token = this.queryParamsService.token;

    if (!token) {
      return null;
    }

    this.awaiting = true;

    try {
      const response = await httpClient.get<UserProfileResponse>(USER_ME_URL);

      runInAction(() => {
        this.userProfile = response.data;
      });

      return response.data;
    } catch {
      return null;
    } finally {
      runInAction(() => {
        this.awaiting = false;
      });
    }
  }

  @computed
  get phoneNumber() {
    return this.userProfile?.phoneNumber ?? null;
  }

  @computed
  get fullName() {
    return this.userProfile?.fullName ?? null;
  }
}
