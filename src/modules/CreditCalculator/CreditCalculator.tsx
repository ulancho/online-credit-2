import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useCreditCalculatorStore } from '@/common/stores/rootStore';
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

const CreditCalculator = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm();

  const creditCalculatorStore = useCreditCalculatorStore();

  const [loanAmount, setLoanAmount] = useState('');
  // const [loanTerm, setLoanTerm] = useState(3);
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

  const loanTerm = watch('loanTerm');
  const terms = creditCalculatorStore.availableLoanTerms;
  console.log(loanTerm);

  const onSubmit = () => {
    // console.log(data, 'data');
  };

  useEffect(() => {
    const loadFieldsData = async () => {
      await creditCalculatorStore.getCreditRates();
    };

    loadFieldsData();
  }, []);

  useEffect(() => {
    if (terms.length) {
      setValue('loanTerm', terms[0]);
    }
  }, [terms]);

  return (
    <div id="page">
      <NavBar />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.content}>
          <div className={styles.headerSection}>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>{t('credit-calculator.title')}</h1>
              <p className={styles.description}>{t('credit-calculator.description')}</p>
            </div>
          </div>
          <div className={styles.fieldsSection}>
            <Controller
              name="loanAmount"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  mainPlaceholder={t('credit-calculator.sum')}
                  secondaryPlaceholder={t('credit-calculator.to')}
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                />
              )}
            />
            <Controller
              name="loanTerm"
              control={control}
              render={({ field }) => {
                // индекс текущего значения
                const currentIndex = terms.findIndex((t) => t === Number(field.value));
                const safeIndex = currentIndex >= 0 ? currentIndex : 0;

                return (
                  <LoanTermSlider
                    value={safeIndex}
                    min={0}
                    max={terms.length - 1}
                    onChange={(index: number) => {
                      field.onChange(terms[index]); // сохраняем реальное значение
                    }}
                  />
                );
              }}
            />
            {/* <LoanTermSlider
              value={Math.max(
                0,
                terms.findIndex((t) => t === Number(loanTerm)),
              )}
              min={0}
              max={terms.length - 1}
              onChange={(i) => setValue('loanTerm', terms[i])}
            /> */}
            <Controller
              name="monthlyIncome"
              control={control}
              render={({ field }) => (
                <InputField
                  mainPlaceholder={t('credit-calculator.income')}
                  secondaryPlaceholder={''}
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                />
              )}
            />
            <Controller
              name="activityType"
              control={control}
              render={({ field }) => (
                <ActivityTypeSelect value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <Controller
            name="insuranceEnabled"
            control={control}
            render={({ field }) => (
              <div className={styles.insuranceSection}>
                <InsuranceToggle checked={field.value} onChange={field.onChange} />
              </div>
            )}
          />
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
          // className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitButtonActive : styles.submitButtonDisabled}`}
          // disabled={!isValid}
          >
            Отправить заявку
          </button>
        </div>
      </form>
      {isPassportModalOpen && (
        <PassportModal
          onCancel={() => setIsPassportModalOpen(false)}
          onContinue={() => setIsPassportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default observer(CreditCalculator);
