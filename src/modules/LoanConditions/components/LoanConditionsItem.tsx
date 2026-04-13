import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from '@/common/i18n';
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

const titles: Record<LoanGroup, string> = {
  online: 'loanConditions.itemOnlineTitle',
  offline: 'loanConditions.itemOfflineTitle',
  ref: 'loanConditions.itemRefTitle',
} as const;

const LoanConditionsItem = ({ group }: LoanConditionsItemProps) => {
  const loanConditionsStore = useLoanConditionsStore();
  const { t } = useTranslation();

  const { activeRequestsData } = loanConditionsStore;

  const navigate = useNavigate();

  const activeGroup: ActiveRequests = activeRequestsData
    ? activeRequestsData[group as keyof typeof activeRequestsData]
    : {};

  const proceedToNext = () =>
    navigate(`/loan-confirmation/${group}`, { state: { loanConditionsData: toJS(activeGroup) } });

  const subTitle = t(titles[group]);

  const status = group === 'ref' ? activeGroup?.refType : group;

  const statusBadge = (
    <span className={status === 'online' ? styles.onlineBadge : styles.offlineBadge}>
      {t(`loanConditions.${status}`)}
    </span>
  );

  return (
    <div className={styles.detailsCard}>
      {/* Amount & badge */}
      <div className={styles.amountRow}>
        <span className={styles.amount}>
          {formatAmount(activeGroup?.amount)} {t('common.som')}
        </span>
        {statusBadge}
      </div>
      <p className={styles.amountSubtitle}>{subTitle}</p>
      {/* Info rows */}
      <div className={styles.infoList}>
        {/* Срок */}
        <div className={styles.infoRow}>
          <div className={styles.infoIcon}>
            <CalendarIcon />
          </div>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>{t('loanConditions.term')}</span>
            <span className={styles.infoValue}>
              {getMonthLabel(Number(activeGroup?.period), t)}
            </span>
          </div>
        </div>
        {/* Процент */}
        <div className={styles.infoRow}>
          <div className={styles.infoIcon}>
            <PercentIcon />
          </div>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>{t('loanConditions.bid')}</span>
            <span className={styles.infoValue}>{activeGroup?.percent} %</span>
          </div>
        </div>
        {/* Ежемесячный взнос */}
        <div className={`${styles.infoRow} ${styles.infoRowLast}`}>
          <div className={styles.infoIcon}>
            <LoanInfoIcon />
          </div>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>{t('loanConditions.monthlyPayment')}</span>
            <span className={styles.infoValue}>{formatAmount(activeGroup?.monthlyPayment)} с</span>
          </div>
        </div>
      </div>
      {group === 'online' && (
        <button onClick={proceedToNext} className={styles.primaryButton}>
          {t('loanConditions.getNow')}
        </button>
      )}
      {group === 'offline' && (
        <button onClick={proceedToNext} className={styles.secondaryButton}>
          {t('loanConditions.getAtBranch')}
        </button>
      )}
      {group === 'ref' && (
        <button
          onClick={() => {
            window.location.href = `https://credit.mbank.kg/mbank/refinance?token=${activeGroup.token}`;
          }}
          className={styles.secondaryButton}
        >
          {t('loanConditions.refinance')}
        </button>
      )}
    </div>
  );
};

export default observer(LoanConditionsItem);
