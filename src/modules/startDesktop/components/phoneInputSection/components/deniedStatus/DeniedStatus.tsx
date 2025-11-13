import deniedIconUrl from 'Assets/icons/denied.svg';
import BackButton from 'Common/components/backButton';
import { useTranslation } from 'Common/i18n';

import styles from './DeniedStatus.module.scss';

type Props = {
  onBack: () => void;
};

export function DeniedStatus({ onBack }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <img src={deniedIconUrl} alt="denied" className={styles.icon} />
      <p className={styles.title}>{t('start.common.signInDenied')}</p>
      <p className={styles.subtitle}>{t('startDesktop.phone.status.denied.subtitle')}</p>
      <BackButton type="button" onClick={onBack} />
    </div>
  );
}
