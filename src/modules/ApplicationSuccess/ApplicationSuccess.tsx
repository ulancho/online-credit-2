import SuccessIcon from 'Assets/icons/success.svg?react';
import { exitApp } from 'Common/api/common.ts';
import Button from 'Common/components/Button/Button.tsx';

import styles from './ApplicationSuccess.module.scss';

export default function ApplicationSuccess() {
  const closeWebView = () => {
    exitApp().then((res) => console.log(res.status));
  };

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
        <Button className={styles.continueButton} onClick={closeWebView}>
          В кабинет кредитов
        </Button>
      </div>
    </div>
  );
}
