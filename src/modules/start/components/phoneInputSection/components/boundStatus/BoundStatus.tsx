import BackButton from 'Common/components/backButton';
import { Loader } from 'Common/components/loader';

import styles from './BoundStatus.module.scss';

type Props = {
  timerLabel: string | null;
  onBack: () => void;
};

export function BoundStatus({ timerLabel, onBack }: Props) {
  return (
    <div className={styles.container}>
      <Loader classes={styles.loader} />
      <p className={styles.loaderText}>Ждем подтверждения входа</p>
      {timerLabel && (
        <div className={styles.timerSection}>
          <span className={styles.timerText}>{timerLabel}</span>
        </div>
      )}
      <div className={styles.actions}>
        <BackButton type="button" onClick={onBack} />
        <button type="button" className={styles.helpButton} onClick={onBack}>
          Я не получил(-а) уведомление
        </button>
      </div>
    </div>
  );
}
