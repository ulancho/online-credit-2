import deniedIconUrl from 'Assets/icons/denied.svg';
import refreshIconUrl from 'Assets/icons/refresh.svg';

import styles from './DeniedStatus.module.scss';

export const DeniedStatus = () => {
  return (
    <div className={styles.container}>
      <img src={deniedIconUrl} alt="denied" className={styles.icon} />
      <p className={styles.title}>Вход отклонен</p>
      <button className={styles.refreshButton}>
        <img src={refreshIconUrl} alt="refresh" className={styles.refreshIcon} />
        <span className={styles.refreshText}>Попробовать еще раз</span>
      </button>
    </div>
  );
};
