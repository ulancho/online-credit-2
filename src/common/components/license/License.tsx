import styles from './License.module.scss';

export const license = () => {
  return (
    <div className={styles.container}>
      <p>ОАО «МБАНК». © 2006-2025, Лицензия №014 НБ КР</p>
    </div>
  );
};

export default license;
