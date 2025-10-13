import { useMemo, useRef } from 'react';

import styles from '../../styles/index.module.scss';

import { useOutsideClick } from './hooks/useOutsideClick';

import type { CountryCode } from '../../services/countryCodeService';

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
    <div className={styles.countryCodeDropdown} ref={ref}>
      <button
        type="button"
        className={styles.countryCodeButton}
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selected?.flagPath ? (
          <img
            src={selected.flagPath}
            alt={`${selected.country} flag`}
            className={styles.flagIcon}
          />
        ) : (
          <span className={styles.flagFallback}>{selectedIso}</span>
        )}
        <span className={styles.codeText}>{selectedCode || (isLoading ? 'Загрузка…' : 'Код')}</span>
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
                <span className={styles.codeText}>{country.code}</span>
                <span>{country.country}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
