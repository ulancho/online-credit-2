import { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'Common/i18n';

import styles from './ActivityTypeSelect.module.css';

interface ActivityTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ActivityTypeSelect({ value, onChange }: ActivityTypeSelectProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(value);
  const sheetRef = useRef<HTMLDivElement>(null);

  const options = [
    t('credit-calculator.activityTypes.employee'),
    t('credit-calculator.activityTypes.entrepreneur'),
    t('credit-calculator.activityTypes.agriculture'),
  ];

  const openSheet = () => {
    setPendingValue(value);
    setIsOpen(true);
  };

  const closeSheet = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onChange(pendingValue);
    closeSheet();
  };

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div className={styles.trigger} onClick={openSheet}>
        <div className={styles.triggerContent}>
          <span className={`${styles.label} ${value ? styles.labelSmall : ''}`}>
            {t('credit-calculator.activityType')}
          </span>
          {value && <span className={styles.selectedText}>{value}</span>}
        </div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ''}`}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z"
            fill="#A0A7B1"
          />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.overlay} onClick={closeSheet}>
          <div ref={sheetRef} className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHandle} />
            <h2 className={styles.sheetTitle}>{t('credit-calculator.activityTypes.title')}</h2>
            <ul className={styles.optionList}>
              {options.map((option) => (
                <li
                  key={option}
                  className={`${styles.optionItem} ${pendingValue === option ? styles.optionItemSelected : ''}`}
                  onClick={() => setPendingValue(option)}
                >
                  <span className={styles.optionText}>{option}</span>
                </li>
              ))}
            </ul>
            <div className={styles.sheetFooter}>
              <button
                className={`${styles.confirmBtn} ${pendingValue ? styles.confirmBtnActive : styles.confirmBtnDisabled}`}
                onClick={handleConfirm}
                disabled={!pendingValue}
              >
                {t('credit-calculator.activityTypes.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
