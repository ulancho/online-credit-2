import { Loader } from 'Common/components/loader';
import { useTranslation } from 'Common/i18n';

import styles from './GeneratedStatus.module.scss';

const GeneratedStatus = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.generatedContainer}>
      <h2 className={styles.mainTitle}>{t('startMobile.generated.title')}</h2>
      <p className={styles.subtitle}>{t('startMobile.generated.subtitle')}</p>
      <Loader classes={styles.loader} />
    </div>
  );
};

export default GeneratedStatus;
