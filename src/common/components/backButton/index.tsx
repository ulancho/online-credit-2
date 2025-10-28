import classNames from 'classnames';

import backIconUrl from 'Assets/icons/back.svg';

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
  return (
    <button
      type={type}
      className={classNames(styles.btn, className)}
      onClick={onClick}
      disabled={disabled}
    >
      <img src={backIconUrl} alt="back" />
      <span>Вернуться</span>
    </button>
  );
};

export default BackButton;
