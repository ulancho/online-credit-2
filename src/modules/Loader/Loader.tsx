import Lottie from 'lottie-react';

import loaderAnimation from 'Assets/loader.json';

import styles from './Loader.module.scss';

export default function Loader() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.lottie}>
          <Lottie animationData={loaderAnimation} loop autoplay />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            12%
          </div>
        </div>
      </div>
    </div>
  );
}
