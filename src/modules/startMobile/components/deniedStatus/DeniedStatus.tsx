import deniedMobileIconUrl from 'Assets/icons/denied-mobile.svg';
import ReloadButton from 'Common/components/reloadButton';
import { useTranslation } from 'Common/i18n';

import styles from './DeniedStatus.module.scss';

interface StatusDeniedProps {
  onReload: () => void;
}

const DeniedStatus = ({ onReload }: StatusDeniedProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.deniedContainer}>
      <h2 className={styles.mainTitle}>{t('startMobile.denied.title')}</h2>
      <p className={styles.subtitle}>{t('startMobile.denied.subtitle')}</p>
      <img src={deniedMobileIconUrl} alt="denied" className={styles.deniedLogo} />
      <ReloadButton onClick={onReload} className={styles.deniedBtn} />
    </div>
  );
};

export default DeniedStatus;
