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
  const shouldRenderTitleSection = !status;
  const shouldRenderLogo = Boolean(logoUrl);

  const renderLogo = () => {
    if (shouldShowSkeleton) {
      return <Skeleton circle height={80} width={80} containerClassName={styles.logoSkeleton} />;
    }

    if (shouldRenderLogo) {
      return <img src={logoUrl} alt="partner-logo" className={styles.logo} />;
    }

    return null;
  };

  const renderSubTitle = () => {
    if (shouldShowSkeleton) {
      return <Skeleton height={22} width="60%" className={styles.subtitleSkeleton} />;
    }

    return <p className={styles.subtitle}>{clientName}</p>;
  };

  return (
    <header className={styles.headerSection}>
      {renderLogo()}
      {shouldRenderTitleSection && (
        <div className={styles.titleSection}>
          <h1 className={styles.mainTitle}>{t('common.header.title')}</h1>
          {renderSubTitle()}
        </div>
      )}
    </header>
  );
};

export default Header;
