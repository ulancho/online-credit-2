import { Loader } from 'Common/components/loader';

import styles from './BoundStatus.module.scss';

export const BoundStatus = () => {
  return (
    <div className={styles.container}>
      <Loader classes={styles.loader} />
      <p className={styles.text}>Ждем подтверждения входа</p>
    </div>
  );
};
