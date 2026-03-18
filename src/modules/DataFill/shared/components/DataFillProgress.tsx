import { Fragment } from 'react';

import styles from './DataFillProgress.module.scss';

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="#129958" />
    <path
      d="M9 14.8L12.1429 18L20 10"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface DataFillProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export default function DataFillProgress({ currentStep, totalSteps = 3 }: DataFillProgressProps) {
  const items = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <div className={styles.progressBar}>
      <div className={styles.progressStep}>
        {items.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <Fragment key={step}>
              {isCompleted ? (
                <CheckIcon />
              ) : (
                <div
                  className={[
                    styles.stepDot,
                    isActive ? styles.stepDotActive : styles.stepDotDisabled,
                  ].join(' ')}
                >
                  {step}
                </div>
              )}
              {index < items.length - 1 ? (
                <div
                  className={[
                    styles.progressLine,
                    step < currentStep ? styles.progressLineFilled : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
