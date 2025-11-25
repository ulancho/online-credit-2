import rotateIconUrl from 'Assets/icons/rotate-phone.svg';
import { useIsPortraitOrientation } from 'Common/hooks/useIsPortraitOrientation.ts';
import { useTranslation } from 'Common/i18n';

import styles from './OrientationNotice.module.scss';

const OrientationNotice = () => {
  const { t } = useTranslation();
  const isPortrait = useIsPortraitOrientation();

  if (isPortrait) {
    return null;
  }

  return (
    <div className={styles.overlay} role="alert" aria-live="assertive">
      <div className={styles.card}>
        <img src={rotateIconUrl} alt={t('common.orientation.iconAlt')} className={styles.icon} />
        <h2 className={styles.title}>{t('common.orientation.title')}</h2>
        <p className={styles.description}>{t('common.orientation.description')}</p>
      </div>
    </div>
  );
};

export default OrientationNotice;
