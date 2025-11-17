import { type MutableRefObject } from 'react';

import { useTranslation } from 'Common/i18n';

import styles from './DefaultStatus.module.scss';

interface DefaultStateProps {
  qrContainerRef: MutableRefObject<HTMLDivElement | null>;
  qrReady: boolean;
  qrError: string | null;
  libraryError: string | null;
  isLoading: boolean;
  timerLabel: string | null;
}

export const DefaultStatus = ({
  qrContainerRef,
  qrReady,
  qrError,
  libraryError,
  isLoading,
  timerLabel,
}: DefaultStateProps) => {
  const { t } = useTranslation();
  const placeholderText =
    qrError ?? libraryError ?? (isLoading ? t('start.common.loading') : t('start.common.loading'));

  return (
    <div className={styles.wrapper}>
      <div className={styles.qrCodeWrapper}>
        <div ref={qrContainerRef} className={styles.qrCanvas} aria-hidden="true" />
      </div>
      <div className={qrError ? styles.errorMessage : styles.timerSection}>
        <span className={qrError ? styles.errorText : styles.timerText}>
          {timerLabel && t('start.common.timerLabel', { value: timerLabel || '' })}
        </span>
      </div>
      {!qrReady && <div className={styles.qrPlaceholder}>{placeholderText}</div>}
    </div>
  );
};
