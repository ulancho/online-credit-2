import classNames from 'classnames';

import { useTranslation } from '@/common/i18n';
import { useCreditRatesStore } from 'Common/stores/rootStore.tsx';
import LoanRate from 'Modules/CreditCalculator/components/LoanRate/LoanRate.tsx';
import { mapApiLoyaltyLevel } from 'Modules/CreditCalculator/models/loyalty.ts';

import styles from './LoanSummary.module.css';

interface LoanSummaryProps {
  monthlyPayment: string;
  insuranceEnabled: boolean;
  overpayment: string;
}

const formatRate = (value: number | null | undefined) =>
  typeof value === 'number' ? `${value.toFixed(2)}%` : '0%';

const discountedRateGradientClassMap = {
  bronze: styles.discountedRateBronze,
  silver: styles.discountedRateSilver,
  gold: styles.discountedRateGold,
  platinum: styles.discountedRatePlatinum,
  standart: styles.originalRateStandalone,
} as const;

export default function LoanSummary({
  monthlyPayment,
  insuranceEnabled,
  overpayment,
}: LoanSummaryProps) {
  const { t } = useTranslation();
  const { creditRates } = useCreditRatesStore();
  const loyaltyLevel = mapApiLoyaltyLevel(creditRates?.loyaltyLevel);
  const originalRate = formatRate(creditRates?.rateWithoutInsurance);
  const discountedRate = formatRate(creditRates?.rateWithInsurance);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.rowLabel}>{t('credit-calculator.monthlyPayment')}</span>
        <span className={styles.rowValueBold}>{monthlyPayment} c</span>
      </div>

      <div className={styles.row}>
        <LoanRate loyaltyLevel={loyaltyLevel} />
        <div className={styles.rateValues}>
          <span
            className={classNames(styles.originalRate, {
              [styles.originalRateStandalone]: !insuranceEnabled,
              [styles.lineThrough]: insuranceEnabled,
            })}
          >
            {originalRate}
          </span>
          {insuranceEnabled ? (
            <span
              className={classNames(
                styles.discountedRate,
                discountedRateGradientClassMap[loyaltyLevel],
              )}
            >
              {discountedRate}
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles.row}>
        <span className={styles.rowLabelMuted}>{t('credit-calculator.overpayment')}</span>
        <span className={styles.rowValue}>{overpayment} c</span>
      </div>
    </div>
  );
}
