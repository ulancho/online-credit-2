import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';

import { useQueryParams } from 'Common/hooks/useQueryParams.ts';
import {
  useStartMobileStatusStore,
  useStartMobileStore,
  useStartStore,
} from 'Common/stores/rootStore.tsx';
import { AUTH_STATUSES } from 'Common/types/authStatus.ts';
import ConfirmedStatus from 'Modules/startMobile/components/confirmedStatus/ConfirmedStatus.tsx';
import DefaultContent from 'Modules/startMobile/components/defaultContent/DefaultContent.tsx';
import DeniedStatus from 'Modules/startMobile/components/deniedStatus/DeniedStatus.tsx';
import Footer from 'Modules/startMobile/components/footer/Footer.tsx';
import GeneratedStatus from 'Modules/startMobile/components/generatedStatus/GeneratedStatus.tsx';
import Header from 'Modules/startMobile/components/header/Header.tsx';

import styles from './styles/style.module.scss';

const START_MOBILE_RETURN_FLAG_KEY = 'startMobileReturnFromApp';
const START_MOBILE_RETURN_ID_KEY = 'startMobileReturnId';

const StartMobile = () => {
  const queryParams = useQueryParams();
  const startStore = useStartStore();
  const startMobileInfoStore = useStartMobileStore();
  const startMobileStatusStore = useStartMobileStatusStore();
  const shouldShowSkeleton = startStore.isLoadingStartInfo && !startStore.startInfo;
  const clientName = startStore.startInfo?.clientName ?? '';
  const logoUrl = startStore.startInfo?.logoUrl;

  const status = startMobileStatusStore.mobileStatus?.status;
  const redirectUrl = startMobileStatusStore.mobileStatus?.redirectUrl;

  const handleMBankLogin = async () => {
    const data = await startMobileInfoStore.fetchStartMobileInfo();

    if (data?.deepLinkUrl) {
      sessionStorage.setItem(START_MOBILE_RETURN_FLAG_KEY, '1');
      sessionStorage.setItem(START_MOBILE_RETURN_ID_KEY, data.id);
      window.location.href = data.deepLinkUrl;
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  useEffect(() => {
    console.log('111');
    startStore.setQueryParams(queryParams);

    let isActive = true;

    const redirectToErrorPage = () => {
      window.location.assign('/error-mobile');
    };

    const handleRedirect = (status?: number, redirectUri?: string | null) => {
      if (status && status !== 200) {
        if (redirectUri) {
          window.location.replace(redirectUri);
          return;
        }
      }

      redirectToErrorPage();
    };

    void (async () => {
      const { isSuccess, errorStatus, redirectUri } = await startStore.fetchStartInfo();

      if (!isActive) {
        return;
      }

      if (!isSuccess) {
        handleRedirect(errorStatus, redirectUri);
      }
    })();

    return () => {
      isActive = false;
      startStore.reset();
    };
  }, [queryParams, startStore]);

  useEffect(() => {
    console.log('222');
    const returnFlag = sessionStorage.getItem(START_MOBILE_RETURN_FLAG_KEY);
    const returnId = sessionStorage.getItem(START_MOBILE_RETURN_ID_KEY);

    if (returnFlag === '1' && returnId) {
      sessionStorage.removeItem(START_MOBILE_RETURN_FLAG_KEY);
      sessionStorage.removeItem(START_MOBILE_RETURN_ID_KEY);

      startMobileStatusStore.startStatusPolling(returnId);
    }
  }, [startMobileStatusStore]);

  useEffect(() => {
    console.log('333');
    return () => {
      startMobileStatusStore.stopStatusPolling();
    };
  }, [startMobileStatusStore]);

  useEffect(() => {
    console.log('444');
    if (status !== AUTH_STATUSES.CONFIRMED || !redirectUrl) {
      return;
    }

    startMobileStatusStore.stopStatusPolling();

    const timeoutId = window.setTimeout(() => {
      window.location.replace(redirectUrl);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [redirectUrl, startMobileStatusStore, status]);

  const renderContainerContent = () => {
    switch (status) {
      case AUTH_STATUSES.GENERATED:
        return <GeneratedStatus />;
      case AUTH_STATUSES.CONFIRMED:
        return <ConfirmedStatus />;
      case AUTH_STATUSES.DENIED:
        return <DeniedStatus onReload={handleReload} />;
      case AUTH_STATUSES.CANCELLED:
      default:
        return (
          <DefaultContent
            shouldShowSkeleton={shouldShowSkeleton}
            onLogin={handleMBankLogin}
            isLoading={startMobileInfoStore.isLoadingStartMobile}
            clientName={clientName}
          />
        );
    }
  };

  return (
    <main className={styles.mobilePageWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.cardWrapper}>
          <Header
            shouldShowSkeleton={shouldShowSkeleton}
            logoUrl={logoUrl}
            status={status}
            clientName={clientName}
          />
          {renderContainerContent()}
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default observer(StartMobile);
