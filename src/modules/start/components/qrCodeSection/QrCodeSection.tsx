import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef } from 'react';

import qrLogoSvg from 'Assets/icons/mbank-logo.svg?raw';
import { useQrStatusStore, useQrStore } from 'Common/stores/rootStore.tsx';
import { Footer } from 'Modules/start/components/qrCodeSection/components/footer/Footer.tsx';
import { Header } from 'Modules/start/components/qrCodeSection/components/header/Header.tsx';
import { StatusCard } from 'Modules/start/components/qrCodeSection/components/statusCard/StatusCard.tsx';
import {
  useCountdown,
  useQrStatusPolling,
  useQrInstance,
  QR_CONFIG,
} from 'Modules/start/components/qrCodeSection/hooks';

import styles from './QrCodeSection.module.scss';

const QR_LOGO_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(qrLogoSvg)}`;

const formatTime = (seconds: number) => {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
};

export const QrCodeSection = observer(function () {
  const qrService = useQrStore();
  const qrStatusService = useQrStatusStore();

  const qrInfo = qrService.qrInfo;
  const qrLink = qrInfo?.deeplinkUrl ?? null;
  const expiresIn = qrInfo?.expiresIn ?? null;
  const qrId = qrInfo?.id ?? null;
  const isLoading = qrService.isLoading;
  const qrError = qrService.error;
  const qrStatus = qrStatusService.status;

  console.log('expiresIn: ', expiresIn);

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
