import deniedMobileIconUrl from 'Assets/icons/denied-mobile.svg';
import ReloadButton from 'Common/components/reloadButton';

import styles from './DeniedStatus.module.scss';

interface StatusDeniedProps {
  onReload: () => void;
}

const DeniedStatus = ({ onReload }: StatusDeniedProps) => {
  return (
    <div className={styles.deniedContainer}>
      <h2 className={styles.mainTitle}>Доступ отклонён</h2>
      <p className={styles.subtitle}>Если это было случайно — попробуйте войти снова.</p>
      <img src={deniedMobileIconUrl} alt="denied" className={styles.deniedLogo} />
      <ReloadButton onClick={onReload} className={styles.deniedBtn} />
    </div>
  );
};

export default DeniedStatus;
