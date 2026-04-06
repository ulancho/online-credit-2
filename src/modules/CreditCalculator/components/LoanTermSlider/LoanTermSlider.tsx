import { useMemo } from 'react';

import { useTranslation } from '@/common/i18n';
import { getMonthLabel } from '@/common/utils/months';

import styles from './LoanTermSlider.module.css';

interface LoanTermSliderProps {
  label: number;
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export default function LoanTermSlider({
  label,
  value,
  min = 3,
  max = 60,
  onChange,
  disabled = false,
}: LoanTermSliderProps) {
  const { t } = useTranslation();
  const percent = useMemo(() => {
    if (max <= min) {
      return 0;
    }

    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  return (
    <div className={styles.card}>
      <p className={styles.label}>{t('credit-calculator.term')}</p>
      <p className={styles.valueText}>{getMonthLabel(label, t)}</p>
      <div className={styles.sliderWrapper}>
        <div className={styles.trackBackground}>
          <div className={styles.trackFilled} style={{ width: `${percent}%` }} />
        </div>
        <input
          className={styles.rangeInput}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(Number(e.target.value))}
          style={{ '--thumb-percent': `${percent}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
