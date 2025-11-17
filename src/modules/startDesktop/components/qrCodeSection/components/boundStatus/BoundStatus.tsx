import { Loader } from 'Common/components/loader';
import { useTranslation } from 'Common/i18n';

import styles from './BoundStatus.module.scss';

export const BoundStatus = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Loader classes={styles.loader} />
      <p className={styles.text}>{t('start.common.awaitingLogin')}</p>
    </div>
  );
};
