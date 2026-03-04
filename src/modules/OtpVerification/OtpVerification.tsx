import { useState, useEffect } from 'react';

import styles from './OtpVerification.module.scss';

const PHONE_NUMBER = '+996 (555) XXX 123';
const CODE_LENGTH = 6;
const TIMER_SECONDS = 60;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function OtpVerification() {
  const [code, setCode] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleResend = () => {
    if (!canResend) return;
    setCode([]);
    setTimeLeft(TIMER_SECONDS);
    setCanResend(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.timerBlock}>
          <span className={styles.timer}>{formatTime(timeLeft)}</span>
          <p className={styles.description}>
            На Ваш номер мобильного телефона {PHONE_NUMBER} был отправлен код подтверждения
          </p>
        </div>
        <div className={styles.codeDisplay}>
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <div key={i} className={styles.codeCell}>
              <span className={styles.codeDigit}>{code[i] ?? ''}</span>
            </div>
          ))}
        </div>
        <button
          className={`${styles.resendButton} ${canResend ? styles.resendActive : styles.resendDisabled}`}
          onClick={handleResend}
          disabled={!canResend}
        >
          Получить новый код
        </button>
      </div>
    </div>
  );
}
