import { action, makeObservable } from 'mobx';

import { httpClient } from '@/common/api/httpClient';

export class ApplicationService {
  static confirmApplicationUrl = '/credit/application/confirm';
  constructor() {
    makeObservable(this);
  }

  @action
  async setDeclineApplication(applicationId: string) {
    const date = new Date();
    const day = date.getDate();
    try {
      const response = await httpClient.post(ApplicationService.confirmApplicationUrl, {
        applicationId,
        responseCode: 'DENY',
        paymentDay: day,
      });

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(null);
    }
  }
}
