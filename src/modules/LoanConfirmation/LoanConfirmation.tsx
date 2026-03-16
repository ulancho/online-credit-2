import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import PercentIcon from 'Assets/icons/products.svg?react';
import Button from 'Common/components/Button/Button.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import styles from './LoanConfirmation.module.scss';

const REPAYMENT_DAYS = [1, 5, 10, 15];

const CREDIT_AMOUNT = '150 000';
const MONTHLY_PAYMENT = '1 340.00';
const LOAN_TERM = '12 месяцев';
const OVERPAYMENT = '5 340.00';
const INTEREST_RATE = '32%';

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

export default function LoanConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedInsurance: string | null =
    (location.state as { insurance?: string })?.insurance ?? null;

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isKeyDataChecked, setIsKeyDataChecked] = useState(true);
  const [isInsuranceTermsChecked, setIsInsuranceTermsChecked] = useState(
    selectedInsurance !== null,
  );

  const isButtonActive = selectedInsurance !== null && isKeyDataChecked && isInsuranceTermsChecked;

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
              <span className={styles.amountValue}>
                {CREDIT_AMOUNT} <span className="currencySymbol">{'\u20C0'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Info list card */}
        <div className={styles.sectionPad}>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Сумма ежемесячного платежа</span>
              <span className={styles.infoValue}>
                {MONTHLY_PAYMENT}
                <span>&#8384;</span>
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Срок кредита</span>
              <span className={styles.infoValue}>{LOAN_TERM}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Переплата по кредиту</span>
              <span className={styles.infoValue}>
                {OVERPAYMENT}
                <span>&#8384;</span>
              </span>
            </div>
            <div className={`${styles.infoRow} ${styles.infoRowLast}`}>
              <span className={styles.infoLabel}>Проценты</span>
              <span className={styles.infoValue}>{INTEREST_RATE}</span>
            </div>
          </div>
        </div>

        {/* Repayment day selection */}
        <div className={styles.sectionPad}>
          <h3 className={styles.sectionTitle}>Выберите число месяца для погашений</h3>
          <div className={styles.dayChips}>
            {REPAYMENT_DAYS.map((day) => (
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
        <div className={styles.sectionPad}>
          <h3 className={styles.sectionTitle}>Выберите страхование</h3>
          <button
            className={styles.insuranceSelector}
            onClick={() =>
              navigate('/insurance-companies', {
                state: { from: '/loan-confirmation', selectedInsurance },
              })
            }
          >
            <span
              className={selectedInsurance ? styles.insuranceSelected : styles.insurancePlaceholder}
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
          <Button variant="text-danger">Отказаться</Button>
        </div>
      </div>
    </div>
  );
}
