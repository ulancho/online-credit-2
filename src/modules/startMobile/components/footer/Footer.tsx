import mbankLogoUrl from 'Assets/icons/mbank-logo-2.svg';

import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footerSection}>
      <img src={mbankLogoUrl} alt="mbank-logo" className={styles.footerLogo} />
    </footer>
  );
};

export default Footer;
