import styles from './ExpiredStatus.module.scss';

export const ExpiredStatus = () => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>QR-код устарел</p>
      <p className={styles.description}>Обновите страницу и попробуйте снова.</p>
    </div>
  );
};
