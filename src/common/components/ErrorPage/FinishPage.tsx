import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';

import SadIcon from 'Assets/icons/sad-circle.svg?react';
import SuccessIcon from 'Assets/icons/success.svg?react';
import { exitApp } from 'Common/api/common.ts';

import styles from './FinishPage.module.scss';

import type { ElementType } from 'react';

const ICONS: Record<string, ElementType> = {
  sad: SadIcon,
  success: SuccessIcon,
};

const FinishPage = () => {
  const location = useLocation();
  const state = location.state;

  const title = state?.title ?? 'Что-то пошло не так';
  const description = state?.description ?? 'Пожалуйста, попробуйте позже';
  const Icon = ICONS[state?.icon ?? ''] ?? SadIcon;
  const btnTitle = state?.btnTitle ?? 'На главную';

  const closeWebView = () => {
    exitApp().then((res) => console.log(res.status));
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <Icon />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
      <div className={styles.buttonSection}>
        <button onClick={closeWebView} className={styles.continueButton}>
          {btnTitle}
        </button>
      </div>
    </div>
  );
};

export default observer(FinishPage);
