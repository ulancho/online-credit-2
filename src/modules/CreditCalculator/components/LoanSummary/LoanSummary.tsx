import { useCreditRatesStore } from 'Common/stores/rootStore.tsx';
import LoanRate from 'Modules/CreditCalculator/components/LoanRate/LoanRate.tsx';
import { mapApiLoyaltyLevel } from 'Modules/CreditCalculator/models/loyalty.ts';

import styles from './LoanSummary.module.css';

interface LoanSummaryProps {
  monthlyPayment: string;
  originalRate: string;
  discountedRate: string;
  overpayment: string;
}

export default function LoanSummary({
  monthlyPayment,
  originalRate,
  discountedRate,
  overpayment,
}: LoanSummaryProps) {
  const { creditRates } = useCreditRatesStore();
  const loyaltyLevel = mapApiLoyaltyLevel(creditRates?.loyaltyLevel);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Ежемесячный платёж</span>
        <span className={styles.rowValueBold}>
          {monthlyPayment} {'\u20C0'}
        </span>
      </div>

      <div className={styles.row}>
        <LoanRate loyaltyLevel={loyaltyLevel} />
        <div className={styles.rateValues}>
          <span className={styles.originalRate}>{originalRate}</span>
          <span className={styles.discountedRate}>{discountedRate}</span>
        </div>
      </div>

      <div className={styles.row}>
        <span className={styles.rowLabelMuted}>Переплата</span>
        <span className={styles.rowValue}>
          {overpayment} {'\u20C0'}
        </span>
      </div>
    </div>
  );
}
