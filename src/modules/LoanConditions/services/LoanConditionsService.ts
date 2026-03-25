import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { httpClient } from '@/common/api/httpClient';

import {
  extendedQuestionnaireFormCodeList,
  offlineFormCodeList,
  onlineFormCodeList,
  refinanceFormCodeList,
} from '../constants/common';
import { ACTIVE_REQUESTS_API } from '../constants/urls';

import type { ActiveRequests, LoanGroup } from '../models/ActiveRequests';

export class LoanCondtionsService {
  @observable activeRequests: ActiveRequests | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  async getActiveRequests() {
    try {
      const response = await httpClient.get(ACTIVE_REQUESTS_API);
      runInAction(() => {
        this.activeRequests = response.data;
      });
    } catch (error) {
      console.error(error);
    }
  }

  @computed
  get activeRequestsData() {
    if (!this.activeRequests) return {};

    const {
      onlineAmount,
      offlineAmount,
      refAmount,
      percent,
      period,
      offlinePeriod,
      monthlyPayment,
      offlineMonthlyPayment,
      refPeriod,
      refPercent,
      refMonthlyPayment,
    } = this.activeRequests;

    const groupedData: Record<LoanGroup, ActiveRequests> = {
      online: { amount: onlineAmount, period, percent, monthlyPayment },
      offline: {
        amount: offlineAmount,
        period: offlinePeriod,
        percent,
        monthlyPayment: offlineMonthlyPayment,
      },
      ref: {
        amount: refAmount,
        period: refPeriod,
        percent: refPercent,
        monthlyPayment: refMonthlyPayment,
      },
    };
    return groupedData;
  }

  @computed
  get extendedIsAvailable() {
    return extendedQuestionnaireFormCodeList.includes(this.activeRequests?.formCode);
  }

  @computed
  get onlineClaimAvailable() {
    return (
      onlineFormCodeList.includes(this.activeRequests?.formCode) &&
      this.activeRequests?.onlineAmount > 0
    );
  }

  @computed
  get offlineClaimAvailable() {
    return (
      offlineFormCodeList.includes(this.activeRequests?.formCode) &&
      this.activeRequests?.offlineAmount > 0
    );
  }

  @computed
  get conditionPageIsAvailable() {
    return (
      this.extendedIsAvailable ||
      this.activeRequests?.offlineAmount != 0 ||
      refinanceFormCodeList.includes(this.activeRequests?.formCode)
    );
  }
}
