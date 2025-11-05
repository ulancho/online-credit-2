import confirmedIconUrl from 'Assets/icons/confirmed.svg';

import styles from './ConfirmedStatus.module.scss';

const ConfirmedStatus = () => {
  return (
    <div className={styles.confirmedContainer}>
      <h2 className={styles.mainTitle}>
        Вы успешно вошли через <br /> MBank ID
      </h2>
      <p className={styles.subtitle}>Сейчас перенаправим вас в сервис..</p>
      <img src={confirmedIconUrl} alt="confirmed" className={styles.confirmedIcon} />
    </div>
  );
};

export default ConfirmedStatus;
