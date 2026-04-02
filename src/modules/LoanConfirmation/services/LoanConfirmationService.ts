import { action, computed, makeObservable, observable } from 'mobx';

import { httpClient } from '@/common/api/httpClient';

import { getCreditDirectoryItems } from '../api/creditDirectoryApi';
import { GENERATE_PDF_LKD_API, INSURE_OFFER_API } from '../api/insureOffer';
import { MBANK_CREDIT } from '../constants/payDateCode';

import type { OfferResponse } from '@/common/models/offers';
import type {
  GeneratePdfLkdRequest,
  GeneratePdfLkdResponse,
} from '@/modules/CreditCalculator/api/pdfLkdApi';

export type submitCreditType = {
  acceptAgreement?: boolean;
  insureCompanyId?: string;
  paymentDay?: number;
  type?: string;
};

export class LoanConfirmationService {
  @observable payDateList: number[] | undefined = [];
  @observable selectedDay: number = 0;
  @observable dataSubmitCredit: submitCreditType | null = null;
  @observable insureOffer: OfferResponse | null = null;
  @observable pdfLkdBase64 = '';

  constructor() {
    makeObservable(this);
  }

  @action
  async getCreditDirectoryItems() {
    const response = await getCreditDirectoryItems();
    this.selectedDay = 0;
    this.payDateList = response.find((item) => item.code === MBANK_CREDIT)?.payDateList;
  }

  @action
  async setSubmitCredit(data: submitCreditType) {
    this.dataSubmitCredit = data;
  }

  @action
  async getInsureOffer() {
    const response = await httpClient.get<OfferResponse>(INSURE_OFFER_API);
    this.insureOffer = response.data;
  }

  @action
  async generatePdfLkd(payload: GeneratePdfLkdRequest) {
    const response = await httpClient.post<GeneratePdfLkdResponse>(GENERATE_PDF_LKD_API, payload);
    this.pdfLkdBase64 = response.data.pdf_base64;
    return response.data.pdf_base64;
  }

  @computed
  get availablePayDateList() {
    return this.payDateList;
  }

  set selectedPaymentDay(value: number) {
    this.selectedDay = value;
  }

  @computed
  get selectedPaymentDay() {
    return this.selectedDay;
  }
}
