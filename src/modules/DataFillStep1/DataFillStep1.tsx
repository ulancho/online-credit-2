import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'Common/components/Button/Button.tsx';
import InputField from 'Common/components/InputField/InputField.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';
import Select from 'Common/components/Select/Select.tsx';

import styles from './DataFillStep1.module.scss';

const REGIONS = [
  'Бишкек',
  'Чуйская область',
  'Иссык-Кульская область',
  'Нарынская область',
  'Джалал-Абадская область',
  'Баткенская область',
  'Ошская область',
  'Таласская область',
];

const INSURANCE_COMPANIES = ['Кыргызстан', 'ГАРАНТ', 'Ак-Жол', 'Кыргыз Жашоо'];

interface BottomSheetProps {
  title: string;
  items: string[];
  onSelect: (item: string) => void;
  onClose: () => void;
}

function BottomSheet({ title, items, onSelect, onClose }: BottomSheetProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.bottomSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sheetHandle} />
        <div className={styles.sheetHeader}>
          <h2 className={styles.sheetTitle}>{title}</h2>
        </div>
        <div className={styles.sheetList}>
          {items.map((item) => (
            <button key={item} className={styles.sheetItem} onClick={() => onSelect(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DataFillStep1() {
  const navigate = useNavigate();
  const [region, setRegion] = useState('');
  const [settlement, setSettlement] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [insurance, setInsurance] = useState('');
  const [openSheet, setOpenSheet] = useState<'region' | 'settlement' | 'insurance' | null>(null);
  const isFormValid = region && settlement && street && house && insurance;

  const handleContinue = () => {
    if (isFormValid) {
      navigate('/data-fill-2');
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
          <div className={`${styles.stepDot} ${styles.stepDotActive}`}>1</div>
          <div className={styles.progressLine} />
          <div className={`${styles.stepDot} ${styles.stepDotDisabled}`}>2</div>
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.groupSubtitle}>Обновите данные о фактическом адресе проживания</p>
        <Select
          label="Регион"
          value={region}
          subLabel="Регион"
          filled={!!region}
          onClick={() => setOpenSheet('region')}
        />
        <Select
          label="Населённый пункт"
          value={settlement}
          subLabel="Населённый пункт"
          filled={!!settlement}
          onClick={() => setOpenSheet('settlement')}
        />
        <div className={styles.inputWrapper}>
          <InputField
            mainPlaceholder="Улица"
            secondaryPlaceholder="Улица"
            value={street}
            onChange={setStreet}
          />
        </div>
        <div className={styles.inputWrapper}>
          <InputField
            mainPlaceholder="Дом"
            secondaryPlaceholder="Дом"
            value={house}
            onChange={setHouse}
          />
        </div>
        <div className={styles.inputWrapper}>
          <InputField
            mainPlaceholder="Квартира"
            secondaryPlaceholder="Квартира"
            value={apartment}
            onChange={setApartment}
          />
        </div>
        <Select
          label="Страховая компания"
          value={insurance}
          subLabel="Страховая компания"
          filled={!!insurance}
          onClick={() => setOpenSheet('insurance')}
        />
      </div>
      <div className={styles.footer}>
        <Button disabled={!isFormValid} onClick={handleContinue}>
          Продолжить
        </Button>
      </div>
      {openSheet === 'region' && (
        <BottomSheet
          title="Выберите регион"
          items={REGIONS}
          onSelect={(val) => {
            setRegion(val);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      )}
      {openSheet === 'settlement' && (
        <BottomSheet
          title="Выберите населённый пункт"
          items={['Бишкек', 'Ош', 'Джалал-Абад', 'Каракол', 'Токмок', 'Балыкчи']}
          onSelect={(val) => {
            setSettlement(val);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      )}
      {openSheet === 'insurance' && (
        <BottomSheet
          title="Выберите страховую компанию"
          items={INSURANCE_COMPANIES}
          onSelect={(val) => {
            setInsurance(val);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      )}
    </div>
  );
}
