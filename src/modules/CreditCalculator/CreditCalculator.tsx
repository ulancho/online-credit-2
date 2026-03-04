// import InfoNotification from '../../components/InfoNotification/InfoNotification';
// import InputField from '../../components/InputField/InputField';
// import InsuranceToggle from '../../components/InsuranceToggle/InsuranceToggle';
// import LoanSummary from '../../components/LoanSummary/LoanSummary';
// import LoanTermSlider from '../../components/LoanTermSlider/LoanTermSlider';
// import TermsCheckbox from '../../components/TermsCheckbox/TermsCheckbox';
import { useState } from 'react';

import InputField from 'Common/components/InputField/InputField.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';
import { useTranslation } from 'Common/i18n';
import LoanTermSlider from 'Modules/CreditCalculator/components/LoanTermSlider/LoanTermSlider.tsx';

import styles from './CreditCalculator.module.scss';

export default function CreditCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState(3);
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [activityType, setActivityType] = useState('');

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
          <InputField
            mainPlaceholder={t('credit-calculator.activityType')}
            secondaryPlaceholder={''}
            value={activityType}
            onChange={setActivityType}
            hasChevron
          />
        </div>
      </div>
    </div>
  );
}
