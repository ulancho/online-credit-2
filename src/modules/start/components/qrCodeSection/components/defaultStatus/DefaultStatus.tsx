import { type MutableRefObject } from 'react';

import styles from './DefaultStatus.module.scss';

interface DefaultStateProps {
  qrContainerRef: MutableRefObject<HTMLDivElement | null>;
  qrReady: boolean;
  qrError: string | null;
  libraryError: string | null;
  isLoading: boolean;
  timerLabel: string;
}

export const DefaultStatus = ({
  qrContainerRef,
  qrReady,
  qrError,
  libraryError,
  isLoading,
  timerLabel,
}: DefaultStateProps) => {
  const placeholderText =
    qrError ?? libraryError ?? (isLoading ? 'Загрузка…' : 'QR-код появится здесь');

  return (
    <div className={styles.wrapper}>
      <div className={styles.qrCodeWrapper}>
        <div ref={qrContainerRef} className={styles.qrCanvas} aria-hidden="true" />
        {!qrReady && <div className={styles.qrPlaceholder}>{placeholderText}</div>}
      </div>
      <div className={qrError ? styles.errorMessage : styles.timerSection}>
        <span className={qrError ? styles.errorText : styles.timerText}>{timerLabel}</span>
      </div>
    </div>
  );
};
