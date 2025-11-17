import deniedIconUrl from 'Assets/icons/denied.svg';
import refreshIconUrl from 'Assets/icons/refresh.svg';
import { useTranslation } from 'Common/i18n';

import styles from './DeniedStatus.module.scss';

interface DeniedStatusProps {
  onRetry: () => void;
  isLoading: boolean;
}

export const DeniedStatus = ({ onRetry, isLoading }: DeniedStatusProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <img src={deniedIconUrl} alt="denied" className={styles.icon} />
      <p className={styles.title}>{t('start.common.signInDenied')}</p>
      <button type="button" className={styles.refreshButton} onClick={onRetry} disabled={isLoading}>
        <img src={refreshIconUrl} alt="refresh" className={styles.refreshIcon} />
        <span className={styles.refreshText}>{t('common.actions.retry')}</span>
      </button>
    </div>
  );
};
