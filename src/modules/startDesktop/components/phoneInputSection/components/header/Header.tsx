import { useTranslation } from 'Common/i18n';

import styles from './Header.module.scss';

type Props = {
  logoUrl?: string | null;
  clientName?: string | null;
};

export function Header({ logoUrl, clientName }: Props) {
  const { t } = useTranslation();

  return (
    <header className={styles.headerSection}>
      {logoUrl && <img src={logoUrl} alt="partner-logo" className={styles.logoImage} />}
      <div className={styles.titleSection}>
        <h1 className={styles.mainTitle}>{t('startDesktop.phone.header.title')}</h1>
        <p className={styles.subtitle}>{clientName}</p>
      </div>
    </header>
  );
}
