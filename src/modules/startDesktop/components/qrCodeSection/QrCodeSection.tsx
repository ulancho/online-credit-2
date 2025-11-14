import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import qrLogoSvg from 'Assets/icons/mbank-logo.svg?raw';
import { useQrStatusStore, useQrStore } from 'Common/stores/rootStore.tsx';
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
  const redirectUrl = qrStatusService.redirectUrl;

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

  useQrStatusPolling(qrId);

  useEffect(() => {
    isRefreshingQrInfoRef.current = false;

    if (!expiresIn) {
      setSecondsLeft(null);
      return;
    }

    const targetMs = getTargetMs(expiresIn);
    if (targetMs == null) {
      setSecondsLeft(0);
      return;
    }

    const calc = () => Math.max(0, Math.floor((targetMs - Date.now()) / 1000));

    setSecondsLeft(calc());

    const id = window.setInterval(() => {
      setSecondsLeft(() => {
        const next = calc();
        if (next === 0) {
          window.clearInterval(id);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [expiresIn]);

  useEffect(() => {
    if (!qrInstanceRef.current) return;
    qrInstanceRef.current.update({ data: qrLink ?? '' });
  }, [qrLink, qrInstanceRef]);

  useEffect(() => {
    if (secondsLeft !== 0) {
      if (secondsLeft == null || secondsLeft > 0) {
        isRefreshingQrInfoRef.current = false;
      }
      return;
    }

    if (isRefreshingQrInfoRef.current) {
      return;
    }

    isRefreshingQrInfoRef.current = true;
    void qrService.fetchQrInfo();
  }, [qrService, secondsLeft]);

  useEffect(() => {
    if (qrStatus === 'CONFIRMED' && redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [qrStatus, redirectUrl]);

  useEffect(() => {
    if (errorRedirectUri && errorStatusCode && errorStatusCode !== 200) {
      window.location.replace(errorRedirectUri);
    }
  }, [errorRedirectUri, errorStatusCode]);

  const qrReady = Boolean(qrLink) && Boolean(qrInstanceRef.current);

  const timerLabel = secondsLeft != null ? formatMMSS(secondsLeft) : null;

  const renderContent = () => {
    if (hasError) {
      return <ErrorStatus />;
    }

    return (
      <>
        <Header />
        <StatusCard
          status={qrStatus}
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
