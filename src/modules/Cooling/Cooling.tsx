import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import ConfirmationModal from '@/common/components/Modal/ConfirmationModal';
import { useTranslation } from '@/common/i18n';
import { exitApp } from 'Common/api/common.ts';
import Button from 'Common/components/Button/Button.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';
import {
  useApplicationStatusStore,
  useApplicationStore,
  useCoolingStore,
} from 'Common/stores/rootStore.tsx';

import styles from './Cooling.module.scss';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

function Cooling() {
  const { t } = useTranslation();
  const [confirmationModalActive, setConfirmationModalActive] = useState<boolean | null>(null);

  const applicationStatusService = useApplicationStatusStore();
  const applicationService = useApplicationStore();
  const coolingStore = useCoolingStore();

  const [secondsLeft, setSecondsLeft] = useState(0);
  const awaitingIssueInfo = coolingStore.awaitingIssueInfo;

  const handleOpenConfirmationModalClick = () => setConfirmationModalActive(true);

  const handleDeclineApplicationClick = async () => {
    const applicationId = applicationStatusService.requestId;

    if (!applicationId) {
      alert(t('cooling.failedToGetApplicationId'));
      return;
    }

    try {
      const response = await applicationService.setDeclineApplication(applicationId);

      if (response.status === 200) {
        exitApp().then(() => console.log('закрытие модалки'));
      }
    } catch (error) {
      alert(t('cooling.tryAgain'));
    }
  };

  useEffect(() => {
    const requestId = applicationStatusService.application?.requestId;

    if (!requestId) {
      return;
    }

    void coolingStore.loadAwaitingIssue(requestId);
  }, [applicationStatusService.application?.requestId, coolingStore]);

  useEffect(() => {
    if (!awaitingIssueInfo?.awaitingLifetime) {
      setSecondsLeft(0);
      return;
    }

    const tick = () => {
      const msLeft = new Date(awaitingIssueInfo.awaitingLifetime).getTime() - Date.now();
      setSecondsLeft(Math.max(0, Math.floor(msLeft / 1000)));
    };

    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [awaitingIssueInfo?.awaitingLifetime]);

  const isFinished = secondsLeft <= 0;
  const showInfoNotification = applicationStatusService.application?.amount
    ? applicationStatusService.application?.amount > 100000
    : false;

  return (
    <div className={styles.page}>
      <NavBar onBack={exitApp} />
      {/* Header */}
      <header className={styles.navbar}>
        <div className={styles.navbarContent}>
          <h1 className={styles.pageTitle}>{t('cooling.title')}</h1>
          <p className={styles.pageDescription}>{t('cooling.desc')}</p>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.content}>
        {/* Timer */}
        <div className={styles.timerBlock}>
          <span className={styles.timerDisplay}>{formatTime(Math.max(0, secondsLeft))}</span>
          <span className={styles.timerLabel}>
            {isFinished ? t('cooling.creditingOfFunds') : t('cooling.beforeGettingCredit')}
          </span>
        </div>
      </main>

      {/* Bottom actions */}
      <footer className={styles.footer}>
        {/* Info notification (amount > 100 000 som) */}
        {showInfoNotification && (
          <div className={styles.infoNotification}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.infoIcon}>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
                fill="#129958"
              />
            </svg>
            <p className={styles.infoText}>
              <span className={styles.infoTextGray}>{t('cooling.controlCall')} </span>
              <span className={styles.infoTextAccent}>3366</span>
              <span className={styles.infoTextGray}>
                {'\n'}
                {t('cooling.detailedInformationOnTheNumber')}{' '}
              </span>
              <span className={styles.infoTextAccent}>3366</span>
            </p>
          </div>
        )}

        <div className={styles.primaryBtnWrap}>
          <Button onClick={() => exitApp()}>{t('btns.gotIt')}</Button>
        </div>
        <div className={styles.dangerBtnWrap}>
          <Button variant="text-danger" onClick={handleOpenConfirmationModalClick}>
            {t('btns.declineFromCredit')}
          </Button>
        </div>
        <div className={styles.homeIndicator} />
      </footer>

      <ConfirmationModal
        submit={handleDeclineApplicationClick}
        active={confirmationModalActive}
        setActive={setConfirmationModalActive}
      />
    </div>
  );
}

export default observer(Cooling);
