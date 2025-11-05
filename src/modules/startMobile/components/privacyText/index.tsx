import { observer } from 'mobx-react-lite';

import { useStartStore } from 'Common/stores/rootStore.tsx';

import styles from './PrivacyText.module.css';

function PrivacyText() {
  const startService = useStartStore();
  const privacyPolicyUrl = startService.startInfo?.privacyPolicyUrl;
  const termOfServiceUrl = startService.startInfo?.termOfServiceUrl;

  return (
    <div className={styles.privacyContainer}>
      <p className={styles.privacyText}>
        Прежде чем начать работу с приложением &quot;Ticket&quot;, вы можете ознакомиться с его{' '}
        <a target="_blank" href={privacyPolicyUrl} className={styles.privacyLink} rel="noreferrer">
          политикой конфиденциальности
        </a>{' '}
        и{' '}
        <a target="_blank" href={termOfServiceUrl} className={styles.privacyLink} rel="noreferrer">
          условиями пользования.
        </a>
      </p>
    </div>
  );
}

export default observer(PrivacyText);
