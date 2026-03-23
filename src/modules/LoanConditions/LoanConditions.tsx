import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { useLoanConditionsStore } from '@/common/stores/rootStore';
import { formatAmount } from '@/common/utils/formatAmount';
import { getMonthLabel } from '@/common/utils/months';
import PercentIcon from 'Assets/icons/badge_percent.svg?react';
import CalendarIcon from 'Assets/icons/calendar.svg?react';
import WalletImage from 'Assets/icons/coin_percent.png';
import LoanInfoIcon from 'Assets/icons/loan_info_icon.svg?react';
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import styles from './LoanConditions.module.scss';


const LoanConditions = () => {
  const loanConditionsStore = useLoanConditionsStore();
  const { activeRequestsData, extendedIsAvailable, onlineClaimAvailable } = loanConditionsStore;

  const { onlineAmount, offlineAmount, period, percent, monthlyPayment } = activeRequestsData;

  useEffect(() => {
    const loadData = async () => {
      loanConditionsStore.getActiveRequests();
    };

    loadData();
  }, [loanConditionsStore]);

  console.log(loanConditionsStore);

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
        <div className={styles.detailsCard}>
          {/* Amount & badge */}
          <div className={styles.amountRow}>
            <span className={styles.amount}>
              {onlineClaimAvailable ? formatAmount(onlineAmount) : formatAmount(offlineAmount)} сом
            </span>
            <span className={styles.onlineBadge}>Онлайн</span>
          </div>
          <p className={styles.amountSubtitle}>Прямо сейчас на свой счет МБанк!</p>
          {/* Info rows */}
          <div className={styles.infoList}>
            {/* Срок */}
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <CalendarIcon />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Срок</span>
                <span className={styles.infoValue}>{getMonthLabel(Number(period))}</span>
              </div>
            </div>
            {/* Процент */}
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <PercentIcon />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Процент</span>
                <span className={styles.infoValue}>{percent} %</span>
              </div>
            </div>
            {/* Ежемесячный взнос */}
            <div className={`${styles.infoRow} ${styles.infoRowLast}`}>
              <div className={styles.infoIcon}>
                <LoanInfoIcon />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Ежемесячный взнос</span>
                <span className={styles.infoValue}>
                  {formatAmount(monthlyPayment)} {'\u20C0'}
                </span>
              </div>
            </div>
          </div>
          <button className={styles.primaryButton}>Получить сейчас</button>
        </div>
        {/* Decline button */}
        <button className={styles.declineButton}>Отказаться</button>
      </div>
    </div>
  );
};

export default observer(LoanConditions);
