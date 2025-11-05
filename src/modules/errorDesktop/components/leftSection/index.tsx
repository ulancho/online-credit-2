import styles from './style.module.scss';

export const LeftSection = function () {
  return (
    <section className={styles.leftSection}>
      <div className={styles.content}>
        <h1 className={styles.title}>Вход через MBank ID временно недоступен для этого запроса</h1>
        <p className={styles.subtitle}>
          Вернитесь на сайт и выберите другой способ авторизации — всё остальное работает как обычно
        </p>
      </div>
    </section>
  );
};
