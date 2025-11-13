import sadIconUrl from 'Assets/icons/sad.svg';
import BackButton from 'Common/components/backButton';
import { useTranslation } from 'Common/i18n';

import styles from './ExpiredStatus.module.scss';

type Props = {
  onBack: () => void;
};

export function ExpiredStatus({ onBack }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <img src={sadIconUrl} alt="expired" className={styles.icon} />
      <p className={styles.title}>{t('startDesktop.phone.status.expired.title')}</p>
      <p className={styles.subtitle}>{t('startDesktop.phone.status.expired.subtitle')}</p>
      <BackButton type="button" onClick={onBack} />
    </div>
  );
}
