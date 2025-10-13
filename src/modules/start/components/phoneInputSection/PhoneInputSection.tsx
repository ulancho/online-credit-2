import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  useCountryCodesStore,
  usePhoneAuthStore,
  useStartStore,
} from 'Common/stores/rootStore.tsx';
import { useBoundCountdown } from 'Modules/start/components/phoneInputSection/hooks/useBoundCountdown.ts';

import { DEFAULT_PHONE_DIGITS_LENGTH } from '../../services/countryCodeService.ts';
import styles from '../../styles/index.module.scss';

import { CountryDropdown } from './CountryDropdown';

import type { CountryCode } from '../../services/countryCodeService.ts';

const INITIAL_BOUND_TIME = 113;
const pad2 = (n: number) => n.toString().padStart(2, '0');
const formatTime = (s: number) =>
  `${pad2(Math.floor(Math.max(0, s) / 60))}:${pad2(Math.max(0, s) % 60)}`;

export const PhoneInputSection = observer(function () {
  const countryCodesStore = useCountryCodesStore();
  const { countryCodes, isLoading: ccLoading, hasError, error: ccError } = countryCodesStore;
  const startStore = useStartStore();
  const phoneAuthStore = usePhoneAuthStore();

  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  useEffect(() => {
    void countryCodesStore.fetchCountryCodes();
  }, [countryCodesStore]);

  useEffect(() => {
    if (!countryCodes.length) {
      setSelectedId(null);
      return;
    }
    setSelectedId((prev) => {
      if (prev == null) return countryCodes[0].id;
      return countryCodes.some((c) => c.id === prev) ? prev : countryCodes[0].id;
    });
  }, [countryCodes]);

  const selectedCountry = useMemo<CountryCode | null>(
    () => countryCodes.find((c) => c.id === selectedId) ?? null,
    [countryCodes, selectedId],
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const phoneDigitsLimit = selectedCountry?.digitsCount ?? DEFAULT_PHONE_DIGITS_LENGTH;
  const isFormValid = !!selectedCountry && phoneNumber.trim().length === phoneDigitsLimit;

  // Phone auth state
  const isSubmitting = phoneAuthStore.isLoading;
  const submitError = phoneAuthStore.error;
  const phoneAuthResponse = phoneAuthStore.response;
  const phoneAuthStatus = phoneAuthResponse?.status ?? null;
  const isBoundStatus = phoneAuthStatus === 'BOUND';
  const expiresIn = phoneAuthResponse?.expires_in ?? null;

  const boundTimeLeft = useBoundCountdown(isBoundStatus, expiresIn, INITIAL_BOUND_TIME);
  const boundTimerLabel = useMemo(
    () => (isBoundStatus ? `Истекает через ${formatTime(boundTimeLeft)}` : null),
    [boundTimeLeft, isBoundStatus],
  );

  /* Handlers */
  const handleCountrySelect = useCallback(
    (country: CountryCode) => {
      setSelectedId(country.id);
      setPhoneNumber('');
      phoneAuthStore.resetStatus();
    },
    [phoneAuthStore],
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '');
      setPhoneNumber(value);
      if (phoneAuthStore.isSuccess || phoneAuthStore.error) {
        phoneAuthStore.resetStatus();
      }
    },
    [phoneAuthStore],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid || !selectedCountry) return;
      const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
      void phoneAuthStore.sendPhoneAuth(fullPhoneNumber);
    },
    [isFormValid, selectedCountry, phoneNumber, phoneAuthStore],
  );

  /* Views */
  const renderDefaultContent = () => (
    <form onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <div className={`${styles.inputWrapper} ${submitError ? styles.errorBorder : ''}`}>
          <CountryDropdown
            countries={countryCodes}
            selectedId={selectedId}
            isOpen={isDropdownOpen}
            setOpen={setIsDropdownOpen}
            onSelect={handleCountrySelect}
            isLoading={ccLoading}
            error={ccError}
          />

          <div className={styles.inputContent}>
            <div className={styles.phoneInputWrapper}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={styles.phoneInput}
                placeholder=""
                maxLength={phoneDigitsLimit}
                autoComplete="tel"
                inputMode="numeric"
                disabled={!selectedCountry}
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
                {ccError ?? 'Не удалось загрузить список стран.'}
              </p>
            )}
          </div>
        </div>

        {submitError && (
          <p className={styles.errorMessage} role="alert">
            {submitError}
          </p>
        )}
      </div>

      <div className={styles.buttonSection}>
        <button
          type="submit"
          className={`${styles.submitButton} ${isFormValid ? styles.submitButtonActive : ''} ${isSubmitting ? styles.submitButtonLoading : ''}`}
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
            href={startStore.startInfo?.offerUrl}
            className={styles.privacyLink}
            rel="noreferrer"
          >
            политикой конфиденциальности
          </a>{' '}
          и{' '}
          <a
            target="_blank"
            href={startStore.startInfo?.agreementUrl}
            rel="noreferrer"
            className={styles.privacyLink}
          >
            условиями пользования.
          </a>
        </p>
      </div>
    </form>
  );

  const renderContainerContent = () => {
    switch (phoneAuthStatus) {
      case 'CONFIRMED':
        return (
          <div className={styles.confirmedStatusContainer}>
            <img
              src="/src/assets/icons/confirmed.svg"
              alt="Confirmed"
              className={styles.confirmedIcon}
            />
            <p className={styles.confirmedTitle}>Вход одобрен</p>
            <p className={styles.confirmedSubTitle}>
              Мы перенаправим вас на сайт Ticket.kg <br /> — это займёт всего пару секунд.
            </p>
          </div>
        );
      case 'BOUND':
        return (
          <div className={styles.boundStatusContainer}>
            <span className={styles.loader} aria-label="Ожидание подтверждения входа" />
            <p className={styles.loaderText}>Ждем подтверждения входа</p>
            {boundTimerLabel && (
              <div className={styles.boundTimerSection}>
                <span className={styles.timerText}>{boundTimerLabel}</span>
              </div>
            )}
            <div className={styles.boundActions}>
              <button type="button" className={styles.boundBackButton}>
                <img src="/src/assets/icons/back.svg" alt="back icon" />
                <span>Вернуться</span>
              </button>
              <button type="button" className={styles.boundHelpButton}>
                Я не получил(-а) уведомление
              </button>
            </div>
          </div>
        );
      default:
        return renderDefaultContent();
    }
  };

  return (
    <section className={styles.loginSection}>
      <div className={styles.loginContent}>
        <div className={styles.loginInner}>
          <header className={styles.headerSection}>
            {startStore.startInfo?.logoUrl && (
              <img
                src={startStore.startInfo.logoUrl}
                alt="Partner logo"
                className={styles.logoImage}
              />
            )}
            <div className={styles.titleSection}>
              <h1 className={styles.mainTitle}>Войти через MBANK ID</h1>
              <p className={styles.subtitle}>{startStore.startInfo?.clientName}</p>
            </div>
          </header>
          {renderContainerContent()}
        </div>
      </div>
    </section>
  );
});
