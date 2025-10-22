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
            <img src="/src/assets/icons/error-mobile.svg" alt="error icon" />
          </div>
          <div className={styles.action}>
            <button onClick={handleReload}>
              <img src="src/assets/icons/reload.svg" alt="reload icon" />
              <span>Попробовать еще раз</span>
            </button>
          </div>
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

export default ErrorMobile;
