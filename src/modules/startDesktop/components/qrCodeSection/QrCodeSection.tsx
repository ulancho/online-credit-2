import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import qrLogoSvg from 'Assets/icons/mbank-logo.svg?raw';
import { useQrStatusStore, useQrStore } from 'Common/stores/rootStore.tsx';
import { AUTH_STATUSES } from 'Common/types/authStatus.ts';
import { formatMMSS, getTargetMs } from 'Common/utils/time.ts';
import ErrorStatus from 'Modules/startDesktop/components/qrCodeSection/components/errorStatus/ErrorStatus.tsx';
import { Footer } from 'Modules/startDesktop/components/qrCodeSection/components/footer/Footer.tsx';
import { Header } from 'Modules/startDesktop/components/qrCodeSection/components/header/Header.tsx';
import { StatusCard } from 'Modules/startDesktop/components/qrCodeSection/components/statusCard/StatusCard.tsx';
import {
  useQrStatusPolling,
  useQrInstance,
  QR_CONFIG,
} from 'Modules/startDesktop/components/qrCodeSection/hooks';

import styles from './QrCodeSection.module.scss';

const QR_LOGO_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(qrLogoSvg)}`;

export const QrCodeSection = observer(function () {
  const qrService = useQrStore();
  const qrStatusService = useQrStatusStore();

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  const qrInfo = qrService.qrInfo;
  const qrLink = qrInfo?.deeplinkUrl ?? null;
  const expiresIn = qrInfo?.expiresIn;
  const qrId = qrInfo?.id ?? null;
  const isLoading = qrService.isLoading;
  const qrError = qrService.error;
  const errorRedirectUri = qrService.redirectUriOnError;
  const errorStatusCode = qrService.statusCodeOnError;
  const hasError = Boolean(qrError);

  const qrStatus = qrStatusService.status;
  // const qrStatus = AUTH_STATUSES.EXPIRED;
  const redirectUrl = qrStatusService.redirectUrl;
  const qrStatusErrorRedirectUri = qrStatusService.redirectUriOnError;
  const qrStatusErrorStatusCode = qrStatusService.statusCodeOnError;

  const displayStatus = isTimerExpired ? AUTH_STATUSES.EXPIRED : qrStatus;

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const isRefreshingQrInfoRef = useRef(false);

  const handleRetry = useCallback(() => {
    if (isRefreshingQrInfoRef.current) {
      return;
    }

    isRefreshingQrInfoRef.current = true;
    qrStatusService.reset();
    void qrService.fetchQrInfo();
  }, [qrService, qrStatusService]);

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

  useQrStatusPolling(qrId, !isTimerExpired);

  // Инициализирует таймер обратного отсчёта для QR-кода.
  useEffect(() => {
    isRefreshingQrInfoRef.current = false;

    if (!expiresIn) {
      setSecondsLeft(null);
      setIsTimerExpired(false);
      return;
    }

    const targetMs = getTargetMs(expiresIn);
    if (targetMs == null) {
      setSecondsLeft(0);
      setIsTimerExpired(false);
      return;
    }

    const calc = () => Math.max(0, Math.floor((targetMs - Date.now()) / 1000));

    const initialSeconds = calc();
    setSecondsLeft(initialSeconds);
    setIsTimerExpired(initialSeconds === 0);

    const id = window.setInterval(() => {
      setSecondsLeft(() => {
        const next = calc();
        if (next === 0) {
          window.clearInterval(id);
          setIsTimerExpired(true);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [expiresIn]);

  // Обновляет QR-ссылку в QR-коде
  useEffect(() => {
    if (!qrInstanceRef.current) return;
    qrInstanceRef.current.update({ data: qrLink ?? '' });
  }, [qrLink, qrInstanceRef]);

  // Редирект при CONFIRMED, при CANCELLED заново рендерится (в мобильном приложении если просто вышел назад)
  useEffect(() => {
    if (qrStatus === AUTH_STATUSES.CONFIRMED && redirectUrl) {
      window.location.replace(redirectUrl);
    } else if (qrStatus === AUTH_STATUSES.CANCELLED) {
      handleRetry();
    }
  }, [qrStatus, redirectUrl]);

  // Редирект
  useEffect(() => {
    if (errorRedirectUri && errorStatusCode && errorStatusCode !== 200) {
      window.location.replace(errorRedirectUri);
      return;
    }
    if (qrStatusErrorRedirectUri && qrStatusErrorStatusCode && qrStatusErrorStatusCode !== 200) {
      window.location.replace(qrStatusErrorRedirectUri);
    }
  }, [errorRedirectUri, errorStatusCode, qrStatusErrorRedirectUri, qrStatusErrorStatusCode]);

  const qrReady = Boolean(qrLink) && Boolean(qrInstanceRef.current);

  const timerLabel = secondsLeft != null ? formatMMSS(secondsLeft) : null;

  const renderContent = () => {
    if (hasError) {
      return <ErrorStatus onRetry={handleRetry} />;
    }

    return (
      <>
        <Header />
        <StatusCard
          status={displayStatus}
          qrContainerRef={qrContainerRef}
          qrReady={qrReady}
          qrError={qrError}
          libraryError={libraryError}
          isLoading={isLoading}
          timerLabel={timerLabel}
          onRetry={handleRetry}
        />
      </>
    );
  };

  return (
    <section className={styles.section}>
      <div
        className={classNames(styles.content, {
          [styles.contentError]: hasError,
        })}
      >
        {renderContent()}
        <Footer />
      </div>
    </section>
  );
});
