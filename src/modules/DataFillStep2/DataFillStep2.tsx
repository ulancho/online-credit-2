import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'Common/components/Button/Button.tsx';
import InputField from 'Common/components/InputField/InputField.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';
import PhoneField from 'Modules/DataFillStep2/components/PhoneField/PhoneField.tsx';

import styles from './DataFillStep2.module.scss';

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="#129958" />
    <path
      d="M9 14.8L12.1429 18L20 10"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function DataFillStep2() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [relation, setRelation] = useState('');
  const isFormValid = phone && fullName && relation;

  const handleContinue = () => {
    if (isFormValid) {
      navigate('/data-fill-success');
    }
  };

  return (
    <div id="page" className={styles.page}>
      <NavBar onBack={() => navigate(-1)} />
      <div className={styles.titleSection}>
        <h1 className={styles.pageTitle}>Осталось заполнить данные для завершения заявки</h1>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressStep}>
          <CheckIcon />
          <div className={`${styles.progressLine} ${styles.progressLineFilled}`} />
          <div className={`${styles.stepDot} ${styles.stepDotActive}`}>2</div>
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.groupSubtitle}>
          Выберите дополнительный контакт.{'\n'}Он понадобится в крайних случаях, если потеряем
          связь с Вами
        </p>
        <PhoneField value={phone} onChange={setPhone} />
        <InputField
          mainPlaceholder="ФИО"
          secondaryPlaceholder="ФИО"
          value={fullName}
          onChange={setFullName}
        />
        <InputField
          mainPlaceholder="Кем приходится"
          secondaryPlaceholder="Кем приходится"
          value={relation}
          onChange={setRelation}
        />
      </div>
      <div className={styles.footer}>
        <Button disabled={!isFormValid} onClick={handleContinue}>
          Продолжить
        </Button>
      </div>
    </div>
  );
}
