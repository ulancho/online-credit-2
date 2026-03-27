import { useNavigate } from 'react-router-dom';

import CloseIcon from 'Assets/icons/close.svg?react';
import ClockImage from 'Assets/images/clock.png';

import styles from './CoolingPeriod.module.scss';

export default function CoolingPeriod() {
  const navigate = useNavigate();

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
          <h1 className={styles.title}>Внимание!</h1>
          <p className={styles.bodyText}>
            Для вашего удобства и безопасности, при оформлении онлайн кредита предусмотрен период
            охлаждения, в течение которого кредитные средства не будут сразу зачислены на ваш счет.
            Это позволит вам при необходимости отказаться от кредита
          </p>
          <div className={styles.periodInfo}>
            <p className={styles.periodTitle}>Период охлаждения зависит от суммы кредита:</p>
            <ul className={styles.bulletList}>
              <li>для кредитов от 50 001 сома до 100 000 сомов – 4 часа</li>
              <li>для кредитов от 100 001 сома – 12 часов</li>
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
          Продолжить
        </button>
      </div>
    </div>
  );
}
