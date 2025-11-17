import confirmedIconUrl from 'Assets/icons/confirmed.svg';
import { useTranslation } from 'Common/i18n';

import styles from './ConfirmedStatus.module.scss';

export const ConfirmedStatus = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <img src={confirmedIconUrl} alt="confirmed" className={styles.icon} />
      <p className={styles.text}>{t('startDesktop.phone.status.confirmed.title')}</p>
    </div>
  );
};
