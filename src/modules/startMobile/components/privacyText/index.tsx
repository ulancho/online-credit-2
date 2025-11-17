import { observer } from 'mobx-react-lite';

import { useTranslation } from 'Common/i18n';
import { useStartStore } from 'Common/stores/rootStore.tsx';

import styles from './PrivacyText.module.css';

interface PrivacyTextProps {
  clientName: string;
}

function PrivacyText({ clientName }: PrivacyTextProps) {
  const { t } = useTranslation();
  const startService = useStartStore();
  const privacyPolicyUrl = startService.startInfo?.privacyPolicyUrl;
  const termOfServiceUrl = startService.startInfo?.termOfServiceUrl;

  return (
    <div className={styles.privacyContainer}>
      <p className={styles.privacyText}>
        {t('common.privacy.prefix', { value: clientName || '' })}{' '}
        <a target="_blank" href={privacyPolicyUrl} className={styles.privacyLink} rel="noreferrer">
          {t('common.privacy.privacyLink')}
        </a>{' '}
        {t('common.privacy.connector')}{' '}
        <a target="_blank" href={termOfServiceUrl} className={styles.privacyLink} rel="noreferrer">
          {t('common.privacy.termsLink')}
        </a>{' '}
        {t('common.privacy.end')}
      </p>
    </div>
  );
}

export default observer(PrivacyText);
