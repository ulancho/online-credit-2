import expiredIconUrl from 'Assets/icons/expired.svg';
import refreshIconUrl from 'Assets/icons/refresh.svg';
import { useTranslation } from 'Common/i18n';

import styles from './ExpiredStatus.module.scss';

interface ExpiredStatusProps {
  onRetry: () => void;
  isLoading: boolean;
}

export const ExpiredStatus = ({ onRetry, isLoading }: ExpiredStatusProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <img src={expiredIconUrl} alt="expired" className={styles.icon} />
      <p className={styles.title}>{t('startDesktop.qr.status.expired.title')}</p>
      <button type="button" className={styles.refreshButton} onClick={onRetry} disabled={isLoading}>
        <img src={refreshIconUrl} alt="refresh" className={styles.refreshIcon} />
        <span className={styles.refreshText}>{t('startDesktop.qr.status.expired.btn')}</span>
      </button>
    </div>
  );
};
