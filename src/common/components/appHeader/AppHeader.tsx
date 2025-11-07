import { LanguageSwitcher } from 'Common/components/languageSwitcher/LanguageSwitcher.tsx';

import styles from './AppHeader.module.scss';

export const AppHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.bottomPanel}>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default AppHeader;
