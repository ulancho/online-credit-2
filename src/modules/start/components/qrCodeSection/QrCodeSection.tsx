import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef } from 'react';

import qrLogoSvg from 'Assets/icons/mbank-logo.svg?raw';
import { useQrStatusStore, useQrStore } from 'Common/stores/rootStore.tsx';
import {
  useCountdown,
  useQrStatusPolling,
  useQrInstance,
  QR_CONFIG,
} from 'Modules/start/components/qrCodeSection/hooks';

import styles from '../../styles/index.module.scss';

/* Constants & Helpers */
const QR_LOGO_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(qrLogoSvg)}`;

const formatTime = (seconds: number) => {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
};

export const QrCodeSection = observer(function () {
  const qrStore = useQrStore();
  const qrStatusStore = useQrStatusStore();

  const qrInfo = qrStore.qrInfo;
  const qrLink = qrInfo?.deeplinkUrl ?? null;
  const expiresIn = qrInfo?.expiresIn ?? null;
  const qrId = qrInfo?.id ?? null;
  const isLoading = qrStore.isLoading;
  const qrError = qrStore.error;
  const qrStatus = qrStatusStore.status;

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrConfig = useMemo(
    () => ({
      ...QR_CONFIG,
      image: QR_LOGO_DATA_URI,
    }),
    [],
  );

  const { instanceRef: qrInstanceRef, error: libraryError } = useQrInstance(
    qrContainerRef,
    qrConfig,
  );
  const { timeLeft, expired } = useCountdown(expiresIn);
  useQrStatusPolling(qrId);

  useEffect(() => {
    if (!qrInstanceRef.current) return;
    qrInstanceRef.current.update({ data: qrLink ?? '' });
  }, [qrLink, qrInstanceRef]);

  const qrReady = Boolean(qrLink) && Boolean(qrInstanceRef.current);

  const timerLabel = useMemo(() => {
    if (libraryError) return 'QR-код недоступен';
    if (qrError) return qrError;
    if (isLoading && !qrLink) return 'Загрузка…';
    if (isLoading) return 'Обновление…';
    if (expired) return 'QR-код устарел';
    return `Истекает через ${formatTime(timeLeft)}`;
  }, [libraryError, qrError, isLoading, qrLink, expired, timeLeft]);

  const renderDefaultQrContent = () => (
    <>
      <div className={styles.qrCodeWrapper}>
        <div ref={qrContainerRef} className={styles.qrCanvas} aria-hidden="true" />
        {!qrReady && (
          <div className={styles.qrPlaceholder}>
            {qrError ?? libraryError ?? (isLoading ? 'Загрузка…' : 'QR-код появится здесь')}
          </div>
        )}
      </div>
      <div className={qrError ? styles.qrError : styles.timerSection}>
        <span className={styles.timerText}>{timerLabel}</span>
      </div>
    </>
  );

  const getQrContainerContent = () => {
    const baseClassName = styles.qrCodeContainer;

    switch (qrStatus) {
      case 'CONFIRMED':
        return {
          className: `${baseClassName} ${styles.qrCodeContainerStatus}`,
          content: (
            <div className={styles.qrConfirmedContainer}>
              <img
                src="/src/assets/icons/confirmed.svg"
                alt="Confirmed"
                className={styles.confirmedIcon}
              />
              <p className={styles.confirmedText}>Вход одобрен</p>
            </div>
          ),
        };
      case 'BOUND':
        return {
          className: `${baseClassName} ${styles.qrCodeContainerStatus}`,
          content: (
            <div className={styles.qrBoundContainer}>
              <span className={styles.loader} aria-label="QR-код подтверждается" />
              <p className={styles.loaderText}>Ждем подтверждения входа</p>
            </div>
          ),
        };
      case 'DENIED':
        return {
          className: `${baseClassName} ${styles.qrCodeContainerStatus}`,
          content: (
            <>
              <img src="/src/assets/icons/denied.svg" alt="Denied" className={styles.deniedIcon} />
              <p className={styles.deniedTitle}>Вход отклонен</p>
              <button className={styles.refreshButton}>
                <img
                  src="/src/assets/icons/refresh.svg"
                  alt="Refresh"
                  className={styles.refreshIcon}
                />
                <span>Попробовать еще раз</span>
              </button>
            </>
          ),
        };
      case 'EXPIRED':
        return {
          className: `${baseClassName} ${styles.qrCodeContainerStatus}`,
          content: (
            <div className={styles.statusMessage}>
              <p className={styles.statusTitle}>QR-код устарел</p>
              <p className={styles.statusDescription}>Обновите страницу и попробуйте снова.</p>
            </div>
          ),
        };
      default:
        return {
          className: baseClassName,
          content: renderDefaultQrContent(),
        };
    }
  };

  const { className: qrCodeContainerClassName, content: qrCodeContent } = getQrContainerContent();

  return (
    <section className={styles.qrSection}>
      <div className={styles.qrContent}>
        <header className={styles.qrTitle}>
          <h2>
            Наведите QR-сканер <br /> из приложения MBANK
          </h2>
        </header>
        <div className={qrCodeContainerClassName}>{qrCodeContent}</div>
        <img
          src="/src/assets/icons/mbank-logo-2.svg"
          alt="MBANK Logo"
          className={styles.mbankLogo}
        />
      </div>
    </section>
  );
});
