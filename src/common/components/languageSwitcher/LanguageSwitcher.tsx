import classNames from 'classnames';

import kg from 'Assets/icons/countries/kg.svg?raw';
import ru from 'Assets/icons/countries/ru.svg?raw';
import en from 'Assets/icons/countries/us.svg?raw';
import { useTranslation } from 'Common/i18n';

import styles from './LanguageSwitcher.module.scss';

import type { FC, HTMLAttributes } from 'react';

type FlagIconComponent = FC<HTMLAttributes<HTMLSpanElement>>;

const createFlagIcon = (svgMarkup: string): FlagIconComponent => {
  const FlagIcon: FlagIconComponent = ({ className, 'aria-label': ariaLabel, ...rest }) => (
    <span
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
      {...rest}
    />
  );

  return FlagIcon;
};

const flags: Record<string, FlagIconComponent> = {
  kg: createFlagIcon(kg),
  ru: createFlagIcon(ru),
  en: createFlagIcon(en),
};

const LanguageSwitcher = () => {
  const { language, languages, setLanguage } = useTranslation();

  return (
    <div className={styles.container}>
      <ul>
        {languages.map((item) => {
          const isActive = item.code === language;
          const FlagIcon = flags[item.code];

          return (
            <li
              key={item.code}
              className={classNames(isActive && styles.active)}
              role="option"
              onClick={() => {
                setLanguage(item.code);
              }}
            >
              {FlagIcon && <FlagIcon className={styles.flag} aria-label={item.code} />}
              <span className={styles.optionLabel}>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
