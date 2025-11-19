import { LeftSection } from 'Modules/errorDesktop/components/leftSection';
import { RightSection } from 'Modules/errorDesktop/components/rightSection';

import styles from './styles/style.module.scss';

function ErrorDesktop() {
  return (
    <main className={styles.content}>
      <div className={styles.sectionsContainer}>
        <LeftSection />
        <RightSection />
      </div>
    </main>
  );
}

export default ErrorDesktop;
