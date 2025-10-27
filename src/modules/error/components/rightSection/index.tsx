import errorIconUrl from 'Assets/icons/error.svg';
import mbankLogoUrl from 'Assets/icons/mbank-logo-2.svg';

import styles from './style.module.scss';

export const RightSection = function () {
  return (
    <section className={styles.rightSection}>
      <div className={styles.content}>
        <img src={errorIconUrl} alt="error icon" />
        <img src={mbankLogoUrl} alt="mbank logo" className={styles.logo} />
      </div>
    </section>
  );
};
