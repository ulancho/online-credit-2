import confirmedIconUrl from 'Assets/icons/confirmed.svg';
import { useTranslation } from 'Common/i18n';

import styles from './ConfirmedStatus.module.scss';

const ConfirmedStatus = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.confirmedContainer}>
      <h2 className={styles.mainTitle}>
        {t('startMobile.confirmed.title.line1')} <br /> {t('startMobile.confirmed.title.line2')}
      </h2>
      <p className={styles.subtitle}>{t('startMobile.confirmed.subtitle')}</p>
      <img src={confirmedIconUrl} alt="confirmed" className={styles.confirmedIcon} />
    </div>
  );
};

export default ConfirmedStatus;
