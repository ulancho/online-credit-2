import mbankLogoUrl from 'Assets/icons/mbank-logo-2.svg';

import styles from './Footer.module.scss';

export const Footer = () => {
  return <img src={mbankLogoUrl} alt="mbank" className={styles.logo} />;
};
