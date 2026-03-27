import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { getBranches, getCities, type CitiesItem } from '../api/DirectoriesApi';

type FormDataThirdStep = {
  factCityCftId: CitiesItem;
  serviceBranch: CitiesItem;
};

export class DataFillStep3Service {
  @observable citiesDirectoryItems: CitiesItem[] = [];
  @observable branchesDirectoryItems: CitiesItem[] = [];
  @observable formData: FormDataThirdStep | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  async getCitiesDirectory() {
    const response = await getCities();
    runInAction(() => {
      this.citiesDirectoryItems = response;
    });
  }

  @action
  async getBranchesDirectory(cityCode: string) {
    const response = await getBranches(cityCode);
    runInAction(() => {
      this.branchesDirectoryItems = response;
    });
  }

  set setFormData(data: FormDataThirdStep) {
    this.formData = data;
  }

  @computed
  get availableCitiesDirectoryItems() {
    return this.citiesDirectoryItems ?? [];
  }

  @computed
  get availableBranchesDirectoryItems() {
    return this.branchesDirectoryItems ?? [];
  }
}
