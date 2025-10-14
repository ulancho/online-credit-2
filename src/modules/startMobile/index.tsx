import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { useQueryParams } from 'Common/hooks/useQueryParams.ts';
import { useStartMobileStore, useStartStore } from 'Common/stores/rootStore.tsx';
import AuthButton from 'Modules/startMobile/components/authButton';
import PrivacyText from 'Modules/startMobile/components/privacyText';

import styles from './styles/style.module.css';

const StartMobile = () => {
  const queryParams = useQueryParams();
  const startStore = useStartStore();
  const startMobileInfoStore = useStartMobileStore();

  const handleMBankLogin = () => {
    void startMobileInfoStore.fetchStartMobileInfo();
  };

  useEffect(() => {
    startStore.setQueryParams(queryParams);

    void startStore.fetchStartInfo();

    return () => {
      startStore.reset();
    };
  }, [queryParams, startStore]);

  return (
    <main className={styles.mobilePageWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.cardWrapper}>
          <header className={styles.headerSection}>
            {startStore.startInfo?.logoUrl && (
              <img src={startStore.startInfo.logoUrl} alt="partner-logo" className={styles.logo} />
            )}
            <div className={styles.titleSection}>
              <h1 className={styles.mainTitle}>Войти через MBANK ID</h1>
              <p className={styles.subtitle}>{startStore.startInfo?.clientName}</p>
            </div>
          </header>

          <section className={styles.actionSection}>
            <AuthButton onClick={handleMBankLogin}>Перейти в MBANK</AuthButton>
            <PrivacyText />
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
