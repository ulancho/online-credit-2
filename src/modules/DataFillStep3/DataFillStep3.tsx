// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'Common/components/Button/Button.tsx';
// import Select from 'Common/components/Select/Select.tsx';
import layoutStyles from 'Modules/DataFill/shared/components/DataFillLayout.module.scss';
import DataFillLayout from 'Modules/DataFill/shared/components/DataFillLayout.tsx';
import DataFillProgress from 'Modules/DataFill/shared/components/DataFillProgress.tsx';
// import DataFillSelectSheet from 'Modules/DataFill/shared/components/DataFillSelectSheet.tsx';
// import { BRANCHES_BY_REGION, REGIONS } from 'Modules/DataFill/shared/constants.ts';

export default function DataFillStep3() {
  const navigate = useNavigate();
  // const [region, setRegion] = useState('');
  // const [branch, setBranch] = useState('');
  // const [openSheet, setOpenSheet] = useState<'region' | 'branch' | null>(null);
  // const isFormValid = region && branch;
  // const availableBranches = region ? (BRANCHES_BY_REGION[region] ?? []) : [];

  const handleContinue = () => {
    // if (isFormValid) {
    navigate('/data-fill-success');
    // }
  };

  return (
    <DataFillLayout
      onBack={() => navigate(-1)}
      progress={<DataFillProgress currentStep={3} />}
      footer={<Button onClick={handleContinue}>Продолжить</Button>}
    >
      <p className={layoutStyles.groupSubtitle}>Выберите филиал для прикрепления вашей заявки</p>
      {/* <Select
        label="Регион"
        value={region}
        subLabel="Регион"
        filled={!!region}
        onClick={() => setOpenSheet('region')}
      />
      <Select
        label="Филиал"
        value={branch}
        subLabel="Филиал"
        filled={!!branch}
        onClick={() => {
          if (region) {
            setOpenSheet('branch');
          }
        }}
      /> */}
      {/* {openSheet === 'region' ? (
        <DataFillSelectSheet
          title="Выберите регион"
          items={REGIONS}
          onSelect={(value) => {
            setRegion(value);
            setBranch('');
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      ) : null}
      {openSheet === 'branch' ? (
        <DataFillSelectSheet
          title="Выберите филиал"
          description="Это необходимо для прикрепления вашей заявки к конкретному филиалу"
          items={availableBranches}
          variant="fullscreen"
          onSelect={(value) => {
            setBranch(value);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      ) : null} */}
    </DataFillLayout>
  );
}
