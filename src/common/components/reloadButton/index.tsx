import classNames from 'classnames';

import reloadIconUrl from 'Assets/icons/reload.svg';

import styles from './style.module.scss';

type ButtonProps = {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const ReloadButton: React.FC<ButtonProps> = ({
  className,
  onClick,
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={classNames(styles.btn, className)}
      onClick={onClick}
      disabled={disabled}
    >
      <img src={reloadIconUrl} alt="reload" />
      <span>Попробовать еще раз</span>
    </button>
  );
};

export default ReloadButton;
