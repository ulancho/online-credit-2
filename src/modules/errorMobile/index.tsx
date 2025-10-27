import errorIconUrl from 'Assets/icons/error-mobile.svg';
import mbankLogoUrl from 'Assets/icons/mbank-logo-2.svg';
import reloadIconUrl from 'Assets/icons/reload.svg';

import styles from './styles/style.module.scss';

const ErrorMobile = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <main className={styles.mobilePageWrapper}>
      <div className={styles.container}>
        <div className={styles.cardWrapper}>
          <header>
            <h2 className={styles.title}>Что-то пошло не так</h2>
            <p className={styles.subtitle}>Попробуйте ещё раз позже</p>
          </header>
          <div className={styles.errorIconContainer}>
            <img src={errorIconUrl} alt="error-icon" />
          </div>
          <div className={styles.action}>
            <button onClick={handleReload}>
              <img src={reloadIconUrl} alt="reload-icon" />
              <span>Попробовать еще раз</span>
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
