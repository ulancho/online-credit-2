import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'Common/i18n';

import styles from './LanguageSwitcher.module.scss';

export const LanguageSwitcher = () => {
  const { language, languages, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const node = containerRef.current;
      if (!node) {
        return;
      }
      if (!node.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const currentLanguage = languages.find((item) => item.code === language) ?? languages[0];

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button
        type="button"
        className={classNames(styles.trigger, isOpen && styles.triggerOpen)}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('common.languageSwitcher.label')}
      >
        <span className={styles.triggerLabel}>
          {currentLanguage?.label ?? language.toUpperCase()}
        </span>
        <span className={styles.triggerArrow} aria-hidden="true">
          ▼
        </span>
      </button>
      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {languages.map((item) => {
            const isActive = item.code === language;
            return (
              <li key={item.code} className={styles.dropdownItem}>
                <button
                  type="button"
                  className={classNames(styles.option, isActive && styles.optionActive)}
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className={styles.optionLabel}>{item.label}</span>
                  {isActive && (
                    <span className={styles.optionMarker} aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
