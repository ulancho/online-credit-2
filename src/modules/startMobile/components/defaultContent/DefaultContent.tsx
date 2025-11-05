import Skeleton from 'react-loading-skeleton';

import AuthButton from 'Modules/startMobile/components/authButton';
import PrivacyText from 'Modules/startMobile/components/privacyText';

import styles from './DefaultContent.module.scss';

interface DefaultContentProps {
  shouldShowSkeleton: boolean;
  onLogin: () => Promise<void> | void;
  isLoading: boolean;
}

const DefaultContent = ({ shouldShowSkeleton, onLogin, isLoading }: DefaultContentProps) => {
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
        Перейти в MBANK
      </AuthButton>
      <PrivacyText />
    </section>
  );
};

export default DefaultContent;
