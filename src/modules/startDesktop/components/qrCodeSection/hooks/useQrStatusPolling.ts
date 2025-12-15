import { useEffect } from 'react';

import { useQrStatusStore } from 'Common/stores/rootStore.tsx';

export function useQrStatusPolling(qrId: string | null, isEnabled = true) {
  const qrStatusStore = useQrStatusStore();

  useEffect(() => {
    if (!qrId) {
      qrStatusStore.reset();
      return;
    }

    if (!isEnabled) {
      return;
    }

    let disposed = false;

    const tick = () => {
      if (disposed) return;
      if (qrStatusStore.isLoading) return;
      void qrStatusStore.fetchQrStatus(qrId);
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
    };
  }, [qrId, qrStatusStore, isEnabled]);
}
