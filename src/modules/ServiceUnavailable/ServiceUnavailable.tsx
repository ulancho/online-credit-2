import { useQueryParams } from '@/common/hooks/useQueryParams';
import { useTranslation } from '@/common/i18n';
import SadIconDark from 'Assets/icons/sad-circle-dark.svg?react';
import SadIcon from 'Assets/icons/sad-circle.svg?react';

import styles from './ServiceUnavailable.module.scss';

export default function ServiceUnavailable() {
  const { theme } = useQueryParams();
  const { t } = useTranslation();

  const icon = theme === 'dark' ? <SadIconDark /> : <SadIcon />;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>{icon}</div>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{t('serviceUnavailable.title')}</h1>
          <p className={styles.description}>{t('serviceUnavailable.desc')}</p>
        </div>
      </div>
      <div className={styles.buttonSection}>
        <button className={styles.continueButton}>{t('btns.goToHome')}</button>
      </div>
    </div>
  );
}
