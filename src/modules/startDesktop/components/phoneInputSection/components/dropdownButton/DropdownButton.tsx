import classNames from 'classnames';

import styles from './DropdownButton.module.scss';

import type { CountryCode } from 'Modules/startDesktop/services/countryCodeService.ts';
import type { MouseEventHandler } from 'react';

type Props = {
  country: CountryCode | null;
  isOpen: boolean;
  isLoading: boolean;
  onToggle: MouseEventHandler<HTMLButtonElement>;
};

export function DropdownButton({ country, isOpen, isLoading, onToggle }: Props) {
  const iso = country?.isoCode?.toUpperCase() ?? '--';
  const phoneCode = country?.code ?? '';
  const flagSvg = country?.flagSvg;

  return (
    <button
      type="button"
      className={styles.dropdownButton}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      {flagSvg ? (
        <span
          className={styles.flagMainIcon}
          role="img"
          aria-label={`${country?.country} flag`}
          dangerouslySetInnerHTML={{ __html: flagSvg }}
        />
      ) : (
        <span className={styles.flagFallback}>{iso}</span>
      )}
      <span className={styles.mainCodeText}>{phoneCode || (isLoading ? 'Загрузка…' : 'Код')}</span>
      <svg
        className={classNames(styles.dropdownArrow, { [styles.dropdownArrowOpen]: isOpen })}
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M4 6l4 4 4-4H4z" />
      </svg>
    </button>
  );
}
