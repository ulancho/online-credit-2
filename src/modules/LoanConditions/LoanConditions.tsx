import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLoanConditionsStore } from '@/common/stores/rootStore';
import { formatMMSS } from '@/common/utils/time';
import WalletImage from 'Assets/icons/coin_percent.png';
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import LoanConditionsItem from './components/LoanConditionsItem';
import { Modal } from './components/Modal';
import styles from './LoanConditions.module.scss';

const LoanConditions = () => {
  const loanConditionsStore = useLoanConditionsStore();
  const { activeRequests, extendedIsAvailable, onlineClaimAvailable, offlineClaimAvailable } =
    loanConditionsStore;

  const navigate = useNavigate();

  const [active, setActive] = useState<boolean | null>(null);

  const open = (val: boolean) => setActive(val);
  const close = () => setActive(null);

  useEffect(() => {
    const loadData = async () => {
      loanConditionsStore.getActiveRequests();
    };

    loadData();
  }, [loanConditionsStore]);

  const proceedToDeclinedPage = async () => {
    const success = await loanConditionsStore.setDeclineApplication(activeRequests?.applicationId);

    if (success) {
      navigate('/application-decline', {
        state: {
          title: 'Вы отказались от кредита',
          description: `Повторная заявка будет доступна ${formatMMSS(success.tokenlifeTime)}`,
        },
      });
    }
  };

  return (
    <div id="page">
      <NavBar />
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>Ваша заявка одобрена на следующих условиях</h1>
        {/* Blue promo banner */}
        {extendedIsAvailable && (
          <div className={styles.promoBanner}>
            <div className={styles.promoText}>
              <p className={styles.promoTitle}>Расширенная анкета</p>
              <p className={styles.promoDescription}>
                Предоставьте дополнительные данные для увеличения суммы займа
              </p>
              <button className={styles.promoButton}>Заполнить анкету</button>
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
        )}
        {/* Loan details card */}
        {onlineClaimAvailable && <LoanConditionsItem group="online" />}

        {offlineClaimAvailable && <LoanConditionsItem group="offline" />}

        {activeRequests?.refAmount > 0 && <LoanConditionsItem group="ref" />}
        <button onClick={() => open(true)} className={styles.declineButton}>
          Отказаться
        </button>

        <Modal
          isOpen={active}
          onClose={close}
          title="Подтвердите действие"
          size="sm"
          footer={
            <>
              <button className="btn btn-text-green" onClick={close}>
                Нет
              </button>
              <button className="btn btn-text-green" onClick={proceedToDeclinedPage}>
                Да
              </button>
            </>
          }
        >
          Вы уверены, что хотите отказаться от выдачи кредита?
        </Modal>
      </div>
    </div>
  );
};

export default observer(LoanConditions);
