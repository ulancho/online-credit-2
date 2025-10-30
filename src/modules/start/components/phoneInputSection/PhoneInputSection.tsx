import { observer } from 'mobx-react-lite';
import { type ChangeEvent, type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import {
  useCountryCodesStore,
  usePhoneAuthStore,
  useStartStore,
} from 'Common/stores/rootStore.tsx';
import { formatMMSS, getTargetMs } from 'Common/utils/time.ts';
import { BoundStatus } from 'Modules/start/components/phoneInputSection/components/boundStatus/BoundStatus.tsx';
import { ConfirmedStatus } from 'Modules/start/components/phoneInputSection/components/confirmedStatus/ConfirmedStatus.tsx';
import { DeniedStatus } from 'Modules/start/components/phoneInputSection/components/deniedStatus/DeniedStatus.tsx';
import { ExpiredStatus } from 'Modules/start/components/phoneInputSection/components/expiredStatus/ExpiredStatus.tsx';
import { Header } from 'Modules/start/components/phoneInputSection/components/header/Header.tsx';
import { PhoneForm } from 'Modules/start/components/phoneInputSection/components/phoneForm/PhoneForm.tsx';
import {
  type CountryCode,
  DEFAULT_PHONE_DIGITS_LENGTH,
} from 'Modules/start/services/countryCodeService.ts';

import styles from './PhoneInputSection.module.scss';

export const PhoneInputSection = observer(function () {
  const countryCodesService = useCountryCodesStore();
  const { countryCodes, isLoading: ccLoading, hasError, error: ccError } = countryCodesService;
  const startService = useStartStore();
  const phoneAuthService = usePhoneAuthStore();

  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const selectedCountry = useMemo<CountryCode | null>(
    () => countryCodes.find((c) => c.id === selectedId) ?? null,
    [countryCodes, selectedId],
  );

  const phoneDigitsLimit = selectedCountry?.digitsCount ?? DEFAULT_PHONE_DIGITS_LENGTH;
  const isFormValid = !!selectedCountry && phoneNumber.trim().length === phoneDigitsLimit;
  // Phone auth state
  const isSubmitting = phoneAuthService.isLoading;
  const submitError = phoneAuthService.error;
  const phoneAuthResponse = phoneAuthService.response;
  const phoneAuthStatus = phoneAuthResponse?.status ?? null;
  const isBoundStatus = phoneAuthStatus === 'BOUND';
  const expiresIn = phoneAuthResponse?.expires_in;

  useEffect(() => {
    console.log('start');
    if (!isBoundStatus || !expiresIn) {
      setSecondsLeft(null);
      return;
    }

    const targetMs = getTargetMs(expiresIn);
    if (targetMs == null) {
      setSecondsLeft(0);
      return;
    }

    const calc = () => Math.max(0, Math.floor((targetMs - Date.now()) / 1000));

    setSecondsLeft(calc());

    const id = window.setInterval(() => {
      setSecondsLeft(() => {
        const next = calc();
        if (next === 0) {
          window.clearInterval(id);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [isBoundStatus, expiresIn]);

  useEffect(() => {
    void countryCodesService.fetchCountryCodes();
  }, [countryCodesService]);

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

  const boundTimerLabel = secondsLeft != null ? `Истекает через ${formatMMSS(secondsLeft)}` : null;

  const handleCountrySelect = useCallback(
    (country: CountryCode) => {
      setSelectedId(country.id);
      setPhoneNumber('');
      phoneAuthService.resetStatus();
    },
    [phoneAuthService],
  );

  const handlePhoneChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '');
      setPhoneNumber(value);
      if (phoneAuthService.isSuccess || phoneAuthService.error) {
        phoneAuthService.resetStatus();
      }
    },
    [phoneAuthService],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!isFormValid || !selectedCountry) return;
      const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
      void phoneAuthService.sendPhoneAuth(fullPhoneNumber);
    },
    [isFormValid, selectedCountry, phoneNumber, phoneAuthService],
  );

  const handleBack = () => {
    phoneAuthService.resetStatus();
  };

  const renderContent = () => {
    switch (phoneAuthStatus) {
      case 'CONFIRMED':
        return <ConfirmedStatus />;
      case 'BOUND':
        return <BoundStatus timerLabel={boundTimerLabel} onBack={handleBack} />;
      case 'DENIED':
        return <DeniedStatus onBack={handleBack} />;
      case 'EXPIRED':
        return <ExpiredStatus onBack={handleBack} />;
      default:
        return (
          <PhoneForm
            countryCodes={countryCodes}
            selectedId={selectedId}
            onCountrySelect={handleCountrySelect}
            hasError={hasError}
            error={ccError}
            isLoading={ccLoading}
            phoneNumber={phoneNumber}
            onPhoneChange={handlePhoneChange}
            phoneDigitsLimit={phoneDigitsLimit}
            isFormValid={isFormValid}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitError={submitError}
            offerUrl={startService.startInfo?.offerUrl}
            agreementUrl={startService.startInfo?.agreementUrl}
            isCountrySelected={!!selectedCountry}
          />
        );
    }
  };

  return (
    <section className={styles.loginSection}>
      <div className={styles.loginContent}>
        <div className={styles.loginInner}>
          <Header
            logoUrl={startService.startInfo?.logoUrl}
            clientName={startService.startInfo?.clientName}
          />
          {renderContent()}
        </div>
      </div>
    </section>
  );
});
