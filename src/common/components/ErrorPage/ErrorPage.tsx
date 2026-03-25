import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';

import SadIcon from 'Assets/icons/sad-circle.svg?react';

import styles from './ErrorPage.module.scss';

import type { ElementType } from 'react';

const ICONS: Record<string, ElementType> = {
  sad: SadIcon,
};

const ErrorPage = () => {
  const location = useLocation();
  const state = location.state;

  const title = state?.title ?? 'Что-то пошло не так';
  const description = state?.description ?? 'Пожалуйста, попробуйте позже';
  const Icon = ICONS[state?.icon ?? ''] ?? SadIcon;

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
        <button className={styles.continueButton}>На главную</button>
      </div>
    </div>
  );
};

export default observer(ErrorPage);
