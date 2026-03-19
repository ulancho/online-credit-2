import { useMemo } from 'react';

import { useCreditRatesStore } from '@/common/stores/rootStore';

import type { CreditRatesResponse } from '../model/creditRates';

const AMOUNT_DIVIDER_THRESHOLD = 40000;
const SMALL_AMOUNT_DIVIDER = 20;
const LARGE_AMOUNT_DIVIDER = 50;

export type RateCategory = 'employee' | 'client';
export type RateInsuranceOption = 'withInsurance' | 'withoutInsurance';

type CreditRateKey =
  | 'employeeRateWithInsurance'
  | 'employeeRateWithoutInsurance'
  | 'clientRateWithInsurance'
  | 'clientRateWithoutInsurance';

export interface LoanRateOptions {
  category: RateCategory;
  insuranceOption: RateInsuranceOption;
}

export interface LoanCalculationParams extends LoanRateOptions {
  amount: number;
  month: number;
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  percent: number;
  overpayment: number;
}

interface AnnuityCalculationParams {
  amount: number;
  month: number;
  percent: number;
}

export class LoanCalculatorService {
  static calculateAnnuity({ amount, month, percent }: AnnuityCalculationParams) {
    if (amount <= 0 || month <= 0) {
      return 0;
    }

    const divider =
      amount <= AMOUNT_DIVIDER_THRESHOLD ? SMALL_AMOUNT_DIVIDER : LARGE_AMOUNT_DIVIDER;
    const monthlyRate = (percent !== 0 ? percent : 100) / 1200;
    const annuityFactorBase = Math.pow(1 + monthlyRate, month);
    const formula = monthlyRate * (annuityFactorBase / (annuityFactorBase - 1));
    const rawPayment = Number((formula * amount).toFixed(2));
    const remainder = rawPayment % divider;

    return rawPayment - remainder + (remainder !== 0 ? divider : 0);
  }

  static resolvePercent(params: CreditRatesResponse, options: LoanRateOptions) {
    const rateKey: CreditRateKey =
      `${options.category}Rate${options.insuranceOption === 'withInsurance' ? 'WithInsurance' : 'WithoutInsurance'}` as CreditRateKey;

    return params[rateKey];
  }

  static calculateLoan(
    params: CreditRatesResponse,
    calculationParams: LoanCalculationParams,
  ): LoanCalculationResult {
    const percent = this.resolvePercent(params, calculationParams);
    const monthlyPayment = this.calculateAnnuity({
      amount: calculationParams.amount,
      month: calculationParams.month,
      percent,
    });
    const overpayment = Number(
      Math.max(monthlyPayment * calculationParams.month - calculationParams.amount, 0).toFixed(2),
    );

    return {
      monthlyPayment,
      percent,
      overpayment,
    };
  }
}

export function useLoanCalculatorService() {
  const creditRatesStore = useCreditRatesStore();

  return useMemo(
    () => ({
      creditRates: creditRatesStore.creditRates,
      calculateLoan: (params: LoanCalculationParams) => {
        if (!creditRatesStore.creditRates) {
          return null;
        }

        return LoanCalculatorService.calculateLoan(creditRatesStore.creditRates, params);
      },
      resolvePercent: (options: LoanRateOptions) => {
        if (!creditRatesStore.creditRates) {
          return null;
        }

        return LoanCalculatorService.resolvePercent(creditRatesStore.creditRates, options);
      },
    }),
    [creditRatesStore],
  );
}
