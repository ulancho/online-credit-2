import { LeftSection } from 'Modules/error/components/leftSection';
import { RightSection } from 'Modules/error/components/rightSection';

import styles from './styles/style.module.scss';

function Error() {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.backgroundWrapper}>
        <main className={styles.mainContent}>
          <div className={styles.sectionsContainer}>
            <LeftSection />
            <RightSection />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Error;
