import { type MouseEventHandler, useMemo, useRef } from 'react';

import { DropdownButton } from 'Modules/startDesktop/components/phoneInputSection/components/dropdownButton/DropdownButton.tsx';
import { DropdownMenu } from 'Modules/startDesktop/components/phoneInputSection/components/dropdownMenu/DropdownMenu.tsx';

import { useOutsideClick } from '../../hooks/useOutsideClick.ts';

import type { CountryCode } from 'Modules/startDesktop/services/countryCodeService.ts';

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

  const selectedCountry = useMemo(
    () => countries.find((country) => country.id === selectedId) ?? null,
    [countries, selectedId],
  );

  const handleToggle: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setOpen(!isOpen);
  };

  return (
    <div ref={ref}>
      <DropdownButton
        country={selectedCountry}
        isOpen={isOpen}
        isLoading={isLoading}
        onToggle={handleToggle}
      />
      {isOpen && (
        <DropdownMenu
          countries={countries}
          selectedId={selectedId}
          isLoading={isLoading}
          error={error}
          onSelect={onSelect}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
