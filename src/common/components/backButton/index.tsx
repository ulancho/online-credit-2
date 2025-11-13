import classNames from 'classnames';

import backIconUrl from 'Assets/icons/back.svg';
import { useTranslation } from 'Common/i18n';

import styles from './style.module.scss';

type ButtonProps = {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const BackButton: React.FC<ButtonProps> = ({
  className,
  onClick,
  disabled = false,
  type = 'button',
}) => {
  const { t } = useTranslation();

  return (
    <button
      type={type}
      className={classNames(styles.btn, className)}
      onClick={onClick}
      disabled={disabled}
    >
      <img src={backIconUrl} alt="back" />
      <span>{t('common.actions.back')}</span>
    </button>
  );
};

export default BackButton;
