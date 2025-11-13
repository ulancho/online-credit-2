import BackButton from 'Common/components/backButton';
import { Loader } from 'Common/components/loader';
import { useTranslation } from 'Common/i18n';

import styles from './BoundStatus.module.scss';

type Props = {
  timerLabel: string | null;
  onBack: () => void;
};

export function BoundStatus({ timerLabel, onBack }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Loader classes={styles.loader} />
      <p className={styles.loaderText}>{t('start.common.awaitingLogin')}</p>
      {timerLabel && (
        <div className={styles.timerSection}>
          <span className={styles.timerText}>
            {t('start.common.timerLabel', { value: timerLabel })}
          </span>
        </div>
      )}
      <div className={styles.actions}>
        <BackButton type="button" onClick={onBack} />
        <button type="button" className={styles.helpButton} onClick={onBack}>
          {t('start.common.noNotification')}
        </button>
      </div>
    </div>
  );
}
