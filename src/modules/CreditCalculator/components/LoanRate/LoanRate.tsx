import { useTranslation } from '@/common/i18n';
import { getLoyaltyIconPath, type LoyaltyLevel } from 'Modules/CreditCalculator/models/loyalty.ts';

import styles from '../LoanSummary/LoanSummary.module.css';

type LoanRateProps = {
  loyaltyLevel: LoyaltyLevel;
};

export default function LoanRate({ loyaltyLevel }: LoanRateProps) {
  const { t } = useTranslation();
  const loyaltyIconPath = loyaltyLevel === 'standart' ? null : getLoyaltyIconPath(loyaltyLevel);

  return (
    <div className={styles.rateLabel}>
      <span className={styles.rowLabelMuted}>{t('credit-calculator.bid')}</span>
      {loyaltyIconPath ? (
        <img src={loyaltyIconPath} alt={`Loyalty ${loyaltyLevel} icon`} width="24" height="24" />
      ) : null}
    </div>
  );
}
