import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { useLoanConditionsStore, useLoanConfirmationStore } from '@/common/stores/rootStore';
import { formatAmount } from '@/common/utils/formatAmount';
import PercentIcon from 'Assets/icons/products.svg?react';
import Button from 'Common/components/Button/Button.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import { Modal } from '../LoanConditions/components/Modal';

import styles from './LoanConfirmation.module.scss';

import type { ActiveRequests } from '../LoanConditions/models/ActiveRequests';



interface CheckboxProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <button
      className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}
      onClick={() => onChange(!checked)}
      aria-checked={checked}
      role="checkbox"
    >
      {checked && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3.33325 7.99984L6.66659 11.3332L13.3333 4.6665"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

const LoanConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();

  const loanConditionsStore = useLoanConditionsStore();
  const loanConfirmationStore = useLoanConfirmationStore();

  const selectedInsurance: string | null =
    (location.state as { insurance?: string })?.insurance ?? null;

  const [active, setActive] = useState<boolean | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isKeyDataChecked, setIsKeyDataChecked] = useState(true);
  const [isInsuranceTermsChecked, setIsInsuranceTermsChecked] = useState(
    selectedInsurance !== null,
  );

  const open = (val: boolean) => setActive(val);
  const close = () => setActive(null);

  const { activeRequests, activeRequestsData } = loanConditionsStore;

  const activeGroup: ActiveRequests = activeRequestsData[type as keyof typeof activeRequestsData];

  const overPayment = useMemo(
    () => activeGroup?.monthlyPayment * Number(activeGroup?.period) - activeGroup?.amount,
    [activeGroup?.monthlyPayment, activeGroup?.amount, activeGroup?.period],
  );

  const isButtonActive =
    selectedInsurance !== null && isKeyDataChecked && isInsuranceTermsChecked && selectedDay;

  const loadData = useCallback(async () => {
    loanConditionsStore.getActiveRequests();
  }, [loanConditionsStore]);

  useEffect(() => {
    loanConfirmationStore.getCreditDirectoryItems();
    if (!activeRequests) {
      loadData();
    }
  }, [loanConfirmationStore, loadData, activeRequests]);

  const proceedToDeclinedPage = () =>
    navigate('/application-decline', {
      state: {
        title: 'Вы отказались от кредита',
        description:
          'К сожалению, сейчас мы не можем вам открыть Mplus. Повторная заявка будет доступна 28.12.2024',
      },
    });

  return (
    <div id="page" className={styles.page}>
      <NavBar />
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Ваша заявка одобрена</h1>
            <p className={styles.description}>
              Условия могли измениться.
              <br /> Пожалуйста, проверьте данные
            </p>
          </div>
        </div>
        {/* Credit amount card */}
        <div className={styles.sectionPad}>
          <div className={styles.amountCard}>
            <PercentIcon />
            <div className={styles.amountInfo}>
              <span className={styles.amountLabel}>Сумма кредита</span>
              <span className={styles.amountValue}>{formatAmount(activeGroup?.amount)} c</span>
            </div>
          </div>
        </div>

        {/* Info list card */}
        <div className={styles.sectionPad}>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Сумма ежемесячного платежа</span>
              <span className={styles.infoValue}>
                {formatAmount(activeGroup?.monthlyPayment)} c
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Срок кредита</span>
              <span className={styles.infoValue}>{activeGroup?.period}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Переплата по кредиту</span>
              <span className={styles.infoValue}>{formatAmount(overPayment)} c</span>
            </div>
            <div className={`${styles.infoRow} ${styles.infoRowLast}`}>
              <span className={styles.infoLabel}>Проценты</span>
              <span className={styles.infoValue}>{activeGroup?.percent}%</span>
            </div>
          </div>
        </div>

        {/* Repayment day selection */}
        <div className={styles.sectionPad}>
          <h3 className={styles.sectionTitle}>Выберите число месяца для погашений</h3>
          <div className={styles.dayChips}>
            {loanConfirmationStore.availablePayDateList?.map((day) => (
              <button
                key={day}
                className={`${styles.dayChip} ${selectedDay === day ? styles.dayChipActive : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                {day} день
              </button>
            ))}
          </div>
        </div>

        {/* Insurance selector */}
        {loanConditionsStore.activeRequests?.insuranceConsent && (
          <div className={styles.sectionPad}>
            <h3 className={styles.sectionTitle}>Выберите страхование</h3>
            <button
              className={styles.insuranceSelector}
              onClick={() =>
                navigate('/insurance-companies', {
                  state: { from: `/loan-confirmation/${type}`, selectedInsurance },
                })
              }
            >
              <span
                className={
                  selectedInsurance ? styles.insuranceSelected : styles.insurancePlaceholder
                }
              >
                {selectedInsurance ?? 'Выберите из списка'}
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
          <div className={styles.termRow}>
            <Checkbox checked={isKeyDataChecked} onChange={setIsKeyDataChecked} />
            <p className={styles.termText}>
              <span className={styles.termTextGray}>Я ознакомлен(на) </span>
              <span className={styles.termLink}>с листком ключевых данных</span>
            </p>
          </div>

          {selectedInsurance && (
            <div className={styles.termRow}>
              <Checkbox checked={isInsuranceTermsChecked} onChange={setIsInsuranceTermsChecked} />
              <p className={styles.termText}>
                <span className={styles.termTextGray}>
                  Я ознакомлен(а) и согласен(на) с условиями договора публичной{' '}
                </span>
                <span className={styles.termLink}>оферты</span>
                <span className={styles.termTextGray}> по страхованию</span>
              </p>
            </div>
          )}
        </div>

        <div className={styles.buttonsWrap}>
          <Button variant="yellow" disabled={!isButtonActive}>
            Оформить кредит
          </Button>
          <Button onClick={() => open(true)} variant="text-danger">
            Отказаться
          </Button>

          <Modal
            isOpen={active}
            onClose={close}
            title="Подтвердите действие"
            size="sm"
            footer={
              <>
                <button className="btn btn-text-green" onClick={close}>
                  Нет
                </button>
                <button className="btn btn-text-green" onClick={proceedToDeclinedPage}>
                  Да
                </button>
              </>
            }
          >
            Вы уверены, что хотите отказаться от выдачи кредита?
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default observer(LoanConfirmation);
