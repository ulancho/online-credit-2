import { useTranslation } from '@/common/i18n';
import SuccessIcon from 'Assets/icons/success.svg?react';
import { exitApp } from 'Common/api/common.ts';
import Button from 'Common/components/Button/Button.tsx';

import styles from './ApplicationSuccess.module.scss';

export default function ApplicationSuccess() {
  const { t } = useTranslation();
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
          <h1 className={styles.title}>{t('applicationSuccess.title')}</h1>
          <p className={styles.description}>{t('applicationSuccess.desc')}</p>
        </div>
      </div>
      <div className={styles.buttonSection}>
        <Button className={styles.continueButton} onClick={closeWebView}>
          {t('common.creditCabinet')}
        </Button>
      </div>
    </div>
  );
}
