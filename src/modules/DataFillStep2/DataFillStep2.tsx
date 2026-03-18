import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'Common/components/Button/Button.tsx';
import InputField from 'Common/components/InputField/InputField.tsx';
import layoutStyles from 'Modules/DataFill/shared/components/DataFillLayout.module.scss';
import DataFillLayout from 'Modules/DataFill/shared/components/DataFillLayout.tsx';
import DataFillProgress from 'Modules/DataFill/shared/components/DataFillProgress.tsx';
import PhoneField from 'Modules/DataFillStep2/components/PhoneField/PhoneField.tsx';

export default function DataFillStep2() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [relation, setRelation] = useState('');
  const isFormValid = phone && fullName && relation;

  const handleContinue = () => {
    if (isFormValid) {
      navigate('/data-fill-3');
    }
  };

  return (
    <DataFillLayout
      onBack={() => navigate(-1)}
      progress={<DataFillProgress currentStep={2} />}
      contentClassName={[layoutStyles.content, layoutStyles.contentWithGap].join(' ')}
      footer={
        <Button disabled={!isFormValid} onClick={handleContinue}>
          Продолжить
        </Button>
      }
    >
      <p className={[layoutStyles.groupSubtitle, layoutStyles.subtitlePreLine].join(' ')}>
        Выберите дополнительный контакт.{`\n`}Он понадобится в крайних случаях, если потеряем связь
        с Вами
      </p>
      <PhoneField value={phone} onChange={setPhone} />
      <InputField mainPlaceholder="ФИО" value={fullName} onChange={setFullName} />
      <InputField mainPlaceholder="Кем приходится" value={relation} onChange={setRelation} />
    </DataFillLayout>
  );
}
