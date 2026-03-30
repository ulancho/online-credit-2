import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQueryParams } from 'Common/hooks/useQueryParams.ts';
import { useApplicationStatusStore, useQueryParamsStore } from 'Common/stores/rootStore.tsx';

import styles from './ApplicationStatusRedirect.module.scss';

const ApplicationStatusRedirect = () => {
  const applicationStatusService = useApplicationStatusStore();
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const queryParamsService = useQueryParamsStore();

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
  }, [applicationStatusService.isLoading, applicationStatusService.application, navigate]);

  useEffect(() => {
    queryParamsService.setQueryParams(queryParams);
  }, [queryParams, queryParamsService]);

  return (
    <div className={styles.uploadingScreen}>
      <div className={styles.spinner} />
    </div>
  );
};

export default observer(ApplicationStatusRedirect);
