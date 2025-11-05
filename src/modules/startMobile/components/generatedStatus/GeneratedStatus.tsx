import { Loader } from 'Common/components/loader';

import styles from './GeneratedStatus.module.scss';

const GeneratedStatus = () => {
  return (
    <div className={styles.generatedContainer}>
      <h2 className={styles.mainTitle}>
        Ждем подтверждения <br />
        входа
      </h2>
      <p className={styles.subtitle}>Это займёт всего несколько секунд</p>
      <Loader classes={styles.loader} />
    </div>
  );
};

export default GeneratedStatus;
