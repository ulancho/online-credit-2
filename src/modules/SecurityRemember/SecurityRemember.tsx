import { useNavigate } from 'react-router-dom';

import { useTranslation } from '@/common/i18n';
import SecurityShieldImage from 'Assets/images/security_shield.png';

import styles from './SecurityRemember.module.scss';

export default function SecurityRemember() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Назад">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.74023 11.9492C5.74023 12.2812 5.86719 12.5645 6.13086 12.8184L13.748 20.2695C13.9531 20.4844 14.2266 20.5918 14.5391 20.5918C15.1738 20.5918 15.6719 20.1035 15.6719 19.459C15.6719 19.1465 15.5449 18.8633 15.3301 18.6484L8.46484 11.9492L15.3301 5.25C15.5449 5.02539 15.6719 4.74219 15.6719 4.42969C15.6719 3.79492 15.1738 3.30664 14.5391 3.30664C14.2266 3.30664 13.9531 3.41406 13.748 3.62891L6.13086 11.0801C5.86719 11.334 5.75 11.6172 5.74023 11.9492Z"
              fill="white"
            />
          </svg>
        </button>
      </header>
      <main className={styles.content}>
        <section className={styles.section}>
          <h1 className={styles.title}>{t('securityRemember.title')}</h1>
          <ul className={styles.bulletList}>
            <li>{t('securityRemember.sectionFirstOption')}</li>
            <li>{t('securityRemember.sectionSecondOption')}</li>
            <li>{t('securityRemember.sectionThirdOption')}</li>
            <li>{t('securityRemember.sectionFourthOption')}</li>
            <li>{t('securityRemember.sectionFifthOption')}</li>
          </ul>
          <p className={styles.accentText}>{t('securityRemember.desc')}</p>
        </section>
        <div className={styles.shieldImageWrapper}>
          <img className={styles.shieldImage} src={SecurityShieldImage} alt="Security shield" />
        </div>
      </main>
      <div className={styles.bottomBar}>
        <button className={styles.continueBtn} onClick={() => navigate('/data-fill')}>
          {t('btns.continue')}
        </button>
      </div>
    </div>
  );
}
