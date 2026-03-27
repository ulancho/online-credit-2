import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useInsuranceCompaniesStore } from '@/common/stores/rootStore';
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import styles from './InsuranceCompanies.module.scss';

import type { InsuranceCompaniesItem } from './models/InsuranceCompanies';

const InsuranceCompanies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromState = (location.state as { from?: string }) ?? {};

  const handleSelect = (insurance: InsuranceCompaniesItem) => {
    navigate(fromState.from ?? '/loan-confirmation', {
      state: { insurance: JSON.stringify(insurance) },
    });
  };
  const insuranceCompaniesStore = useInsuranceCompaniesStore();

  useEffect(() => {
    const loadData = async () => {
      insuranceCompaniesStore.getInsuranceCompaniesItems();
    };

    loadData();
  }, [insuranceCompaniesStore]);

  return (
    <div id="page" className={styles.page}>
      <NavBar onBack={() => navigate(-1)} />
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
          {insuranceCompaniesStore.availableInsuranceCompaniesItems.map((company, index) => (
            <button
              key={company.name}
              className={`${styles.companyRow} ${index < insuranceCompaniesStore.availableInsuranceCompaniesItems.length - 1 ? styles.companyRowDivider : ''}`}
              onClick={() => handleSelect(company)}
            >
              <div className={styles.companyInfo}>
                <span className={styles.companyName}>{company.name}</span>
                <span className={styles.companyRate}>{company.insurePrc}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default observer(InsuranceCompanies);
