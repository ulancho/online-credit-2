import styles from './TermsCheckbox.module.css';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}

export default function TermsCheckbox({ checked, onChange, children }: TermsCheckboxProps) {
  return (
    <label className={styles.termRow}>
      <div className={styles.checkboxWrapper} onClick={() => onChange(!checked)}>
        <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
          {checked && (
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
              <path
                d="M1 4L4.5 7.5L11 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span className={styles.termText}>{children}</span>
    </label>
  );
}
