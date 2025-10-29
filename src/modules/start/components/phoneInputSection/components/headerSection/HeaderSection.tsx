import styles from './HeaderSection.module.scss';

type Props = {
  logoUrl?: string | null;
  clientName?: string | null;
};

export function HeaderSection({ logoUrl, clientName }: Props) {
  return (
    <header className={styles.headerSection}>
      {logoUrl && <img src={logoUrl} alt="partner-logo" className={styles.logoImage} />}
      <div className={styles.titleSection}>
        <h1 className={styles.mainTitle}>Войти через MBANK ID</h1>
        <p className={styles.subtitle}>{clientName}</p>
      </div>
    </header>
  );
}
