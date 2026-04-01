import { useQueryParams } from '@/common/hooks/useQueryParams';
import SadIconDark from 'Assets/icons/sad-circle-dark.svg?react';
import SadIcon from 'Assets/icons/sad-circle.svg?react';

import styles from './ServiceUnavailable.module.scss';


export default function ServiceUnavailable() {
  const { theme } = useQueryParams();

  const icon = theme === 'dark' ? <SadIconDark /> : <SadIcon />;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>{icon}</div>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Услуга недоступна</h1>
          <p className={styles.description}>Пожалуйста, попробуйте позже</p>
        </div>
      </div>
      <div className={styles.buttonSection}>
        <button className={styles.continueButton}>На главную</button>
      </div>
    </div>
  );
}
