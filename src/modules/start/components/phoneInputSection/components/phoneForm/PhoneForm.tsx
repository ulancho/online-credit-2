import { type ChangeEvent, type FormEvent, useState } from 'react';

import { CountryDropdown } from '../countryDropdown/CountryDropdown';

import styles from './PhoneForm.module.scss';

import type { CountryCode } from '../../../../services/countryCodeService';

type Props = {
  countryCodes: CountryCode[];
  selectedId: number | string | null;
  onCountrySelect: (country: CountryCode) => void;
  hasError: boolean;
  error?: string | null;
  isLoading: boolean;
  phoneNumber: string;
  onPhoneChange: (event: ChangeEvent<HTMLInputElement>) => void;
  phoneDigitsLimit: number;
  isFormValid: boolean;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent) => void;
  submitError?: string | null;
  privacyPolicyUrl?: string | null;
  termOfServiceUrl?: string | null;
  isCountrySelected: boolean;
};

export function PhoneForm({
  countryCodes,
  selectedId,
  onCountrySelect,
  hasError,
  error,
  isLoading,
  phoneNumber,
  onPhoneChange,
  phoneDigitsLimit,
  isFormValid,
  isSubmitting,
  onSubmit,
  submitError,
  privacyPolicyUrl,
  termOfServiceUrl,
  isCountrySelected,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.inputContainer}>
        <div className={`${styles.inputWrapper} ${submitError ? styles.errorBorder : ''}`}>
          <CountryDropdown
            countries={countryCodes}
            selectedId={selectedId}
            isOpen={isDropdownOpen}
            setOpen={setIsDropdownOpen}
            onSelect={onCountrySelect}
            isLoading={isLoading}
            error={error}
          />

          <div className={styles.inputContent}>
            <div className={styles.phoneInputWrapper}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={onPhoneChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={styles.phoneInput}
                placeholder=""
                maxLength={phoneDigitsLimit}
                autoComplete="tel"
                inputMode="numeric"
                disabled={!isCountrySelected}
                aria-invalid={!!submitError}
              />
              <label
                className={`${styles.inputLabel} ${isFocused || phoneNumber ? styles.inputLabelHidden : ''}`}
              >
                Номер телефона
              </label>
            </div>
            {hasError && (
              <p className={styles.errorMessage} role="alert">
                {error ?? 'Не удалось загрузить список стран.'}
              </p>
            )}
          </div>
        </div>
        <div className={styles.errorMessageContainer} aria-live="assertive">
          <p
            className={`${styles.errorMessage} ${submitError ? '' : styles.errorMessageHidden}`}
            role={submitError ? 'alert' : undefined}
            aria-hidden={!submitError}
          >
            {submitError ? submitError : ' '}
          </p>
        </div>
      </div>

      <div className={styles.buttonSection}>
        <button
          type="submit"
          className={`${styles.submitButton} ${isFormValid ? styles.submitButtonActive : ''} ${
            isSubmitting ? styles.submitButtonLoading : ''
          }`}
          disabled={!isFormValid || isSubmitting}
        >
          <span className={`${styles.buttonText} ${isFormValid ? styles.buttonTextActive : ''}`}>
            Далее
          </span>
        </button>

        <p className={styles.privacyText}>
          Прежде чем начать работу с приложением &quot;Ticket&quot;, вы можете ознакомиться с его{' '}
          <a
            target="_blank"
            href={privacyPolicyUrl ?? undefined}
            className={styles.privacyLink}
            rel="noreferrer"
          >
            политикой конфиденциальности
          </a>{' '}
          и{' '}
          <a
            target="_blank"
            href={termOfServiceUrl ?? undefined}
            rel="noreferrer"
            className={styles.privacyLink}
          >
            условиями пользования.
          </a>
        </p>
      </div>
    </form>
  );
}
