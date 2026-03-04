import { useState } from 'react';

import InputField from 'Common/components/InputField/InputField.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';
import { useTranslation } from 'Common/i18n';
import ActivityTypeSelect from 'Modules/CreditCalculator/components/ActivityTypeSelect/ActivityTypeSelect.tsx';
import InsuranceToggle from 'Modules/CreditCalculator/components/InsuranceToggle/InsuranceToggle.tsx';
import LoanSummary from 'Modules/CreditCalculator/components/LoanSummary/LoanSummary.tsx';
import LoanTermSlider from 'Modules/CreditCalculator/components/LoanTermSlider/LoanTermSlider.tsx';

import styles from './CreditCalculator.module.scss';

export default function CreditCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState(3);
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [activityType, setActivityType] = useState('');
  const [insuranceEnabled, setInsuranceEnabled] = useState(true);

  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <NavBar
        title={t('credit-calculator.title')}
        description={t('credit-calculator.description')}
      />
      <div className={styles.content}>
        <div className={styles.fieldsSection}>
          <InputField
            mainPlaceholder={t('credit-calculator.sum')}
            secondaryPlaceholder={t('credit-calculator.to')}
            value={loanAmount}
            onChange={setLoanAmount}
            type="number"
          />
          <LoanTermSlider value={loanTerm} min={3} max={60} onChange={setLoanTerm} />
          <InputField
            mainPlaceholder={t('credit-calculator.income')}
            secondaryPlaceholder={''}
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            type="number"
          />
          <ActivityTypeSelect value={activityType} onChange={setActivityType} />
        </div>
        <div className={styles.insuranceSection}>
          <InsuranceToggle checked={insuranceEnabled} onChange={setInsuranceEnabled} />
        </div>
        <LoanSummary
          monthlyPayment="5 262"
          originalRate="28.99%"
          discountedRate="25.99%"
          overpayment="7 262"
        />
      </div>
    </div>
  );
}
