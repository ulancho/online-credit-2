import confirmedIconUrl from 'Assets/icons/confirmed.svg';

import styles from './ConfirmedStatus.module.scss';

export const ConfirmedStatus = () => {
  return (
    <div className={styles.container}>
      <img src={confirmedIconUrl} alt="confirmed" className={styles.icon} />
      <p className={styles.text}>Вход одобрен</p>
    </div>
  );
};
