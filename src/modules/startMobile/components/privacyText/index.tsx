import styles from './PrivacyText.module.css';

function PrivacyText() {
  return (
    <div className={styles.privacyContainer}>
      <p className={styles.privacyText}>
        Прежде чем начать работу с приложением &quot;Ticket&quot;, вы можете ознакомиться с его{' '}
        <a className={styles.privacyLink}>политикой конфиденциальности</a> и{' '}
        <a className={styles.privacyLink}>условиями пользования.</a>
      </p>
    </div>
  );
}

export default PrivacyText;
