import { useState, useEffect } from 'react';

import styles from '../styles/index.module.scss';

interface QRCodeSectionProps {
  initialTime?: number;
}

function QRCodeSection({ initialTime = 113 }: QRCodeSectionProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <section className={styles.qrSection}>
      <div className={styles.qrContent}>
        <header className={styles.qrTitle}>
          <h2 className={styles.qrInstructions}>Наведите QR-сканер из приложения MBANK</h2>
        </header>

        <div className={styles.qrCodeContainer}>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/6773266178fcfbe04c3ddd6032c67d2cda9749ff?placeholderIfAbsent=true&apiKey=a499a3280c014db59e8ee97408890ce2"
            alt="QR Code for MBANK authentication"
            className={styles.qrCodeImage}
          />
          <div className={styles.timerSection}>
            <button className={styles.timerButton} type="button">
              <span className={styles.timerText}>Истекает через {formatTime(timeLeft)}</span>
            </button>
          </div>
        </div>

        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/9fc2b260ba648a8e49285e675b406960376cfa98?placeholderIfAbsent=true&apiKey=a499a3280c014db59e8ee97408890ce2"
          alt="MBANK Logo"
          className={styles.mbankLogo}
        />
      </div>
    </section>
  );
}

export default QRCodeSection;
