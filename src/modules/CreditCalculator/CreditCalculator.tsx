import { useState } from 'react';

import InputField from 'Common/components/InputField/InputField.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';
import { useTranslation } from 'Common/i18n';
import ActivityTypeSelect from 'Modules/CreditCalculator/components/ActivityTypeSelect/ActivityTypeSelect.tsx';
import InfoNotification from 'Modules/CreditCalculator/components/InfoNotification/InfoNotification.tsx';
import InsuranceToggle from 'Modules/CreditCalculator/components/InsuranceToggle/InsuranceToggle.tsx';
import LoanSummary from 'Modules/CreditCalculator/components/LoanSummary/LoanSummary.tsx';
import LoanTermSlider from 'Modules/CreditCalculator/components/LoanTermSlider/LoanTermSlider.tsx';
import PassportModal from 'Modules/CreditCalculator/components/PassportModal/PassportModal.tsx';
import TermsCheckbox from 'Modules/CreditCalculator/components/TermsCheckbox/TermsCheckbox.tsx';

import styles from './CreditCalculator.module.scss';

export default function CreditCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState(3);
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [activityType, setActivityType] = useState('');
  const [insuranceEnabled, setInsuranceEnabled] = useState(true);
  const [term1Checked, setTerm1Checked] = useState(false);
  const [term2Checked, setTerm2Checked] = useState(false);
  const [term3Checked, setTerm3Checked] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(true);

  const allTermsAccepted = term1Checked && term2Checked && term3Checked;
  const isSubmitEnabled = allTermsAccepted && loanAmount !== '' && monthlyIncome !== '';

  const { t } = useTranslation();

  return (
    <div id="page">
      <NavBar />
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{t('credit-calculator.title')}</h1>
            <p className={styles.description}>{t('credit-calculator.description')}</p>
          </div>
        </div>
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
        <div className={styles.notificationSection}>
          <InfoNotification text="После вашего действия будет создана заявка на кредит. Мы отправим вам одноразовый код для проверки номера телефона." />
        </div>
        <div className={styles.termsSection}>
          <TermsCheckbox checked={term1Checked} onChange={setTerm1Checked}>
            Я ознакомлен(а) и согласен(на) с условиями оферты
          </TermsCheckbox>
          <TermsCheckbox checked={term2Checked} onChange={setTerm2Checked}>
            Я ознакомлен(а) и согласен(на) с условиями на обработку и передачу персональных данных
          </TermsCheckbox>
          <TermsCheckbox checked={term3Checked} onChange={setTerm3Checked}>
            Я ознакомлен(на) <span className={styles.termLink}>с листком ключевых данных</span>
          </TermsCheckbox>
        </div>
      </div>
      <div className={styles.submitSection}>
        <button
          className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitButtonActive : styles.submitButtonDisabled}`}
          disabled={!isSubmitEnabled}
        >
          Отправить заявку
        </button>
      </div>
      {isPassportModalOpen && (
        <PassportModal
          onCancel={() => setIsPassportModalOpen(false)}
          onContinue={() => setIsPassportModalOpen(false)}
        />
      )}
    </div>
  );
}
