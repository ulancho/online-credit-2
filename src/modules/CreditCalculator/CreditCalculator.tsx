import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  useActivityTypeStore,
  useCreditRatesStore,
  useLoanOffersStore,
} from '@/common/stores/rootStore';
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
import {
  useLoanCalculatorService,
  type RateCategory,
  type RateInsuranceOption,
} from 'Modules/CreditCalculator/services/LoanCalculatorService.ts';

import styles from './CreditCalculator.module.scss';

const DEFAULT_LOAN_AMOUNT = '';
const EMPLOYEE_ACTIVITY_TYPE_KEY = 'credit-calculator.activityTypes.employee';

const formatCurrency = (value: number) => new Intl.NumberFormat('ru-RU').format(value);

type CreditCalculatorFormValues = {
  loanAmount: string;
  loanTerm?: number;
  monthlyIncome: string;
  activityType: string;
  insuranceEnabled: boolean;
};

const CreditCalculator = () => {
  const { control, handleSubmit, getValues, watch } = useForm<CreditCalculatorFormValues>({
    defaultValues: {
      loanAmount: DEFAULT_LOAN_AMOUNT,
      loanTerm: undefined,
      monthlyIncome: '',
      activityType: '',
      insuranceEnabled: false,
    },
  });

  const creditRatesService = useCreditRatesStore();
  const activityTypeService = useActivityTypeStore();
  const loanCalculatorService = useLoanCalculatorService();
  const loanOffersService = useLoanOffersStore();
  const navigate = useNavigate();

  const [term1Checked, setTerm1Checked] = useState(false);
  const [term2Checked, setTerm2Checked] = useState(false);
  const [term3Checked, setTerm3Checked] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(true);

  const allTermsAccepted = term1Checked && term2Checked && term3Checked;
  const isSubmitEnabled =
    allTermsAccepted && getValues('loanAmount') !== '' && getValues('monthlyIncome') !== '';
  console.log(isSubmitEnabled);

  const { t } = useTranslation();

  const terms = creditRatesService.availableLoanTerms;
  const loanAmount = watch('loanAmount');
  const loanTerm = watch('loanTerm');
  const activityType = watch('activityType');
  const insuranceEnabled = watch('insuranceEnabled');

  //вот здесь меняем на клиент или сотрудник
  const selectedRateCategory: RateCategory =
    activityType === t(EMPLOYEE_ACTIVITY_TYPE_KEY) ? 'employee' : 'client';
  const selectedInsuranceOption: RateInsuranceOption = insuranceEnabled
    ? 'withInsurance'
    : 'withoutInsurance';

  const loanSummary = useMemo(() => {
    const amount = Number(loanAmount) || 0;
    const month = Number(loanTerm) || terms[0] || 0;
    const oppositeInsuranceOption: RateInsuranceOption = insuranceEnabled
      ? 'withoutInsurance'
      : 'withInsurance';

    const calculatedLoan = loanCalculatorService.calculateLoan({
      amount,
      month,
      category: selectedRateCategory,
      insuranceOption: selectedInsuranceOption,
    });

    const oppositeRate = loanCalculatorService.resolvePercent({
      category: selectedRateCategory,
      insuranceOption: oppositeInsuranceOption,
    });

    return {
      monthlyPayment: calculatedLoan ? formatCurrency(calculatedLoan.monthlyPayment) : '0',
      discountedRate: calculatedLoan ? `${calculatedLoan.percent.toFixed(2)}%` : '0%',
      originalRate: oppositeRate !== null ? `${oppositeRate.toFixed(2)}%` : '0%',
      overpayment: calculatedLoan ? formatCurrency(calculatedLoan.overpayment) : '0',
    };
  }, [
    insuranceEnabled,
    loanAmount,
    loanCalculatorService,
    loanTerm,
    selectedInsuranceOption,
    selectedRateCategory,
    terms,
  ]);

  const onSubmit = () => {};

  const handleContinuePassport = () => {
    setIsPassportModalOpen(false);
    navigate('/passport');
  };

  useEffect(() => {
    const loadFieldsData = async () => {
      await Promise.all([
        creditRatesService.getCreditRates(),
        activityTypeService.getActivityTypes(),
        loanOffersService.getPublicLoanOffer(),
        loanOffersService.getLoanOffer(),
      ]);
    };

    loadFieldsData();
  }, [creditRatesService]);

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
                const currentIndex = terms.findIndex((term) => term === Number(field.value));
                const safeIndex = currentIndex >= 0 ? currentIndex : 0;

                return (
                  <LoanTermSlider
                    label={terms[safeIndex]}
                    value={safeIndex}
                    min={0}
                    max={terms.length - 1}
                    onChange={(index: number) => {
                      field.onChange(terms[index]);
                    }}
                  />
                );
              }}
            />
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
            monthlyPayment={loanSummary.monthlyPayment}
            originalRate={loanSummary.originalRate}
            discountedRate={loanSummary.discountedRate}
            overpayment={loanSummary.overpayment}
          />
          <div className={styles.notificationSection}>
            <InfoNotification text="После вашего действия будет создана заявка на кредит. Мы отправим вам одноразовый код для проверки номера телефона." />
          </div>
          <div className={styles.termsSection}>
            <TermsCheckbox
              checked={term1Checked}
              text={loanOffersService.publicLoanOfferData?.agreementText || ''}
              onChange={setTerm1Checked}
            />
            <TermsCheckbox
              checked={term2Checked}
              text={loanOffersService.loanOfferData?.agreementText || ''}
              onChange={setTerm2Checked}
            />
            <TermsCheckbox
              checked={term3Checked}
              text="Я ознакомлен(на) [с листком ключевых данных](sheet)"
              onChange={setTerm3Checked}
            />
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
      </form>
      {isPassportModalOpen && (
        <PassportModal
          onCancel={() => setIsPassportModalOpen(false)}
          onContinue={handleContinuePassport}
        />
      )}
    </div>
  );
};

export default observer(CreditCalculator);
