import { useEffect } from 'react';

import { useQueryParams } from 'Common/hooks/useQueryParams.ts';
import { useQrStatusStore, useQrStore, useStartStore } from 'Common/stores/rootStore.tsx';
import { PhoneInputSection } from 'Modules/startDesktop/components/phoneInputSection/PhoneInputSection.tsx';
import { QrCodeSection } from 'Modules/startDesktop/components/qrCodeSection/QrCodeSection.tsx';

import styles from './styles/index.module.scss';

function redirectToErrorPage() {
  window.location.assign('/error-web');
}

function StartDesktop() {
  const startService = useStartStore();
  const qrService = useQrStore();
  const qrStatusService = useQrStatusStore();
  const queryParams = useQueryParams();

  // Синхронизация query-параметров + сброс стора
  useEffect(() => {
    startService.setQueryParams(queryParams);
    qrStatusService.reset();

    return () => {
      startService.reset();
      qrStatusService.reset();
    };
  }, [queryParams, startService, qrStatusService]);

  // Загрузка стартовой информации и QR
  useEffect(() => {
    console.log('start');
    let isActive = true;

    const handleRedirect = (status?: number, redirectUri?: string | null) => {
      if (status && status !== 200) {
        if (redirectUri) {
          window.location.assign(redirectUri);
          return;
        }
      }

      redirectToErrorPage();
    };

    void (async () => {
      const { isSuccess, errorStatus, redirectUri } = await startService.fetchStartInfo();

      if (!isActive) return;

      if (isSuccess) {
        await qrService.fetchQrInfo();
        return;
      }

      handleRedirect(errorStatus, redirectUri);
    })();

    return () => {
      isActive = false;
    };
  }, [startService, qrService, queryParams]);

  return (
    <main className={styles.content}>
      <div className={styles.sectionsContainer}>
        <PhoneInputSection />
        <QrCodeSection />
      </div>
    </main>
  );
}

export default StartDesktop;
