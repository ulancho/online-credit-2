import sadIconUrl from 'Assets/icons/sad.svg';
import BackButton from 'Common/components/backButton';

import styles from './ExpiredStatus.module.scss';

type Props = {
  onBack: () => void;
};

export function ExpiredStatus({ onBack }: Props) {
  return (
    <div className={styles.container}>
      <img src={sadIconUrl} alt="expired" className={styles.icon} />
      <p className={styles.title}>Время истекло</p>
      <p className={styles.subtitle}>
        Разрешение не предоставлено вовремя, <br /> попробуйте еще раз
      </p>
      <BackButton type="button" onClick={onBack} />
    </div>
  );
}
