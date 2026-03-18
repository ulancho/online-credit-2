import { useState } from 'react';

import styles from './InputField.module.css';

interface InputFieldProps {
  mainPlaceholder: string;
  secondaryPlaceholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  hasChevron?: boolean;
  type?: string;
}

export default function InputField({
  mainPlaceholder,
  secondaryPlaceholder,
  value,
  onChange,
  hasChevron = false,
  type = 'text',
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const isFilled = Boolean(value);
  const isFloating = focused || isFilled;

  if (hasChevron) {
    return (
      <div className={styles.wrapper}>
        <div className={`${styles.fieldBox} ${isFilled ? styles.fieldBoxFilled : ''}`}>
          <div className={styles.fieldContent}>
            <span
              className={`${styles.floatingLabel} ${isFilled ? styles.floatingLabelActive : ''}`}
            >
              {mainPlaceholder}
            </span>
            {isFilled && <span className={styles.selectedValue}>{value}</span>}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.chevron}>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z"
              fill="#A0A7B1"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <label className={`${styles.fieldBox} ${isFloating ? styles.fieldBoxFilled : ''}`}>
        <div className={styles.fieldContent}>
          <span
            className={`${styles.floatingLabel} ${isFloating ? styles.floatingLabelActive : ''}`}
          >
            {mainPlaceholder}
          </span>
          <input
            className={styles.input}
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={secondaryPlaceholder}
          />
        </div>
      </label>
    </div>
  );
}
