import styles from './style.module.scss';

export const RightSection = function () {
  return (
    <section className={styles.rightSection}>
      <div className={styles.content}>
        <img src="src/assets/icons/error.svg" alt="error icon" />
        <img src="src/assets/icons/mbank-logo-2.svg" alt="mbank logo" className={styles.logo} />
      </div>
    </section>
  );
};
