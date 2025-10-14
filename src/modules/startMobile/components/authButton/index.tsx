import styles from './style.module.css';

interface AuthButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

function AuthButton({ onClick, children }: AuthButtonProps) {
  return (
    <button className={styles.authButton} onClick={onClick}>
      <img src="src/assets/icons/mbank-logo-3.svg" alt="mbank-logo" />
      <span className={styles.buttonLabel}>{children}</span>
    </button>
  );
}

export default AuthButton;
