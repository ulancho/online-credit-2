import styles from './InsuranceToggle.module.css';

interface InsuranceToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function InsuranceToggle({ checked, onChange }: InsuranceToggleProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <p className={styles.title}>Хочу подключить страхование</p>
          <p className={styles.subtitle}>Снижает ставку и уменьшает ежемесячный платёж</p>
        </div>
        <button
          className={`${styles.toggle} ${checked ? styles.toggleOn : styles.toggleOff}`}
          onClick={() => onChange(!checked)}
          role="switch"
          aria-checked={checked}
          aria-label="Подключить страхование"
        >
          <span className={styles.thumb} />
        </button>
      </div>
    </div>
  );
}
