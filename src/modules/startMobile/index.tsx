import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';

import { useQueryParams } from 'Common/hooks/useQueryParams.ts';
import {
  useStartMobileStatusStore,
  useStartMobileStore,
  useStartStore,
} from 'Common/stores/rootStore.tsx';
import ConfirmedStatus from 'Modules/startMobile/components/confirmedStatus/ConfirmedStatus.tsx';
import DefaultContent from 'Modules/startMobile/components/defaultContent/DefaultContent.tsx';
import DeniedStatus from 'Modules/startMobile/components/deniedStatus/DeniedStatus.tsx';
import Footer from 'Modules/startMobile/components/footer/Footer.tsx';
import GeneratedStatus from 'Modules/startMobile/components/generatedStatus/GeneratedStatus.tsx';
import Header from 'Modules/startMobile/components/header/Header.tsx';

import styles from './styles/style.module.scss';

const StartMobile = () => {
  const queryParams = useQueryParams();
  const startStore = useStartStore();
  const startMobileInfoStore = useStartMobileStore();
  const startMobileStatusStore = useStartMobileStatusStore();
  const shouldShowSkeleton = startStore.isLoadingStartInfo && !startStore.startInfo;
  const clientName = startStore.startInfo?.clientName ?? '';
  const logoUrl = startStore.startInfo?.logoUrl;
  const status = startMobileStatusStore.mobileStatus?.status;
  // const status = 'DENIED';
  const redirectUrl = startMobileStatusStore.mobileStatus?.redirectUrl;

  const handleMBankLogin = async () => {
    const data = await startMobileInfoStore.fetchStartMobileInfo();

    if (data?.deepLinkUrl) {
      window.location.href = data.deepLinkUrl;
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  useEffect(() => {
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
    return () => {
      startMobileStatusStore.stopStatusPolling();
    };
  }, [startMobileStatusStore]);

  useEffect(() => {
    if (status !== 'CONFIRMED' || !redirectUrl) {
      return;
    }

    startMobileStatusStore.stopStatusPolling();

    const timeoutId = window.setTimeout(() => {
      window.location.replace(redirectUrl);
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [redirectUrl, startMobileStatusStore, status]);

  const renderContainerContent = () => {
    switch (status) {
      case 'GENERATED':
        return <GeneratedStatus />;
      case 'CONFIRMED':
        return <ConfirmedStatus />;
      case 'DENIED':
        return <DeniedStatus onReload={handleReload} />;
      default:
        return (
          <DefaultContent
            shouldShowSkeleton={shouldShowSkeleton}
            onLogin={handleMBankLogin}
            isLoading={startMobileInfoStore.isLoadingStartMobile}
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
