import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDataFillStep1Store, useLoanConfirmationStore } from '@/common/stores/rootStore';
import Button from 'Common/components/Button/Button.tsx';
import InputField from 'Common/components/InputField/InputField.tsx';
import Select from 'Common/components/Select/Select.tsx';
import layoutStyles from 'Modules/DataFill/shared/components/DataFillLayout.module.scss';
import DataFillLayout from 'Modules/DataFill/shared/components/DataFillLayout.tsx';
import DataFillProgress from 'Modules/DataFill/shared/components/DataFillProgress.tsx';
import DataFillSelectSheet from 'Modules/DataFill/shared/components/DataFillSelectSheet.tsx';

import styles from './DataFillStep1.module.scss';

import type { Area } from '../DataFill/models/area';

const DataFillStep1 = () => {
  const dataFillStep1Store = useDataFillStep1Store();
  const navigate = useNavigate();
  const [area, setArea] = useState<Area | null>(null);
  const [region, setRegion] = useState<Area | null>(null);
  const [settlement, setSettlement] = useState<Area | null>(null);
  const [factStreet, setFactStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [openSheet, setOpenSheet] = useState<'area' | 'region' | 'settlement' | 'insurance' | null>(
    null,
  );
  const isFormValid = region && settlement && factStreet && house;

  const loanConfirmationStore = useLoanConfirmationStore();

  const handleContinue = () => {
    if (isFormValid) {
      navigate('/data-fill-2', {
        state: {
          dataFirstStep: JSON.stringify({
            factOblast: area?.code,
            factRaion: region.code,
            factCity: settlement.code,
            factStreet,
            factAddress: `${house}, ${apartment}`,
          }),
        },
      });
    }
    dataFillStep1Store.setFormData({ area, region, settlement, factStreet, house, apartment });
  };

  useEffect(() => {
    if (dataFillStep1Store.formData) {
      const { area, region, settlement, factStreet, house, apartment } =
        dataFillStep1Store.formData;
      setArea(area);
      setRegion(region);
      setSettlement(settlement);
      setFactStreet(factStreet);
      setHouse(house);
      setApartment(apartment);
    }

    const loadData = async () => {
      await dataFillStep1Store.getAreas();
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (area?.code) {
        await dataFillStep1Store.getDistricts(area.code);
      }
    };

    loadData();
  }, [area]);

  useEffect(() => {
    const loadData = async () => {
      if (region?.code) {
        await dataFillStep1Store.getCities(region.code);
      }
    };

    loadData();
  }, [region]);

  return (
    <DataFillLayout
      onBack={() => navigate(-1)}
      progress={
        <DataFillProgress
          currentStep={1}
          totalSteps={loanConfirmationStore.dataSubmitCredit?.type === 'offline' ? 3 : 2}
        />
      }
      contentClassName={layoutStyles.content}
      footer={
        <Button disabled={!isFormValid} onClick={handleContinue}>
          Продолжить
        </Button>
      }
    >
      <p className={layoutStyles.groupSubtitle}>Обновите данные о фактическом адресе проживания</p>
      <Select
        label="Область"
        value={area ? area.name : ''}
        subLabel="Область"
        filled={area ? !!area.name : false}
        onClick={() => setOpenSheet('area')}
      />
      <Select
        label="Регион"
        value={region ? region.name : ''}
        subLabel="Регион"
        filled={region ? !!region : false}
        onClick={() => setOpenSheet('region')}
        disabled={!area}
      />
      <Select
        label="Населённый пункт"
        value={settlement ? settlement.name : ''}
        subLabel="Населённый пункт"
        filled={settlement ? !!settlement : false}
        onClick={() => setOpenSheet('settlement')}
        disabled={!region}
      />
      <div className={styles.inputWrapper}>
        <InputField
          mainPlaceholder="Улица"
          secondaryPlaceholder="Улица"
          value={factStreet}
          onChange={setFactStreet}
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
      {openSheet === 'area' ? (
        <DataFillSelectSheet
          title="Выберите область"
          items={dataFillStep1Store.areasData}
          onSelect={(value: { name: string; code: string }) => {
            setArea(value);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      ) : null}
      {openSheet === 'region' ? (
        <DataFillSelectSheet
          title="Выберите регион"
          items={dataFillStep1Store.districtsData}
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
          items={dataFillStep1Store.citiesData}
          onSelect={(value) => {
            setSettlement(value);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      ) : null}
    </DataFillLayout>
  );
};

export default observer(DataFillStep1);
