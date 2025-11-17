import Skeleton from 'react-loading-skeleton';

import { useTranslation } from 'Common/i18n';

import styles from './Header.module.scss';

interface HeaderProps {
  shouldShowSkeleton: boolean;
  logoUrl?: string;
  status?: string;
  clientName: string;
}

const Header = ({ shouldShowSkeleton, logoUrl, status, clientName }: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className={styles.headerSection}>
      {shouldShowSkeleton ? (
        <Skeleton circle height={80} width={80} containerClassName={styles.logoSkeleton} />
      ) : (
        logoUrl && <img src={logoUrl} alt="partner-logo" className={styles.logo} />
      )}
      {!status && (
        <div className={styles.titleSection}>
          <h1 className={styles.mainTitle}>{t('common.header.title')}</h1>
          {shouldShowSkeleton ? (
            <Skeleton height={22} width="60%" className={styles.subtitleSkeleton} />
          ) : (
            <p className={styles.subtitle}>{clientName}</p>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
