import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  useActivityTypeStore,
  useCreditApplicationStore,
  useCreditRatesStore,
  useLoanOffersStore,
} from '@/common/stores/rootStore';
import InputField from 'Common/components/InputField/InputField.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';
import { useTranslation } from 'Common/i18n';
import AccountNotAvailable from 'Modules/CreditCalculator/components/AccountNotAvailable/AccountNotAvailable.tsx';
import ActivityTypeSelect from 'Modules/CreditCalculator/components/ActivityTypeSelect/ActivityTypeSelect.tsx';
import InfoNotification from 'Modules/CreditCalculator/components/InfoNotification/InfoNotification.tsx';
import InsuranceToggle from 'Modules/CreditCalculator/components/InsuranceToggle/InsuranceToggle.tsx';
import LoanSummary from 'Modules/CreditCalculator/components/LoanSummary/LoanSummary.tsx';
import LoanTermSlider from 'Modules/CreditCalculator/components/LoanTermSlider/LoanTermSlider.tsx';
import PassportModal from 'Modules/CreditCalculator/components/PassportModal/PassportModal.tsx';
import TermsCheckbox from 'Modules/CreditCalculator/components/TermsCheckbox/TermsCheckbox.tsx';
import { CreditApplicationValidationError } from 'Modules/CreditCalculator/services/CreditApplicationService.ts';
import {
  useLoanCalculatorService,
  type RateInsuranceOption,
} from 'Modules/CreditCalculator/services/LoanCalculatorService.ts';

import styles from './CreditCalculator.module.scss';

const DEFAULT_LOAN_AMOUNT = '';

const formatCurrency = (value: number) => new Intl.NumberFormat('ru-RU').format(value);

type CreditCalculatorFormValues = {
  loanAmount: string;
  loanTerm?: number;
  monthlyIncome: string;
  activityType: string;
  insuranceEnabled: boolean;
};

const initCreditApplicationFieldMap: Record<string, keyof CreditCalculatorFormValues> = {
  'applicationCreditRequestDto.amount': 'loanAmount',
  'applicationCreditRequestDto.periodInterval': 'loanTerm',
  'applicationCreditRequestDto.activityType': 'activityType',
  'applicationCreditRequestDto.clientIncome': 'monthlyIncome',
};

const CreditCalculator = () => {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreditCalculatorFormValues>({
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
  const creditApplicationService = useCreditApplicationStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [term1Checked, setTerm1Checked] = useState(false);
  const [term2Checked, setTerm2Checked] = useState(false);
  const [term3Checked, setTerm3Checked] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);

  const allTermsAccepted = term1Checked && term2Checked && term3Checked;
  const isSubmitEnabled =
    allTermsAccepted && getValues('loanAmount') !== '' && getValues('monthlyIncome') !== '';
  console.log(isSubmitEnabled);

  const terms = creditRatesService.availableLoanTerms;
  const loanAmount = watch('loanAmount');
  const loanTerm = watch('loanTerm');
  const insuranceEnabled = watch('insuranceEnabled');

  const selectedInsuranceOption: RateInsuranceOption = insuranceEnabled
    ? 'withInsurance'
    : 'withoutInsurance';

  const loanSummary = useMemo(() => {
    const amount = Number(loanAmount) || 0;
    const month = Number(loanTerm) || terms[0] || 0;

    const calculatedLoan = loanCalculatorService.calculateLoan({
      amount,
      month,
      insuranceOption: selectedInsuranceOption,
    });

    return {
      monthlyPayment: calculatedLoan ? formatCurrency(calculatedLoan.monthlyPayment) : '0',
      overpayment: calculatedLoan ? formatCurrency(calculatedLoan.overpayment) : '0',
    };
  }, [loanAmount, loanCalculatorService, loanTerm, selectedInsuranceOption, terms]);

  // оформление заявки
  const onSubmit = async (values: CreditCalculatorFormValues) => {
    clearErrors();
    const amount = Number(values.loanAmount) || 0;
    const periodInterval = Number(values.loanTerm) || terms[0] || 0;
    const percent = loanCalculatorService.resolvePercent({
      insuranceOption: selectedInsuranceOption,
    });

    try {
      await creditApplicationService.initCreditApplication({
        amount,
        periodInterval,
        productCode: creditRatesService.creditRates?.productCode || '',
        percent: percent || 0,
        level: creditRatesService.creditRates?.loyaltyLevel || '',
        activityType: values.activityType,
        clientIncome: Number(values.monthlyIncome) || 0,
        insuranceConsent: values.insuranceEnabled,
        hash: loanOffersService.loanOfferData?.hash || '',
      });
    } catch (error) {
      if (error instanceof CreditApplicationValidationError) {
        Object.entries(error.details).forEach(([field, messages]) => {
          const formField = initCreditApplicationFieldMap[field];

          if (formField && messages.length) {
            setError(formField, { type: 'server', message: messages[0] });
          }
        });

        return;
      }

      throw error;
    }
  };

  // переход к обновлению паспорта
  const handleContinuePassportClick = () => {
    setIsPassportModalOpen(false);
    navigate('/passport');
  };

  // листок ключевых данных
  const handlePdfLkdClick = async () => {
    const amount = Number(getValues('loanAmount')) || 0;
    const termMonths = Number(getValues('loanTerm')) || terms[0] || 0;

    await creditRatesService.generatePdfLkd({
      amount,
      termMonths,
      insuranceOption: selectedInsuranceOption,
    });
  };

  // подгрузка данных
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
  }, [activityTypeService, creditRatesService, loanOffersService]);

  // установка значения по умолчанию для срока кредита
  useEffect(() => {
    if (!terms.length || loanTerm !== undefined) {
      return;
    }

    setValue('loanTerm', terms[0], { shouldDirty: false, shouldTouch: false });
  }, [loanTerm, setValue, terms]);

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
                  errorMessage={errors.loanAmount?.message}
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
                    label={terms[safeIndex] ?? 0}
                    value={safeIndex}
                    min={0}
                    max={Math.max(terms.length - 1, 0)}
                    disabled={!terms.length}
                    onChange={(index: number) => {
                      const nextTerm = terms[index];

                      if (nextTerm !== undefined) {
                        field.onChange(nextTerm);
                      }
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
                  errorMessage={errors.monthlyIncome?.message}
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
            insuranceEnabled={insuranceEnabled}
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
            {loanAmount && (
              <TermsCheckbox
                checked={term3Checked}
                text="Я ознакомлен(на) [с листком ключевых данных]()"
                onChange={setTerm3Checked}
                onTapLink={handlePdfLkdClick}
              />
            )}
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
          onContinue={handleContinuePassportClick}
        />
      )}

      {creditApplicationService.accountNotAvailableModal && (
        <AccountNotAvailable
          onClose={() => creditApplicationService.resetAccountNotAvailableModal()}
          title={creditApplicationService.accountNotAvailableModal.title}
          description={creditApplicationService.accountNotAvailableModal.description}
        />
      )}
    </div>
  );
};

export default observer(CreditCalculator);
