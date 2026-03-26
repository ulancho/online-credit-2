import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'Common/components/Button/Button.tsx';
import InputField from 'Common/components/InputField/InputField.tsx';
import Select from 'Common/components/Select/Select.tsx';
import layoutStyles from 'Modules/DataFill/shared/components/DataFillLayout.module.scss';
import DataFillLayout from 'Modules/DataFill/shared/components/DataFillLayout.tsx';
import DataFillProgress from 'Modules/DataFill/shared/components/DataFillProgress.tsx';
import DataFillSelectSheet from 'Modules/DataFill/shared/components/DataFillSelectSheet.tsx';
import { INSURANCE_COMPANIES, REGIONS, SETTLEMENTS } from 'Modules/DataFill/shared/constants.ts';

import styles from './DataFillStep1.module.scss';

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
    <DataFillLayout
      onBack={() => navigate(-1)}
      progress={<DataFillProgress currentStep={1} />}
      contentClassName={layoutStyles.content}
      footer={
        <Button disabled={!isFormValid} onClick={handleContinue}>
          Продолжить
        </Button>
      }
    >
      <p className={layoutStyles.groupSubtitle}>Обновите данные о фактическом адресе проживания</p>
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
      {openSheet === 'region' ? (
        <DataFillSelectSheet
          title="Выберите регион"
          items={REGIONS}
          onSelect={(value) => {
            setRegion(value);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      ) : null}
      {openSheet === 'settlement' ? (
        <DataFillSelectSheet
          title="Выберите населённый пункт"
          items={SETTLEMENTS}
          onSelect={(value) => {
            setSettlement(value);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      ) : null}
      {openSheet === 'insurance' ? (
        <DataFillSelectSheet
          title="Выберите страховую компанию"
          items={INSURANCE_COMPANIES}
          onSelect={(value) => {
            setInsurance(value);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      ) : null}
    </DataFillLayout>
  );
}
