import { useTranslation } from '@/common/i18n';

import styles from './InsuranceToggle.module.css';

interface InsuranceToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function InsuranceToggle({ checked, onChange }: InsuranceToggleProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <p className={styles.title}>{t('credit-calculator.insuranceConnectTitle')}</p>
          <p className={styles.subtitle}>{t('credit-calculator.insuranceConnectDesc')}</p>
        </div>
        <button
          type="button"
          className={`${styles.toggle} ${checked ? styles.toggleOn : styles.toggleOff}`}
          onClick={() => onChange(!checked)}
          role="switch"
          aria-checked={checked}
          aria-label="Подключить страхование"
        >
          <span className={styles.thumb} />
        </button>
      </div>
    </div>
  );
}
