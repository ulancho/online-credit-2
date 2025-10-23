import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { useQueryParams } from 'Common/hooks/useQueryParams.ts';
import {
  useStartMobileStatusStore,
  useStartMobileStore,
  useStartStore,
} from 'Common/stores/rootStore.tsx';
import AuthButton from 'Modules/startMobile/components/authButton';
import PrivacyText from 'Modules/startMobile/components/privacyText';

import styles from './styles/style.module.css';

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

  const handleMBankLogin = () => {
    void startMobileInfoStore.fetchStartMobileInfo();
  };

  useEffect(() => {
    startStore.setQueryParams(queryParams);

    void startStore.fetchStartInfo('mobile');

    return () => {
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

  return (
    <main className={styles.mobilePageWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.cardWrapper}>
          <header className={styles.headerSection}>
            {shouldShowSkeleton ? (
              <Skeleton circle height={80} width={80} containerClassName={styles.logoSkeleton} />
            ) : (
              logoUrl && <img src={logoUrl} alt="partner-logo" className={styles.logo} />
            )}
            <div className={styles.titleSection}>
              <h1 className={styles.mainTitle}>Войти через MBANK ID</h1>
              {shouldShowSkeleton ? (
                <Skeleton height={22} width="60%" className={styles.subtitleSkeleton} />
              ) : (
                <p className={styles.subtitle}>{clientName}</p>
              )}
            </div>
          </header>

          <section className={styles.actionSection}>
            {shouldShowSkeleton ? (
              <Skeleton height={56} borderRadius={12} className={styles.buttonSkeleton} />
            ) : (
              <AuthButton
                onClick={handleMBankLogin}
                isLoading={startMobileInfoStore.isLoadingStartMobile}
              >
                Перейти в MBANK
              </AuthButton>
            )}
            {shouldShowSkeleton ? (
              <div className={styles.privacySkeleton}>
                <Skeleton height={12} />
                <Skeleton height={12} />
                <Skeleton height={12} width="80%" />
              </div>
            ) : (
              <PrivacyText />
            )}
          </section>

          <footer className={styles.footerSection}>
            <img
              src="/src/assets/icons/mbank-logo-2.svg"
              alt="mbank-logo"
              className={styles.footerLogo}
            />
          </footer>
        </div>
      </div>
    </main>
  );
};

export default observer(StartMobile);
