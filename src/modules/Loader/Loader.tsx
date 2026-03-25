import Lottie from 'lottie-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import loaderAnimation from 'Assets/lottie/loader.json';
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import { useLoanProcessingFlow } from './hooks/useLoanProcessingFlow.ts';
import styles from './Loader.module.scss';

const DENIED_ROUTE = '/declined';
const WAITING_ROUTE = '/loan-conditions';
const SUCCESS_ROUTE = '/application-success';
const HOME_ROUTE = '/credit-calculator';

export default function Loader() {
  const navigate = useNavigate();

  // переход на страницу отказа, без рассширенной анкеты если статус: DENIED
  const navigateDenied = useCallback(() => {
    navigate(DENIED_ROUTE, { replace: true });
  }, [navigate]);

  const navigateWaitingFlow = useCallback(() => {
    navigate(WAITING_ROUTE, { replace: true });
  }, [navigate]);

  const navigateSuccess = useCallback(() => {
    navigate(SUCCESS_ROUTE, { replace: true });
  }, [navigate]);

  const navigateHomeOnError = useCallback(() => {
    navigate(HOME_ROUTE, { replace: true });
  }, [navigate]);

  const { progress } = useLoanProcessingFlow({
    onDenied: navigateDenied,
    onWaiting: navigateWaitingFlow,
    onFinalSuccess: navigateSuccess,
    onErrorToHome: navigateHomeOnError,
  });

  //для кнопки назад, по умолчанию не разрешаем назад выйти пока загрузка не завершится
  const handleBlockedBack = useCallback(() => {
    return;
  }, []);

  return (
    <div className={styles.page}>
      <NavBar onBack={handleBlockedBack} disableBack />
      <div className={styles.content}>
        <div className={styles.lottieSection}>
          <Lottie
            animationData={loaderAnimation}
            className={styles.loaderAnimation}
            loop
            autoplay
          />
          <div className={styles.loaderCounter}>{progress}%</div>
        </div>
        <div className={styles.textSection}>
          <h1>Пожалуйста, подождите</h1>
          <p>Мы очень стараемся обработать вашу заявку как можно быстрее</p>
        </div>
      </div>
    </div>
  );
}
