import { useNavigate } from 'react-router-dom';

import SuccessIcon from 'Assets/icons/success.svg?react';
import Button from 'Common/components/Button/Button.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';

import styles from './DataFillSuccess.module.scss';

export default function DataFillSuccess() {
  const navigate = useNavigate();

  return (
    <div id="page" className={styles.page}>
      <NavBar onBack={() => navigate(-1)} />
      <div className={styles.content}>
        <SuccessIcon />
        <div className={styles.textBlock}>
          <h1 className={styles.title}>Кредит оформлен</h1>
          <p className={styles.description}>Ожидайте поступления денежных средств</p>
        </div>
      </div>
      <div className={styles.footer}>
        <Button onClick={() => navigate('/credit-calculator')}>В кабинет кредитов</Button>
      </div>
    </div>
  );
}
