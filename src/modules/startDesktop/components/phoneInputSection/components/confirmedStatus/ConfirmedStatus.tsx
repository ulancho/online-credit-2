import confirmedIconUrl from 'Assets/icons/confirmed.svg';
import { useTranslation } from 'Common/i18n';

import styles from './ConfirmedStatus.module.scss';

type Props = {
  clientName?: string;
};

export function ConfirmedStatus({ clientName }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <img src={confirmedIconUrl} alt="confirmed" className={styles.icon} />
      <p className={styles.title}>{t('startDesktop.phone.status.confirmed.title')}</p>
      <p className={styles.subtitle}>
        {t('startDesktop.phone.status.confirmed.subtitle', { value: clientName || '' })}
      </p>
    </div>
  );
}
