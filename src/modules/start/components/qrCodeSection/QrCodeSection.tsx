import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';

import qrLogoSvg from 'Assets/icons/mbank-logo.svg?raw';
import { useQrStatusStore, useQrStore } from 'Common/stores/rootStore.tsx';
import { formatMMSS, getTargetMs } from 'Common/utils/time.ts';
import { Footer } from 'Modules/start/components/qrCodeSection/components/footer/Footer.tsx';
import { Header } from 'Modules/start/components/qrCodeSection/components/header/Header.tsx';
import { StatusCard } from 'Modules/start/components/qrCodeSection/components/statusCard/StatusCard.tsx';
import {
  useQrStatusPolling,
  useQrInstance,
  QR_CONFIG,
} from 'Modules/start/components/qrCodeSection/hooks';

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

  const qrStatus = qrStatusService.status;

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const isRefreshingQrInfoRef = useRef(false);

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

  const qrReady = Boolean(qrLink) && Boolean(qrInstanceRef.current);

  const timerLabel = secondsLeft != null ? `Истекает через ${formatMMSS(secondsLeft)}` : null;

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <Header />
        <StatusCard
          status={qrStatus}
          qrContainerRef={qrContainerRef}
          qrReady={qrReady}
          qrError={qrError}
          libraryError={libraryError}
          isLoading={isLoading}
          timerLabel={timerLabel}
        />
        <Footer />
      </div>
    </section>
  );
});
