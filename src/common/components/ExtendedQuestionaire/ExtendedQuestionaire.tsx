import WalletImage from 'Assets/icons/coin_percent.png';

import styles from './ExtendedQuestionaire.module.scss';

const getExtendedQuestionnaireUrl = () => {
  const suffix = window.location.hostname === 'https://hub.mbank.kg' ? '' : '-dev';

  window.location.href = `https://api.mbank.kg/auth-partner${suffix}/credit-conveyer${suffix}/auth`;
};

const ExtendedQuestionaire = () => {
  return (
    <div className={styles.promoBanner}>
      <div className={styles.promoText}>
        <p className={styles.promoTitle}>Расширенная анкета</p>
        <p className={styles.promoDescription}>
          Предоставьте дополнительные данные для увеличения суммы займа
        </p>
        <button onClick={getExtendedQuestionnaireUrl} className={styles.promoButton}>
          Заполнить анкету
        </button>
      </div>
      <div className={styles.promoImageWrapper}>
        <img
          className={styles.promoImage}
          src={WalletImage}
          decoding="async"
          alt="Wallet illustration"
        />
      </div>
    </div>
  );
};

export default ExtendedQuestionaire;
