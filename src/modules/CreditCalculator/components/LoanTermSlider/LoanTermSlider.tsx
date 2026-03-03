import { useMemo } from 'react';

import styles from './LoanTermSlider.module.css';

interface LoanTermSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

function getMonthLabel(months: number): string {
  if (months === 1) return '1 месяц';
  if (months >= 2 && months <= 4) return `${months} месяца`;
  return `${months} месяцев`;
}

export default function LoanTermSlider({
  value,
  min = 3,
  max = 60,
  onChange,
}: LoanTermSliderProps) {
  const percent = useMemo(() => ((value - min) / (max - min)) * 100, [value, min, max]);

  return (
    <div className={styles.card}>
      <p className={styles.label}>Срок кредита</p>
      <p className={styles.valueText}>{getMonthLabel(value)}</p>
      <div className={styles.sliderWrapper}>
        <div className={styles.trackBackground}>
          <div className={styles.trackFilled} style={{ width: `${percent}%` }} />
        </div>
        <input
          className={styles.rangeInput}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          style={{ '--thumb-percent': `${percent}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
