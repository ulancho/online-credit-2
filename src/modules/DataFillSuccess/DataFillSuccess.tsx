import { useNavigate } from 'react-router-dom';

import SuccessIcon from 'Assets/icons/success.svg?react';
import Button from 'Common/components/Button/Button.tsx';
import layoutStyles from 'Modules/DataFill/shared/components/DataFillLayout.module.scss';
import DataFillLayout from 'Modules/DataFill/shared/components/DataFillLayout.tsx';

import styles from './DataFillSuccess.module.scss';

export default function DataFillSuccess() {
  const navigate = useNavigate();

  return (
    <DataFillLayout
      onBack={() => navigate(-1)}
      title=""
      contentClassName={[layoutStyles.content, layoutStyles.centeredContent].join(' ')}
      footer={<Button onClick={() => navigate('/credit-calculator')}>В кабинет кредитов</Button>}
    >
      <SuccessIcon />
      <div className={styles.textBlock}>
        <h1 className={styles.title}>Кредит оформлен</h1>
        <p className={styles.description}>Ожидайте поступления денежных средств</p>
      </div>
    </DataFillLayout>
  );
}
