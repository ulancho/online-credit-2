import styles from './Button.module.css';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'yellow' | 'text-accent' | 'text-danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = true,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const variantClass =
    variant === 'yellow'
      ? styles.yellow
      : variant === 'text-accent'
        ? styles.textAccent
        : variant === 'text-danger'
          ? styles.textDanger
          : styles.primary;

  return (
    <button
      type={type}
      className={`${styles.buttonBase} ${variantClass} ${fullWidth ? styles.fullWidth : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
