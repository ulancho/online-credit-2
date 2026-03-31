import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { httpClient } from '@/common/api/httpClient';

import {
  extendedQuestionnaireFormCodeList,
  offlineFormCodeList,
  onlineFormCodeList,
  refinanceFormCodeList,
} from '../constants/common';
import {
  ACTIVE_REQUESTS_API,
  DECLINE_APPLICATION_API,
  DECLINE_APPLICATION_STATUS_API,
} from '../constants/urls';

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

  @action
  async setDeclineApplication(applicationId: string) {
    const date = new Date();
    const day = date.getDate();
    try {
      await httpClient.post(DECLINE_APPLICATION_API, {
        applicationId,
        responseCode: 'DENY',
        paymentDay: day,
      });

      const response = await httpClient.get(DECLINE_APPLICATION_STATUS_API);
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(null);
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
      token,
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
        token,
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
