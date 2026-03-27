import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import { useQueryParams } from 'Common/hooks/useQueryParams.ts';
import { useApplicationStatusStore } from 'Common/stores/rootStore.tsx';

import styles from './ApplicationStatusRedirect.module.scss';

const ApplicationStatusRedirect = () => {
  const applicationStatusService = useApplicationStatusStore();
  const navigate = useNavigate();
  // const queryParamService = useQueryParams();

  useEffect(() => {
    if (!applicationStatusService.application && !applicationStatusService.isLoading) {
      void applicationStatusService.loadActiveApplicationExist();
    }
  }, [applicationStatusService]);

  useEffect(() => {
    if (applicationStatusService.isLoading || !applicationStatusService.application) {
      return;
    }
    navigate(applicationStatusService.redirectRoute, { replace: true });
  }, [applicationStatusService.isLoading, navigate]);

  return (
    <div className={styles.uploadingScreen}>
      <div className={styles.spinner} />
    </div>
  );
};

export default observer(ApplicationStatusRedirect);
