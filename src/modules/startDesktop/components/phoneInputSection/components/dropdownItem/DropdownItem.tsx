import styles from './DropdownItem.module.scss';

import type { CountryCode } from 'Modules/startDesktop/services/countryCodeService.ts';
import type { MouseEventHandler } from 'react';

type Props = {
  country: CountryCode;
  isSelected: boolean;
  onSelect: MouseEventHandler<HTMLButtonElement>;
};

export function DropdownItem({ country, isSelected, onSelect }: Props) {
  const iso = country.isoCode?.toUpperCase() ?? '--';

  return (
    <button
      type="button"
      className={styles.dropdownItem}
      onClick={onSelect}
      role="option"
      aria-selected={isSelected}
    >
      {country.flagPath ? (
        <img src={country.flagPath} alt={`${country.country} flag`} className={styles.flagIcon} />
      ) : (
        <span className={styles.flagFallback}>{iso}</span>
      )}
      <div className={styles.countryNameContainer}>
        <span className={styles.countryName}>{country.country}</span>
        <span className={styles.codeText}>{country.code}</span>
      </div>
    </button>
  );
}
