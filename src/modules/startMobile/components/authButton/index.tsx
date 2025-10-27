import mbankLogoUrl from 'Assets/icons/mbank-logo-3.svg';

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
          <img src={mbankLogoUrl} alt="mbank-logo" />
          <span className={styles.buttonLabel}>{children}</span>
        </>
      )}
    </button>
  );
}

export default AuthButton;
