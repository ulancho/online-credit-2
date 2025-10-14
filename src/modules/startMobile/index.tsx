import AuthButton from 'Modules/startMobile/components/authButton';
import PrivacyText from 'Modules/startMobile/components/privacyText';

import styles from './style.module.css';

const StartMobile = () => {
  const handleMBankLogin = () => {
    console.log('Redirecting to MBANK...');
  };

  return (
    <main className={styles.mobilePageWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.cardWrapper}>
          <header className={styles.headerSection}>
            <img src="src/assets/images/ticket_kg.png" alt="partner-logo" className={styles.logo} />
            <div className={styles.titleSection}>
              <h1 className={styles.mainTitle}>Войти через MBANK ID</h1>
              <p className={styles.subtitle}>Ticket KG</p>
            </div>
          </header>

          <section className={styles.actionSection}>
            <AuthButton onClick={handleMBankLogin}>Перейти в MBANK</AuthButton>
            <PrivacyText />
          </section>

          <footer className={styles.footerSection}>
            <img
              src="src/assets/icons/mbank-logo-2.svg"
              alt="mbank-logo"
              className={styles.footerLogo}
            />
          </footer>
        </div>
      </div>
    </main>
  );
};

export default StartMobile;
