import InformationIcon from 'Assets/icons/information.svg?react';

import styles from './AccountNotAvailable.module.scss';

interface AccountNotAvailableProps {
  title: string;
  description: string;
  onClose: () => void;
}

export default function AccountNotAvailable({
  title,
  description,
  onClose,
}: AccountNotAvailableProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>
          <InformationIcon />
        </div>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
