import styles from './Select.module.scss';

interface SelectProps {
  label: string;
  value: string;
  onClick: () => void;
  filled?: boolean;
  subLabel?: string;
}

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.53151 17.5856C9.20806 17.3269 9.15562 16.8549 9.41438 16.5315L13.0396 12L9.41438 7.46849C9.15562 7.14505 9.20806 6.67308 9.53151 6.41432C9.85495 6.15556 10.3269 6.208 10.5857 6.53145L14.5857 11.5315C14.8048 11.8054 14.8048 12.1946 14.5857 12.4685L10.5857 17.4685C10.3269 17.7919 9.85495 17.8444 9.53151 17.5856Z"
      fill="#A0A7B1"
    />
  </svg>
);

export default function Select({ label, value, onClick, filled, subLabel }: SelectProps) {
  return (
    <button
      className={`${styles.selectRow} ${filled ? styles.selectRowFilled : ''}`}
      onClick={onClick}
    >
      <div className={styles.selectRowContent}>
        {filled && subLabel ? (
          <div className={styles.selectRowInner}>
            <span className={styles.selectRowSubLabel}>{subLabel}</span>
            <span className={styles.selectRowValue}>{value}</span>
          </div>
        ) : (
          <span className={filled ? styles.selectRowValue : styles.selectRowPlaceholder}>
            {filled ? value : label}
          </span>
        )}
      </div>
      <ChevronRightIcon />
    </button>
  );
}
