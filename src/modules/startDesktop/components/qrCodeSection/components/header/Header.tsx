import { useTranslation } from 'Common/i18n';

import styles from './Header.module.scss';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>{t('startDesktop.qr.header.title')}</h2>
    </header>
  );
};
