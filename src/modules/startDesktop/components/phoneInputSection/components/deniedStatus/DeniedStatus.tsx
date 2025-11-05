import deniedIconUrl from 'Assets/icons/denied.svg';
import BackButton from 'Common/components/backButton';

import styles from './DeniedStatus.module.scss';

type Props = {
  onBack: () => void;
};

export function DeniedStatus({ onBack }: Props) {
  return (
    <div className={styles.container}>
      <img src={deniedIconUrl} alt="denied" className={styles.icon} />
      <p className={styles.title}>Вход отклонен</p>
      <p className={styles.subtitle}>
        Разрешение не было <br /> предоставлено, попробуйте еще раз
      </p>
      <BackButton type="button" onClick={onBack} />
    </div>
  );
}
