import kg from 'Assets/icons/countries/kg.svg';
import ru from 'Assets/icons/countries/ru.svg';
import en from 'Assets/icons/countries/us.svg';

import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher = () => {
  return (
    <div className={styles.container}>
      <ul>
        <li>
          <img src={kg} alt="kg" />
          <span>KG</span>
        </li>
        <li>
          <img src={ru} alt="ru" />
          <span>RU</span>
        </li>
        <li>
          <img src={en} alt="en" />
          <span>EN</span>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
