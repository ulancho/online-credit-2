import PercentIcon from 'Assets/icons/badge_percent.svg?react';
import CalendarIcon from 'Assets/icons/calendar.svg?react';
import LoanInfoIcon from 'Assets/icons/loan_info_icon.svg?react';
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import styles from './LoanConditions.module.scss';

export default function LoanConditions() {
  return (
    <div id="page">
      <NavBar />
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>Ваша заявка одобрена на следующих условиях</h1>
        {/* Blue promo banner */}
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
              src="src/assets/icons/coin_percent.png"
              alt="Wallet illustration"
            />
          </div>
        </div>
        {/* Loan details card */}
        <div className={styles.detailsCard}>
          {/* Amount & badge */}
          <div className={styles.amountRow}>
            <span className={styles.amount}>50 000 сом</span>
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
                <span className={styles.infoValue}>Бессрочно</span>
              </div>
            </div>
            {/* Процент */}
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <PercentIcon />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Процент</span>
                <span className={styles.infoValue}>25,99 %</span>
              </div>
            </div>
            {/* Ежемесячный взнос */}
            <div className={`${styles.infoRow} ${styles.infoRowLast}`}>
              <div className={styles.infoIcon}>
                <LoanInfoIcon />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Ежемесячный взнос</span>
                <span className={styles.infoValue}>12 340 {'\u20C0'}</span>
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
}
