import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { useLoanConditionsStore } from '@/common/stores/rootStore';
import { formatAmount } from '@/common/utils/formatAmount';
import { getMonthLabel } from '@/common/utils/months';
import PercentIcon from 'Assets/icons/badge_percent.svg?react';
import CalendarIcon from 'Assets/icons/calendar.svg?react';
import LoanInfoIcon from 'Assets/icons/loan_info_icon.svg?react';

import styles from '../LoanConditions.module.scss';

import type { ActiveRequests } from '../models/ActiveRequests';

interface LoanConditionsItemProps {
  group: LoanGroup;
}

type LoanGroup = 'online' | 'offline' | 'ref';

const LoanConditionsItem = ({ group }: LoanConditionsItemProps) => {
  const loanConditionsStore = useLoanConditionsStore();

  const { activeRequestsData } = loanConditionsStore;

  const navigate = useNavigate();

  const activeGroup: ActiveRequests = activeRequestsData
    ? activeRequestsData[group as keyof typeof activeRequestsData]
    : {};

  const proceedToNext = () =>
    navigate(`/loan-confirmation/${group}`, { state: { loanConditionsData: toJS(activeGroup) } });

  return (
    <div className={styles.detailsCard}>
      {/* Amount & badge */}
      <div className={styles.amountRow}>
        <span className={styles.amount}>{formatAmount(activeGroup?.amount)} сом</span>
        {group === 'online' ? (
          <span className={styles.onlineBadge}>Онлайн</span>
        ) : (
          <span className={styles.offlineBadge}>В филиале</span>
        )}
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
            <span className={styles.infoValue}>{getMonthLabel(Number(activeGroup?.period))}</span>
          </div>
        </div>
        {/* Процент */}
        <div className={styles.infoRow}>
          <div className={styles.infoIcon}>
            <PercentIcon />
          </div>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>Процент</span>
            <span className={styles.infoValue}>{activeGroup?.percent} %</span>
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
              {formatAmount(activeGroup?.monthlyPayment)} {'\u20C0'}
            </span>
          </div>
        </div>
      </div>
      {group === 'online' && (
        <button onClick={proceedToNext} className={styles.primaryButton}>
          Получить сейчас
        </button>
      )}
      {group === 'offline' && (
        <button onClick={proceedToNext} className={styles.secondaryButton}>
          Получить в отделении
        </button>
      )}
      {group === 'ref' && (
        <button onClick={proceedToNext} className={styles.secondaryButton}>
          Рефинансировать
        </button>
      )}
    </div>
  );
};

export default observer(LoanConditionsItem);
