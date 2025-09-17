import { useState, useRef, useEffect } from 'react';

import styles from '../styles/index.module.scss';

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

const countryCodes: CountryCode[] = [
  {
    code: '+996',
    country: 'Кыргызстан',
    flag: 'https://api.builder.io/api/v1/image/assets/TEMP/466a5ad7eef554b2ba7e55bf1b2d3f397f0a3f7c?placeholderIfAbsent=true&apiKey=a499a3280c014db59e8ee97408890ce2',
  },
  {
    code: '+7',
    country: 'Россия',
    flag: 'https://api.builder.io/api/v1/image/assets/TEMP/466a5ad7eef554b2ba7e55bf1b2d3f397f0a3f7c?placeholderIfAbsent=true&apiKey=a499a3280c014db59e8ee97408890ce2',
  },
  {
    code: '+1',
    country: 'США',
    flag: 'https://api.builder.io/api/v1/image/assets/TEMP/466a5ad7eef554b2ba7e55bf1b2d3f397f0a3f7c?placeholderIfAbsent=true&apiKey=a499a3280c014db59e8ee97408890ce2',
  },
  {
    code: '+44',
    country: 'Великобритания',
    flag: 'https://api.builder.io/api/v1/image/assets/TEMP/466a5ad7eef554b2ba7e55bf1b2d3f397f0a3f7c?placeholderIfAbsent=true&apiKey=a499a3280c014db59e8ee97408890ce2',
  },
];

function PhoneInputSection() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      // onSubmit?.(selectedCountry.code + phoneNumber);
    }
  };

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  const isFormValid = phoneNumber.trim().length > 0;

  return (
    <section className={styles.loginSection}>
      <div className={styles.loginContent}>
        <div className={styles.loginInner}>
          <header className={styles.headerSection}>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/e5064fa22a0f919f22b776b0ae51cb319c0571d0?placeholderIfAbsent=true&apiKey=a499a3280c014db59e8ee97408890ce2"
              alt="MBANK ID Logo"
              className={styles.logoImage}
            />
            <div className={styles.titleSection}>
              <h1 className={styles.mainTitle}>Войти через MBANK ID</h1>
              <p className={styles.subtitle}>Ticket KG</p>
            </div>
          </header>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <div className={styles.countryCodeDropdown} ref={dropdownRef}>
                  <button
                    type="button"
                    className={styles.countryCodeButton}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <img
                      src={selectedCountry.flag}
                      alt={`${selectedCountry.country} flag`}
                      className={styles.flagIcon}
                    />
                    <span className={styles.codeText}>{selectedCountry.code}</span>
                    <svg
                      className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.dropdownArrowOpen : ''}`}
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M4 6l4 4 4-4H4z" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className={styles.dropdownMenu} role="listbox">
                      {countryCodes.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          className={styles.dropdownItem}
                          onClick={() => handleCountrySelect(country)}
                          role="option"
                          aria-selected={selectedCountry.code === country.code}
                        >
                          <img
                            src={country.flag}
                            alt={`${country.country} flag`}
                            className={styles.flagIcon}
                          />
                          <span className={styles.codeText}>{country.code}</span>
                          <span>{country.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

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
                      maxLength={9}
                      autoComplete="tel"
                    />
                    <label
                      className={`${styles.inputLabel} ${isFocused || phoneNumber ? styles.inputLabelFocused : ''}`}
                    >
                      Номер телефона
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.buttonSection}>
              <button
                type="submit"
                className={`${styles.submitButton} ${isFormValid ? styles.submitButtonActive : ''}`}
                disabled={!isFormValid}
              >
                <span
                  className={`${styles.buttonText} ${isFormValid ? styles.buttonTextActive : ''}`}
                >
                  Далее
                </span>
              </button>
              <p className={styles.privacyText}>
                Прежде чем начать работу с приложением &quot;Ticket&quot;, вы можете ознакомиться с
                его <span className={styles.privacyLink}>политикой конфиденциальности</span> и{' '}
                <span className={styles.privacyLink}>условиями пользования.</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default PhoneInputSection;
