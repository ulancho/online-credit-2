import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './CoolingPeriod.module.scss';

interface LocationState {
  /** Remaining seconds on the cooling period timer */
  secondsLeft?: number;
  /** Whether the loan amount exceeds 100 000 som (shows info notification) */
  showInfoNotification?: boolean;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export default function CoolingPeriod() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as LocationState) ?? {};
  // Default to 23 min 30 sec for preview; real usage should pass secondsLeft via location.state
  const initialSeconds = state.secondsLeft ?? 23 * 60 + 30;
  const showInfoNotification = state.showInfoNotification ?? false;

  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const isFinished = secondsLeft <= 0;

  useEffect(() => {
    if (initialSeconds <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.navbar}>
        <div className={styles.navbarToolbar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Назад">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5.74023 11.9492C5.74023 12.2812 5.86719 12.5645 6.13086 12.8184L13.748 20.2695C13.9531 20.4844 14.2266 20.5918 14.5391 20.5918C15.1738 20.5918 15.6719 20.1035 15.6719 19.459C15.6719 19.1465 15.5449 18.8633 15.3301 18.6484L8.46484 11.9492L15.3301 5.25C15.5449 5.02539 15.6719 4.74219 15.6719 4.42969C15.6719 3.79492 15.1738 3.30664 14.5391 3.30664C14.2266 3.30664 13.9531 3.41406 13.748 3.62891L6.13086 11.0801C5.86719 11.334 5.75 11.6172 5.74023 11.9492Z"
                fill="#129958"
              />
            </svg>
          </button>
        </div>
        <div className={styles.navbarContent}>
          <h1 className={styles.pageTitle}>Период охлаждения</h1>
          <p className={styles.pageDescription}>
            Кредитные средства будут зачислены на ваш основной счет MBANK по истечению периода
            охлаждения.{'\n'}Данные меры предусмотрены для Вашей защиты от мошеннических действий
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.content}>
        {/* Timer */}
        <div className={styles.timerBlock}>
          <span className={styles.timerDisplay}>{formatTime(Math.max(0, secondsLeft))}</span>
          <span className={styles.timerLabel}>
            {isFinished
              ? 'Денежные средства будут зачислены в ближайшее время'
              : 'До получения кредита'}
          </span>
        </div>

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
              <span className={styles.infoTextGray}>
                В течение действия периода охлаждения на ваш номер MBANK поступит контрольный
                звонок с короткого номера{' '}
              </span>
              <span className={styles.infoTextAccent}>3366</span>
              <span className={styles.infoTextGray}>{'\n'}Подробная информация по номеру </span>
              <span className={styles.infoTextAccent}>3366</span>
            </p>
          </div>
        )}
      </main>

      {/* Bottom actions */}
      <footer className={styles.footer}>
        <div className={styles.primaryBtnWrap}>
          <button className={styles.primaryBtn} onClick={() => navigate(-1)}>
            Понятно
          </button>
        </div>
        <div className={styles.dangerBtnWrap}>
          <button className={styles.dangerBtn}>Отказаться от кредита</button>
        </div>
        <div className={styles.homeIndicator} />
      </footer>
    </div>
  );
}
