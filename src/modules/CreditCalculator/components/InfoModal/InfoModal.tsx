import InformationIcon from 'Assets/icons/information.svg?react';

import styles from './InfoModal.module.scss';

interface InfoModalProps {
  title: string;
  description?: string;
  onClose: () => void;
}

export default function InfoModal({ title, description, onClose }: InfoModalProps) {
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
