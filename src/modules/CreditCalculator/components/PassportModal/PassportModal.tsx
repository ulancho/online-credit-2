import styles from './PassportModal.module.scss';

interface PassportModalProps {
  onCancel: () => void;
  onContinue: () => void;
}
export default function PassportModal({ onCancel, onContinue }: PassportModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.body}>
          <h2 className={styles.title}>Паспорт неактуален</h2>
          <p className={styles.description}>Необходимо отсканировать паспорт</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Отменить
          </button>
          <div className={styles.actionsDivider} />
          <button className={styles.continueButton} onClick={onContinue}>
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
}
