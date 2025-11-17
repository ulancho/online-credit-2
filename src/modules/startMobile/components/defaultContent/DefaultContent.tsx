import Skeleton from 'react-loading-skeleton';

import { useTranslation } from 'Common/i18n';
import AuthButton from 'Modules/startMobile/components/authButton';
import PrivacyText from 'Modules/startMobile/components/privacyText';

import styles from './DefaultContent.module.scss';

interface DefaultContentProps {
  shouldShowSkeleton: boolean;
  onLogin: () => Promise<void> | void;
  isLoading: boolean;
}

const DefaultContent = ({ shouldShowSkeleton, onLogin, isLoading }: DefaultContentProps) => {
  const { t } = useTranslation();

  if (shouldShowSkeleton) {
    return (
      <section className={styles.actionSection}>
        <Skeleton height={56} borderRadius={12} className={styles.buttonSkeleton} />
        <div className={styles.privacySkeleton}>
          <Skeleton height={12} />
          <Skeleton height={12} />
          <Skeleton height={12} width="80%" />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.actionSection}>
      <AuthButton onClick={onLogin} isLoading={isLoading}>
        {t('startMobile.default.button')}
      </AuthButton>
      <PrivacyText />
    </section>
  );
};

export default DefaultContent;
