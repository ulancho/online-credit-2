import styles from './style.module.css';

interface AuthButtonProps {
  onClick?: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}

function AuthButton({ onClick, isLoading, children }: AuthButtonProps) {
  return (
    <button className={styles.authButton} onClick={onClick}>
      {isLoading ? (
        <div className="btn-loader"></div>
      ) : (
        <>
          <img src="/src/assets/icons/mbank-logo-3.svg" alt="mbank-logo" />
          <span className={styles.buttonLabel}>{children}</span>
        </>
      )}
    </button>
  );
}

export default AuthButton;
