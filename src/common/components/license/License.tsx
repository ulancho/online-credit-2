import { useTranslation } from 'Common/i18n';

import styles from './License.module.scss';

const License = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <div className={styles.container}>
      <p>{t('common.licence', { currentYear: year })}</p>
    </div>
  );
};

export default License;
