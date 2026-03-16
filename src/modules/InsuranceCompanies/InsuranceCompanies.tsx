import { useNavigate, useLocation } from 'react-router-dom';

import NavBar from 'Common/components/NavBar/NavBar.tsx';

import styles from './InsuranceCompanies.module.scss';

const INSURANCE_COMPANIES = [
  { name: 'ЗАО "СК Арсенал-Кыргызстан"', rate: '0,5%' },
  { name: 'Название компании 2', rate: '0,3%' },
  { name: 'Название компании 3', rate: '0,3%' },
];

export default function InsuranceCompanies() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromState = (location.state as { from?: string }) ?? {};
  const handleSelect = (name: string) => {
    navigate(fromState.from ?? '/loan-confirmation', {
      state: { insurance: name },
    });
  };
  return (
    <div id="page" className={styles.page}>
      <NavBar />
      {/* Content */}
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <div className={styles.titleBlock}>
            <h1 className={styles.pageTitle}>Страховые компании</h1>
            <p className={styles.pageSubtitle}>
              Выберите подходящую страховку или оформите кредит без неё
            </p>
          </div>
        </div>
        <a href="#" className={styles.insuranceInfoLink}>
          Подробнее о страховании
        </a>
        <div className={styles.companiesList}>
          {INSURANCE_COMPANIES.map((company, index) => (
            <button
              key={company.name}
              className={`${styles.companyRow} ${index < INSURANCE_COMPANIES.length - 1 ? styles.companyRowDivider : ''}`}
              onClick={() => handleSelect(company.name)}
            >
              <div className={styles.companyInfo}>
                <span className={styles.companyName}>{company.name}</span>
                <span className={styles.companyRate}>{company.rate}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
