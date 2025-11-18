import errorIconUrl from 'Assets/icons/error-mobile.svg';
import mbankLogoUrl from 'Assets/icons/mbank-logo-2.svg';
import reloadIconUrl from 'Assets/icons/reload.svg';
import { useTranslation } from 'Common/i18n';

import styles from './styles/style.module.scss';

const ErrorMobile = () => {
  const { t } = useTranslation();

  const handleReload = () => {
    window.history.back();
  };

  return (
    <main className={styles.mobilePageWrapper}>
      <div className={styles.container}>
        <div className={styles.cardWrapper}>
          <header>
            <h2 className={styles.title}>{t('common.errors.somethingError')}</h2>
            <p className={styles.subtitle}>{t('common.errors.tryAgain')}</p>
          </header>
          <div className={styles.errorIconContainer}>
            <img src={errorIconUrl} alt="error-icon" />
          </div>
          <div className={styles.action}>
            <button onClick={handleReload}>
              <img src={reloadIconUrl} alt="reload-icon" />
              <span>{t('common.actions.retry')}</span>
            </button>
          </div>
          <footer className={styles.footerSection}>
            <img src={mbankLogoUrl} alt="mbank-logo" className={styles.footerLogo} />
          </footer>
        </div>
      </div>
    </main>
  );
};

export default ErrorMobile;
