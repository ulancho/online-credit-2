import errorIconUrl from 'Assets/icons/error-mobile.svg';
import reloadIconUrl from 'Assets/icons/reload.svg';
import { useTranslation } from 'Common/i18n';

import styles from './ErrorStatus.module.scss';

interface ErrorStatusProps {
  onRetry: () => void;
}

const ErrorStatus = ({ onRetry }: ErrorStatusProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <header>
        <h2 className={styles.title}>{t('common.errors.somethingError')}</h2>
        <p className={styles.subtitle}>{t('common.errors.tryAgain')}</p>
      </header>
      <div className={styles.errorIconContainer}>
        <img src={errorIconUrl} alt="error-icon" />
      </div>
      <div className={styles.actionContainer}>
        <button type="button" className={styles.refreshButton} onClick={onRetry}>
          <img src={reloadIconUrl} alt="reload-icon" className={styles.refreshIcon} />
          <span className={styles.refreshText}>{t('common.actions.retry')}</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorStatus;
