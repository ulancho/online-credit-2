import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>
        Наведите QR-сканер <br /> из приложения MBANK
      </h2>
    </header>
  );
};
