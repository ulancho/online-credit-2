import { type MouseEventHandler, useCallback } from 'react';

import { DropdownItem } from '../dropdownItem/DropdownItem.tsx';

import styles from './DropdownMenu.module.scss';

import type { CountryCode } from 'Modules/startDesktop/services/countryCodeService.ts';

type Props = {
  countries: CountryCode[];
  selectedId: number | null | string;
  isLoading: boolean;
  error?: string | null;
  onSelect: (country: CountryCode) => void;
  onClose: () => void;
};

export function DropdownMenu({
  countries,
  selectedId,
  isLoading,
  error,
  onSelect,
  onClose,
}: Props) {
  const handleSelect = useCallback(
    (country: CountryCode): MouseEventHandler<HTMLButtonElement> =>
      (event) => {
        event.preventDefault();
        onSelect(country);
        onClose();
      },
    [onClose, onSelect],
  );

  const shouldShowNotice = !countries.length || Boolean(error);
  const noticeText = isLoading ? 'Загрузка справочника…' : error || 'Нет доступных стран';

  return (
    <div className={styles.dropdownMenu} role="listbox">
      <div className={styles.inner}>
        {shouldShowNotice && <div className={styles.dropdownNotice}>{noticeText}</div>}
        {countries.map((country) => (
          <DropdownItem
            key={country.id}
            country={country}
            isSelected={selectedId === country.id}
            onSelect={handleSelect(country)}
          />
        ))}
      </div>
    </div>
  );
}
