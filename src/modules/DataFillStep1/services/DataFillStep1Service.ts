import { action, computed, makeObservable, observable } from 'mobx';

import { httpClient } from '@/common/api/httpClient';

import { AREA_API, CITIES_API, DISTRICTS_API } from '../api/localities';

import type { Area } from '@/modules/DataFill/models/area';

type FormDataFirstStep = {
  area: Area | null;
  region: Area | null;
  settlement: Area | null;
  factStreet: string;
  factAddress?: string;
  house: string;
  apartment: string;
};

export class DataFillStep1Service {
  @observable areas: Area[] | null = null;
  @observable districts: Area[] | null = null;
  @observable cities: Area[] | null = null;

  @observable formData: FormDataFirstStep | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  async getAreas() {
    try {
      const response = await httpClient.get(`${AREA_API}`);
      this.areas = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  @action
  async getDistricts(areaCode: string) {
    try {
      const response = await httpClient.get(`${DISTRICTS_API}`, { params: { areaCode } });
      this.districts = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  @action
  async getCities(districtCode: string) {
    try {
      const response = await httpClient.get(`${CITIES_API}`, { params: { districtCode } });
      this.cities = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  @action
  setFormData(formData: FormDataFirstStep) {
    this.formData = formData;
  }

  @computed
  get areasData() {
    return this.areas ?? [];
  }

  @computed
  get districtsData() {
    return this.districts ?? [];
  }

  @computed
  get citiesData() {
    return this.cities ?? [];
  }
}
