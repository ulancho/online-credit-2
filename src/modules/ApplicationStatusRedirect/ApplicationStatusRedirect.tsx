import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApplicationStatusStore } from 'Common/stores/rootStore.tsx';

import styles from './ApplicationStatusRedirect.module.scss';

const ApplicationStatusRedirect = () => {
  const applicationStatusStore = useApplicationStatusStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!applicationStatusStore.application && !applicationStatusStore.isLoading) {
      void applicationStatusStore.loadActiveApplicationStatus();
    }
  }, [applicationStatusStore]);

  useEffect(() => {
    if (applicationStatusStore.isLoading || !applicationStatusStore.application) {
      return;
    }

    navigate(applicationStatusStore.redirectRoute, { replace: true });
  }, [applicationStatusStore, navigate]);

  return (
    <div className={styles.uploadingScreen}>
      <div className={styles.spinner} />
    </div>
  );
};

export default observer(ApplicationStatusRedirect);
