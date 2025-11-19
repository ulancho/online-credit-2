import { useTranslation } from 'Common/i18n';

import styles from './style.module.scss';

export const LeftSection = function () {
  const { t } = useTranslation();

  return (
    <section className={styles.leftSection}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t('errorDesktop.left.title')}</h1>
        <p className={styles.subtitle}>{t('errorDesktop.left.subtitle')}</p>
      </div>
    </section>
  );
};
