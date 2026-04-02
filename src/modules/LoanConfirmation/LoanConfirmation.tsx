import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import ConfirmationModal from '@/common/components/Modal/ConfirmationModal';
import { useTranslation } from '@/common/i18n';
import {
  useLoanConditionsStore,
  useLoanConfirmationStore,
  useLoanOffersStore,
} from '@/common/stores/rootStore';
import { formatAmount } from '@/common/utils/formatAmount';
import PercentIcon from 'Assets/icons/products.svg?react';
import Button from 'Common/components/Button/Button.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import TermsCheckbox from '../CreditCalculator/components/TermsCheckbox/TermsCheckbox';

import styles from './LoanConfirmation.module.scss';

import type { InsuranceCompaniesItem } from '../InsuranceCompanies/models/InsuranceCompanies';
import type { ActiveRequests } from '../LoanConditions/models/ActiveRequests';

const LoanConfirmation = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { type } = useParams();

  const loanConditionsStore = useLoanConditionsStore();
  const loanConfirmationStore = useLoanConfirmationStore();
  const loanOffersService = useLoanOffersStore();

  const state = location.state as { insurance?: string } | null;

  const selectedInsurance: InsuranceCompaniesItem | null = useMemo(() => {
    const rawData = state?.insurance;

    if (!rawData) return null;

    try {
      return JSON.parse(rawData) as InsuranceCompaniesItem;
    } catch (error) {
      console.error('Ошибка парсинга JSON из state:', error);
      return null;
    }
  }, [state?.insurance]);

  const [active, setActive] = useState<boolean | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(
    loanConfirmationStore.selectedPaymentDay || null,
  );
  const [isKeyDataChecked, setIsKeyDataChecked] = useState(true);
  const [isInsuranceTermsChecked, setIsInsuranceTermsChecked] = useState(
    selectedInsurance !== null,
  );
  const open = (val: boolean) => setActive(val);

  const { activeRequests, activeRequestsData } = loanConditionsStore;

  const activeGroup: ActiveRequests = activeRequestsData[type as keyof typeof activeRequestsData];

  const overPayment = useMemo(
    () => activeGroup?.monthlyPayment * Number(activeGroup?.period) - activeGroup?.amount,
    [activeGroup?.monthlyPayment, activeGroup?.amount, activeGroup?.period],
  );

  const commonChecks = selectedDay && isKeyDataChecked;

  const isButtonActive = loanConditionsStore.activeRequests?.insuranceConsent
    ? commonChecks && isInsuranceTermsChecked && selectedInsurance
    : commonChecks;

  const loadData = useCallback(async () => {
    loanConditionsStore.getActiveRequests();
  }, [loanConditionsStore]);

  useEffect(() => {
    loanConfirmationStore.getCreditDirectoryItems();
    if (!activeRequests) {
      loadData();
    }
  }, [loanConfirmationStore, loadData, activeRequests]);

  useEffect(() => {
    loanConfirmationStore.getInsureOffer();
  }, []);

  const proceedToDeclinedPage = async () => {
    const success = await loanConditionsStore.setDeclineApplication(activeRequests?.applicationId);

    if (success) {
      navigate('/finish-page', {
        state: {
          title: 'Вы отказались от кредита',
          description: `Ваша заявка успешно отклонена`,
        },
        replace: true,
      });
    }
  };

  const submitCredit = () => {
    loanConfirmationStore.setSubmitCredit({
      acceptAgreement: isInsuranceTermsChecked,
      insureCompanyId: (selectedInsurance?.insureCompanyId as string) || '1',
      paymentDay: selectedDay as number,
      type,
    });
    if (type === 'online') {
      navigate('/cooling-period');
    } else navigate('/security-warning');
  };

  // download offer
  const handleOfferClick = async () => {
    const offer = loanConfirmationStore.insureOffer;

    if (!offer?.code || !offer?.hash) {
      return;
    }

    const fileBlob = await loanOffersService.downloadOfferFile(offer.code, offer.hash);
    alert('fileBlob: ' + fileBlob);
    const fileUrl = window.URL.createObjectURL(fileBlob);
    const link = document.createElement('a');

    link.href = fileUrl;
    link.download = `${offer.code}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(fileUrl);
  };

  // Листок ключевых данных
  const downloadBase64File = (base64: string, fileName: string, mimeType: string) => {
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${base64}`;
    link.download = fileName;
    link.click();
  };

  const handlePdfLkdClick = async () => {
    const amount = activeGroup?.amount || 0;
    const termMonths = Number(activeGroup?.period) || 0;
    const nominalRate = activeGroup?.percent || 0;

    const response = await loanConfirmationStore.generatePdfLkd({
      amount,
      termMonths,
      nominalRate,
    });

    if (response) downloadBase64File(response, 'file.pdf', 'base64/pdf');
  };

  return (
    <div id="page" className={styles.page}>
      <NavBar onBack={() => navigate('/loan-conditions')} />
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{t('loanConfirmations.title')}</h1>
            <p className={styles.description}>{t('loanConfirmations.desc')}</p>
          </div>
        </div>
        {/* Credit amount card */}
        <div className={styles.sectionPad}>
          <div className={styles.amountCard}>
            <PercentIcon />
            <div className={styles.amountInfo}>
              <span className={styles.amountLabel}>{t('loanConfirmations.sum')}</span>
              <span className={styles.amountValue}>{formatAmount(activeGroup?.amount)} c</span>
            </div>
          </div>
        </div>

        {/* Info list card */}
        <div className={styles.sectionPad}>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t('loanConfirmations.monthlyPayment')}</span>
              <span className={styles.infoValue}>
                {formatAmount(activeGroup?.monthlyPayment)} c
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t('loanConfirmations.term')}</span>
              <span className={styles.infoValue}>{activeGroup?.period}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t('loanConfirmations.overpayment')}</span>
              <span className={styles.infoValue}>{formatAmount(overPayment)} c</span>
            </div>
            <div className={`${styles.infoRow} ${styles.infoRowLast}`}>
              <span className={styles.infoLabel}>{t('loanConfirmations.bid')}</span>
              <span className={styles.infoValue}>{activeGroup?.percent}%</span>
            </div>
          </div>
        </div>

        {/* Repayment day selection */}
        <div className={styles.sectionPad}>
          <h3 className={styles.sectionTitle}>{t('loanConfirmations.chooseDate')}</h3>
          <div className={styles.dayChips}>
            {loanConfirmationStore.availablePayDateList?.map((day) => (
              <button
                key={day}
                className={`${styles.dayChip} ${selectedDay === day ? styles.dayChipActive : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                {day} {t('common.day')}
              </button>
            ))}
          </div>
        </div>

        {/* Insurance selector */}
        {loanConditionsStore.activeRequests?.insuranceConsent && (
          <div className={styles.sectionPad}>
            <h3 className={styles.sectionTitle}>{t('loanConfirmations.insuranceCompany')}</h3>
            <button
              className={styles.insuranceSelector}
              onClick={() => {
                if (selectedDay) {
                  loanConfirmationStore.selectedPaymentDay = selectedDay;
                }
                navigate('/insurance-companies', {
                  state: { from: `/loan-confirmation/${type}`, selectedInsurance },
                });
              }}
            >
              <span
                className={
                  selectedInsurance ? styles.insuranceSelected : styles.insurancePlaceholder
                }
              >
                {selectedInsurance?.name ?? 'Выберите из списка'}
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.53151 17.5856C9.20806 17.3269 9.15562 16.8549 9.41438 16.5315L13.0396 12L9.41438 7.46849C9.15562 7.14505 9.20806 6.67308 9.53151 6.41432C9.85495 6.15556 10.3269 6.208 10.5857 6.53145L14.5857 11.5315C14.8048 11.8054 14.8048 12.1946 14.5857 12.4685L10.5857 17.4685C10.3269 17.7919 9.85495 17.8444 9.53151 17.5856Z"
                  fill="#A0A7B1"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Footer: checkboxes + buttons */}
      <div className={styles.footer}>
        <div className={styles.termsList}>
          <TermsCheckbox
            checked={isKeyDataChecked}
            text="Я ознакомлен(на) [с листком ключевых данных]()"
            onChange={setIsKeyDataChecked}
            onTapLink={handlePdfLkdClick}
          />

          {selectedInsurance && (
            <TermsCheckbox
              checked={isInsuranceTermsChecked}
              text={loanConfirmationStore.insureOffer?.agreementText || ''}
              onChange={setIsInsuranceTermsChecked}
              onTapLink={() => handleOfferClick()}
            />
          )}
        </div>

        <div className={styles.buttonsWrap}>
          <Button onClick={submitCredit} variant="yellow" disabled={!isButtonActive}>
            Оформить кредит
          </Button>
          <Button onClick={() => open(true)} variant="text-danger">
            Отказаться
          </Button>

          <ConfirmationModal submit={proceedToDeclinedPage} active={active} setActive={setActive} />
        </div>
      </div>
    </div>
  );
};

export default observer(LoanConfirmation);
