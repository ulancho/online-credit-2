import { useNavigate } from 'react-router-dom';

import { useTranslation } from '@/common/i18n';
import CloseIcon from 'Assets/icons/close.svg?react';
import ClockImage from 'Assets/images/clock.png';

import styles from './CoolingPeriod.module.scss';

export default function CoolingPeriod() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <button
          className={styles.closeBtn}
          onClick={() => navigate('/loan-conditions')}
          aria-label="Закрыть"
        >
          <CloseIcon />
        </button>
      </header>
      <main className={styles.content}>
        <section className={styles.section}>
          <h1 className={styles.title}>{t('coolingPeriod.title')}</h1>
          <p className={styles.bodyText}>{t('coolingPeriod.desc')}</p>
          <div className={styles.periodInfo}>
            <p className={styles.periodTitle}>{t('coolingPeriod.periodTitle')}</p>
            <ul className={styles.bulletList}>
              <li>{t('coolingPeriod.periodFirstOption')}</li>
              <li>{t('coolingPeriod.periodSecondOption')}</li>
            </ul>
          </div>
        </section>
        <div className={styles.clockImageWrapper}>
          <img className={styles.clockImage} src={ClockImage} alt="Cooling period clock" />
        </div>
      </main>
      <div className={styles.bottomBar}>
        <button
          className={styles.continueBtn}
          onClick={() => navigate('/security-warning', { state: { type: 'online' } })}
        >
          {t('btns.continue')}
        </button>
      </div>
    </div>
  );
}
