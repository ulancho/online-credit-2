import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { exitApp } from '@/common/api/common';
import ExtendedQuestionaire from '@/common/components/ExtendedQuestionaire/ExtendedQuestionaire';
import ConfirmationModal from '@/common/components/Modal/ConfirmationModal';
import { useTranslation } from '@/common/i18n';
import { useLoanConditionsStore } from '@/common/stores/rootStore';
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import LoanConditionsItem from './components/LoanConditionsItem';
import styles from './LoanConditions.module.scss';

const LoanConditions = () => {
  const loanConditionsStore = useLoanConditionsStore();
  const { activeRequests, extendedIsAvailable, onlineClaimAvailable, offlineClaimAvailable } =
    loanConditionsStore;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [active, setActive] = useState<boolean | null>(null);

  const open = (val: boolean) => setActive(val);

  useEffect(() => {
    const loadData = async () => {
      loanConditionsStore.getActiveRequests();
    };

    loadData();
  }, [loanConditionsStore]);

  const proceedToDeclinedPage = async () => {
    const success = await loanConditionsStore.setDeclineApplication(activeRequests?.applicationId);

    if (success) {
      navigate('/finish-page', {
        state: {
          title: t('common.declinedTheLoan'),
          description: t('common.successfullyRejected'),
        },
        replace: true,
      });
    }
  };

  const closeWebView = () => {
    exitApp().then((res) => console.log(res.status));
  };

  return (
    <div id="page">
      <NavBar onBack={closeWebView} />
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>{t('loanConditions.title')}</h1>
        {/* Blue promo banner */}
        {extendedIsAvailable && <ExtendedQuestionaire />}
        {/* Loan details card */}
        {onlineClaimAvailable && <LoanConditionsItem group="online" />}

        {offlineClaimAvailable && <LoanConditionsItem group="offline" />}

        {activeRequests?.refAmount > 0 && <LoanConditionsItem group="ref" />}
        <button onClick={() => open(true)} className={styles.declineButton}>
          {t('btns.decline')}
        </button>

        <ConfirmationModal submit={proceedToDeclinedPage} active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default observer(LoanConditions);
