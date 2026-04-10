import { useTranslation } from '@/common/i18n';
import WalletImage from 'Assets/icons/coin_percent.png';
import { appEnv } from 'Common/config/env.ts';

import styles from './ExtendedQuestionaire.module.scss';

const getExtendedQuestionnaireUrl = (appToken: string) => {
  window.location.href = appEnv.extendedQuestionnaireUrl(appToken);
};

const ExtendedQuestionaire = ({ appToken }: { appToken: string }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.promoBanner}>
      <div className={styles.promoText}>
        <p className={styles.promoTitle}>{t('loanConditions.extendedApplication.title')}</p>
        <p className={styles.promoDescription}>{t('loanConditions.extendedApplication.desc')}</p>
        <button
          onClick={() => getExtendedQuestionnaireUrl(appToken)}
          className={styles.promoButton}
        >
          {t('loanConditions.extendedApplication.fill')}
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
