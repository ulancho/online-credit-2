import PhoneInputSection from './components/PhoneInputSection.tsx';
import QrCodeSection from './components/QrCodeSection.tsx';
import styles from './styles/index.module.scss';

function Start() {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.backgroundWrapper}>
        <main className={styles.modalContent}>
          <div className={styles.sectionsContainer}>
            <PhoneInputSection />
            <QrCodeSection />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Start;
