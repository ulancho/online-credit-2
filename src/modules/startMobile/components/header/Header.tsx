import Skeleton from 'react-loading-skeleton';

import styles from './Header.module.scss';

interface HeaderSectionProps {
  shouldShowSkeleton: boolean;
  logoUrl?: string;
  status?: string;
  clientName: string;
}

const Header = ({ shouldShowSkeleton, logoUrl, status, clientName }: HeaderSectionProps) => {
  return (
    <header className={styles.headerSection}>
      {shouldShowSkeleton ? (
        <Skeleton circle height={80} width={80} containerClassName={styles.logoSkeleton} />
      ) : (
        logoUrl && <img src={logoUrl} alt="partner-logo" className={styles.logo} />
      )}
      {!status && (
        <div className={styles.titleSection}>
          <h1 className={styles.mainTitle}>Войти через MBANK ID</h1>
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
