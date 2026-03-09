import SuccessIcon from 'Assets/icons/success.svg?react';

import styles from './ApplicationSuccess.module.scss';

export default function ApplicationSuccess() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <SuccessIcon />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Заявка принята</h1>
          <p className={styles.description}>Следите обновления с решением вашей заявке</p>
        </div>
      </div>
      <div className={styles.buttonSection}>
        <button className={styles.continueButton}>В кабинет кредитов</button>
      </div>
    </div>
  );
}
