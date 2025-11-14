import errorIconUrl from 'Assets/icons/error-mobile.svg';
import reloadIconUrl from 'Assets/icons/reload.svg';

import styles from './ErrorStatus.module.scss';

const ErrorStatus = () => {
  return (
    <div className={styles.container}>
      <header>
        <h2 className={styles.title}>Что-то пошло не так</h2>
        <p className={styles.subtitle}>Попробуйте ещё раз позже</p>
      </header>
      <div className={styles.errorIconContainer}>
        <img src={errorIconUrl} alt="error-icon" />
      </div>
      <div className={styles.action}>
        <button>
          <img src={reloadIconUrl} alt="reload-icon" />
          <span>Попробовать еще раз</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorStatus;
