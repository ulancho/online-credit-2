import { useEffect, useRef, useState } from 'react';

import styles from './OtpVerification.module.scss';

const OTP_LENGTH = 6;
const INITIAL_SECONDS = 23;
const PHONE = '+996 (555) XXX 123';

export default function OtpVerification() {
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(value);
  };

  const handleResend = () => {
    if (!canResend) return;
    setCode('');
    setSeconds(INITIAL_SECONDS);
    setCanResend(false);
    inputRef.current?.focus();
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => code[i] ?? '');

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <span className={styles.timer}>{formatTime(seconds)}</span>
        <p className={styles.description}>
          На Ваш номер мобильного телефона {PHONE} был отправлен код подтверждения
        </p>
        <div className={styles.codeArea} onClick={focusInput}>
          <input
            ref={inputRef}
            className={styles.hiddenInput}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={OTP_LENGTH}
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
