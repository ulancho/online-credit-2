import classNames from 'classnames';

import kg from 'Assets/icons/countries/kg.svg';
import ru from 'Assets/icons/countries/ru.svg';
import en from 'Assets/icons/countries/us.svg';
import { useTranslation } from 'Common/i18n';

import styles from './LanguageSwitcher.module.scss';

const flags: Record<string, string> = {
  kg,
  ru,
  en,
};

const LanguageSwitcher = () => {
  const { language, languages, setLanguage } = useTranslation();

  return (
    <div className={styles.container}>
      <ul>
        {languages.map((item) => {
          const isActive = item.code === language;
          return (
            <li
              key={item.code}
              className={classNames(isActive && styles.active)}
              role="option"
              onClick={() => {
                setLanguage(item.code);
              }}
            >
              <img src={flags[item.code]} alt={item.code} />
              <span className={styles.optionLabel}>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
