import { action, computed, observable } from 'mobx';

import { getActivityTypes } from 'Modules/CreditCalculator/api/activityTypeApi.ts';

import type { ActivityTypeDirectoryItem } from 'Modules/CreditCalculator/models/activityType.ts';

export class ActivityTypeService {
  @observable activityTypes: ActivityTypeDirectoryItem[] = [];

  @action
  async getActivityTypes() {
    this.activityTypes = await getActivityTypes();
  }

  @computed
  get availableActivityTypes() {
    return this.activityTypes;
  }
}
