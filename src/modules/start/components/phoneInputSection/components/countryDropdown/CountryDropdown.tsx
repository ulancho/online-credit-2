import { useMemo, useRef } from 'react';

import { useOutsideClick } from '../../hooks/useOutsideClick.ts';

import styles from './CountryDropdown.module.scss';

import type { CountryCode } from '../../../../services/countryCodeService.ts';

type Props = {
  countries: CountryCode[];
  selectedId: number | null | string;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  onSelect: (c: CountryCode) => void;
  isLoading: boolean;
  error?: string | null;
};

export function CountryDropdown({
  countries,
  selectedId,
  isOpen,
  setOpen,
  onSelect,
  isLoading,
  error,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick(ref, () => setOpen(false));

  const selected = useMemo(
    () => countries.find((c) => c.id === selectedId) ?? null,
    [countries, selectedId],
  );

  const selectedIso = selected?.isoCode?.toUpperCase() ?? '--';
  const selectedCode = selected?.code ?? '';

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        type="button"
        className={styles.dropdownButton}
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selected?.flagPath ? (
          <img
            src={selected.flagPath}
            alt={`${selected.country} flag`}
            className={styles.flagMainIcon}
          />
        ) : (
          <span className={styles.flagFallback}>{selectedIso}</span>
        )}
        <span className={styles.mainCodeText}>
          {selectedCode || (isLoading ? 'Загрузка…' : 'Код')}
        </span>
        <svg
          className={`${styles.dropdownArrow} ${isOpen ? styles.dropdownArrowOpen : ''}`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M4 6l4 4 4-4H4z" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu} role="listbox">
          {(!countries.length || error) && (
            <div className={styles.dropdownNotice}>
              {isLoading ? 'Загрузка справочника…' : error || 'Нет доступных стран'}
            </div>
          )}
          {countries.map((country) => {
            const iso = country.isoCode?.toUpperCase() ?? '--';
            const isSelected = selectedId === country.id;
            return (
              <button
                key={country.id}
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  onSelect(country);
                  setOpen(false);
                }}
                role="option"
                aria-selected={isSelected}
              >
                {country.flagPath ? (
                  <img
                    src={country.flagPath}
                    alt={`${country.country} flag`}
                    className={styles.flagIcon}
                  />
                ) : (
                  <span className={styles.flagFallback}>{iso}</span>
                )}
                <div className={styles.countryNameContainer}>
                  <span className={styles.countryName}>{country.country}</span>
                  <span className={styles.codeText}>{country.code}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
