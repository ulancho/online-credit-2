import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreditApplicationStore, useUserProfileStore } from 'Common/stores/rootStore.tsx';
import { errorHandler } from 'Common/utils/errorHandler.ts';
import { OTP_TYPE_CONSTANTS } from 'Modules/CreditCalculator/api/creditApplicationApi.ts';
import { confirmOtp } from 'Modules/OtpVerification/api/otpVerificationApi.ts';

import styles from './OtpVerification.module.scss';

const OTP_LENGTH_MAP = {
  [OTP_TYPE_CONSTANTS.SOCFOND_OTP]: 6,
  [OTP_TYPE_CONSTANTS.MBANK_OTP]: 4,
} as const;
const INITIAL_SECONDS = 60;
const PHONE = '+996 (555) XXX 123';

const formatPhoneNumber = (phoneNumber: string | null) => {
  if (!phoneNumber) {
    return PHONE;
  }

  const normalized = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  const digits = normalized.replace(/\D/g, '');

  if (digits.length !== 12 || !digits.startsWith('996')) {
    return normalized;
  }

  return `+${digits.slice(0, 3)} (${digits.slice(3, 6)}) ${digits.slice(6, 9)} ${digits.slice(9, 12)}`;
};

function OtpVerification() {
  const navigate = useNavigate();
  const creditApplicationService = useCreditApplicationStore();
  const userProfileService = useUserProfileStore();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSubmittedCodeRef = useRef<string | null>(null);
  const otpLength = OTP_LENGTH_MAP[creditApplicationService.currentOtpType];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, otpLength);
    setCode(value);
  };

  const handleResend = () => {
    if (!canResend) return;
    if (isSubmitting) return;

    setCode('');
    setSeconds(INITIAL_SECONDS);
    setCanResend(false);
    inputRef.current?.focus();
  };

  const handleConfirmOtp = useCallback(async () => {
    if (isSubmitting) return;
    if (lastSubmittedCodeRef.current === code) return;
    lastSubmittedCodeRef.current = code;

    setIsSubmitting(true);
    try {
      const response = await confirmOtp({ code });
      if (response.status === 200) {
        navigate('/loading');
      }
    } catch (error) {
      const errorMessage = errorHandler(error) ?? 'OTP confirmation failed';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [code, isSubmitting, navigate]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const digits = Array.from({ length: otpLength }, (_, i) => code[i] ?? '');
  const phoneNumber = formatPhoneNumber(userProfileService.phoneNumber);

  useEffect(() => {
    setCode((prevCode) => prevCode.slice(0, otpLength));
  }, [otpLength]);

  useEffect(() => {
    void userProfileService.fetchUserProfile();
  }, [userProfileService]);

  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  useEffect(() => {
    if (code.length !== otpLength) {
      return;
    }

    void handleConfirmOtp();
  }, [code, handleConfirmOtp, otpLength]);

  useEffect(() => {
    if (code.length !== otpLength) {
      lastSubmittedCodeRef.current = null;
    }
  }, [code, otpLength]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <span className={styles.timer}>{formatTime(seconds)}</span>
        <p className={styles.description}>
          На Ваш номер мобильного телефона {phoneNumber} был отправлен код подтверждения
        </p>
        <div className={styles.codeArea} onClick={focusInput}>
          <input
            ref={inputRef}
            className={styles.hiddenInput}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={otpLength}
            value={code}
            onChange={handleChange}
            aria-label="Код подтверждения"
          />
          <div className={styles.digits}>
            {digits.map((digit, i) => (
              <span
                key={i}
                className={`${styles.digitCell} ${digit ? styles.digitCellFilled : styles.digitCellEmpty}`}
              >
                {digit || '–'}
              </span>
            ))}
          </div>
        </div>
        <button
          className={`${styles.resendBtn} ${canResend ? styles.resendBtnActive : styles.resendBtnDisabled}`}
          onClick={handleResend}
          disabled={!canResend}
        >
          Получить новый код
        </button>
      </div>
    </div>
  );
}

export default observer(OtpVerification);
