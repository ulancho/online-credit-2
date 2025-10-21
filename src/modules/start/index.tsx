import { useEffect } from 'react';

import { useQueryParams } from 'Common/hooks/useQueryParams.ts';
import { useQrStatusStore, useQrStore, useStartStore } from 'Common/stores/rootStore.tsx';

import { PhoneInputSection } from './components/phoneInputSection/PhoneInputSection.tsx';
import { QrCodeSection } from './components/qrCodeSection/QrCodeSection.tsx';
import styles from './styles/index.module.scss';

function Start() {
  const startStore = useStartStore();
  const qrStore = useQrStore();
  const qrStatusStore = useQrStatusStore();
  const queryParams = useQueryParams();

  useEffect(() => {
    startStore.setQueryParams(queryParams);
    qrStatusStore.reset();

    let isActive = true;

    void (async () => {
      const isStartInfoFetched = await startStore.fetchStartInfo();

      if (isActive && isStartInfoFetched) {
        await qrStore.fetchQrInfo();
      }
    })();

    return () => {
      isActive = false;
      startStore.reset();
      qrStatusStore.reset();
    };
  }, [queryParams, startStore, qrStore, qrStatusStore]);

  return (
    <div className={styles.modalContainer}>
      <div className={styles.backgroundWrapper}>
        <main className={styles.modalContent}>
          <div className={styles.sectionsContainer}>
            <PhoneInputSection />
            <QrCodeSection />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Start;
