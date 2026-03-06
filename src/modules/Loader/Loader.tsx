import Lottie from 'lottie-react';

import loaderAnimation from 'Assets/loader.json';
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import styles from './Loader.module.scss';

export default function Loader() {
  return (
    <div className={styles.page}>
      <NavBar />
      <div className={styles.content}>
        <div className={styles.lottieSection}>
          <Lottie
            animationData={loaderAnimation}
            className={styles.loaderAnimation}
            loop
            autoplay
          />

          <div className={styles.loaderCounter}>12%</div>
        </div>
        <div className={styles.textSection}>
          <h1>Пожалуйста, подождите</h1>
          <p>Мы очень стараемся обработать вашу заявку как можно быстрее</p>
        </div>
      </div>
    </div>
  );
}
