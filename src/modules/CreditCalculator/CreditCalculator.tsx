import { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  useActivityTypeStore,
  useCreditApplicationStore,
  useCreditRatesStore,
  useLoanOffersStore,
  usePassportValidationStore,
  useQueryParamsStore,
} from '@/common/stores/rootStore';
import { exitApp } from 'Common/api/common.ts';
import InputField from 'Common/components/InputField/InputField.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';
import Spinner from 'Common/components/Spinner/Spinner.tsx';
import { useTranslation } from 'Common/i18n';
import ActivityTypeSelect from 'Modules/CreditCalculator/components/ActivityTypeSelect/ActivityTypeSelect.tsx';
import InfoModal from 'Modules/CreditCalculator/components/InfoModal/InfoModal.tsx';
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
  'applicationCreditDto.amount': 'loanAmount',
  'applicationCreditRequestDto.periodInterval': 'loanTerm',
  'applicationCreditRequestDto.activityType': 'activityType',
  'applicationCreditRequestDto.clientIncome': 'monthlyIncome',
};

type OfferType = 'public' | 'loan';

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
  const queryParamsService = useQueryParamsStore();
  const passportValidationService = usePassportValidationStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [term1Checked, setTerm1Checked] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  const loanAmount = watch('loanAmount');
  const loanTerm = watch('loanTerm');
  const monthlyIncome = watch('monthlyIncome');
  const insuranceEnabled = watch('insuranceEnabled');
  const terms = creditRatesService.availableLoanTerms
    .map((term) => Number(term))
    .filter((term) => Number.isFinite(term));

  const isPublicOfferLoaded = Boolean(loanOffersService.publicLoanOfferData);
  const isLoanOfferLoaded = Boolean(loanOffersService.loanOfferData);
  const isLkdTermVisible = Boolean(loanAmount);
  const allTermsAccepted =
    (!isPublicOfferLoaded && !isLoanOfferLoaded && !isLkdTermVisible) || term1Checked;
  const isSubmitEnabled = allTermsAccepted && loanAmount !== '' && monthlyIncome !== '';

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

  const downloadBase64File = (base64: string, fileName: string, mimeType: string) => {
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${base64}`;
    link.download = fileName;
    link.click();
  };

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] ?? ''; // 👈 важно
        resolve(base64);
      };

      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  // оформление заявки
  const onSubmit = async (values: CreditCalculatorFormValues) => {
    clearErrors();
    const amount = Number(values.loanAmount) || 0;
    const periodInterval = Number(values.loanTerm) || terms[0] || 0;
    const percent = loanCalculatorService.resolvePercent({
      insuranceOption: selectedInsuranceOption,
    });

    const cancelValidationPassport = false;

    try {
      // if (queryParamsService.token && queryParamsService.deviceId) {
      if (cancelValidationPassport) {
        const passportValidationResponse = await passportValidationService.validatePassport(
          queryParamsService.token,
          queryParamsService.deviceId,
        );

        if (passportValidationResponse && !passportValidationResponse?.valid) {
          setIsPassportModalOpen(true);
          return;
        }
      }

      const initResponse = await creditApplicationService.initCreditApplication({
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

      if (initResponse?.status === 200) {
        navigate('/otp');
      }
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

      if (error instanceof AxiosError && error.response?.status === 500) {
        const responseData = error.response?.data;

        if (responseData?.message) {
          alert(responseData.message);

          return;
        }
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

    const response = await creditRatesService.generatePdfLkd({
      amount,
      termMonths,
      insuranceOption: selectedInsuranceOption,
    });

    if (response) downloadBase64File(response, 'file.pdf', 'base64/pdf');
  };

  // скачивание офферт
  const handleOfferClick = async (offerType: OfferType) => {
    const offer =
      offerType === 'public'
        ? loanOffersService.publicLoanOfferData
        : loanOffersService.loanOfferData;

    if (!offer?.code || !offer?.hash) {
      return;
    }

    try {
      const fileBlob = await loanOffersService.downloadOfferFile(offer.code, offer.hash);

      const base64 = await blobToBase64(fileBlob);

      downloadBase64File(base64, `${offer.code}.pdf`, 'base64/pdf');
    } catch (error) {
      console.error('Ошибка при скачивании офферты', error);
    }
  };

  // закрытие модалки
  const closeWebView = () => {
    exitApp().then((res) => console.log(res.status));
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
      forceUpdate((value) => value + 1);
    };

    loadFieldsData();
  }, [activityTypeService, creditRatesService, loanOffersService]);

  // установка значения по умолчанию для срока кредита
  useEffect(() => {
    if (!terms.length || loanTerm !== undefined) {
      return;
    }

    const defaultLoanTerm = terms.includes(12) ? 12 : terms[0];

    setValue('loanTerm', defaultLoanTerm, { shouldDirty: false, shouldTouch: false });
  }, [terms, loanTerm, setValue]);

  return (
    <div id="page">
      <NavBar onBack={closeWebView} />
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
                const currentTerm = Number(field.value);
                const currentIndex = terms.findIndex((term) => term === currentTerm);
                const safeIndex = currentIndex >= 0 ? currentIndex : 0;
                const defaultDisplayTerm = terms.includes(12) ? 12 : (terms[0] ?? 12);
                const displayTerm = currentIndex >= 0 ? terms[safeIndex] : defaultDisplayTerm;

                return (
                  <LoanTermSlider
                    label={displayTerm}
                    value={safeIndex}
                    min={0}
                    max={Math.max(terms.length - 1, 0)}
                    disabled={!terms.length}
                    onChange={(index: number) => {
                      const normalizedIndex = Math.min(
                        Math.max(Math.round(index), 0),
                        Math.max(terms.length - 1, 0),
                      );
                      const nextTerm = terms[normalizedIndex];

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
            <InfoNotification text={t('credit-calculator.notice')} />
          </div>
          <div className={styles.termsSection}>
            {loanOffersService.publicLoanOfferData && (
              <TermsCheckbox
                checked={term1Checked}
                text={loanOffersService.publicLoanOfferData.agreementText || ''}
                onChange={setTerm1Checked}
                onTapLink={() => handleOfferClick('public')}
              />
            )}
            {loanOffersService.loanOfferData && (
              <TermsCheckbox
                checked={term1Checked}
                text={loanOffersService.loanOfferData.agreementText || ''}
                onChange={setTerm1Checked}
                onTapLink={() => handleOfferClick('loan')}
              />
            )}
            {loanAmount && (
              <TermsCheckbox
                checked={term1Checked}
                text={t('credit-calculator.agreements.lkd')}
                onChange={setTerm1Checked}
                onTapLink={handlePdfLkdClick}
              />
            )}
          </div>
        </div>
        <div className={styles.submitSection}>
          <button
            className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitButtonActive : styles.submitButtonDisabled} ${creditApplicationService.awaiting && 'btn-loading'}`}
            disabled={!isSubmitEnabled}
          >
            {creditApplicationService.awaiting ? (
              <Spinner width={25} height={25} />
            ) : (
              t('credit-calculator.submitAnApplication')
            )}
          </button>
        </div>
      </form>

      {isPassportModalOpen && (
        <PassportModal
          onCancel={() => setIsPassportModalOpen(false)}
          onContinue={handleContinuePassportClick}
        />
      )}

      {creditApplicationService.modal && (
        <InfoModal
          onClose={() => creditApplicationService.resetModal()}
          title={creditApplicationService.modal.content.title}
          description={creditApplicationService.modal.content.description}
        />
      )}
    </div>
  );
};

export default observer(CreditCalculator);
