import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Spinner from '@/common/components/Spinner/Spinner';
import { useTranslation } from '@/common/i18n';
import {
  useDataFillStep2Store,
  useLoanConditionsStore,
  useLoanConfirmationStore,
} from '@/common/stores/rootStore';
import Button from 'Common/components/Button/Button.tsx';
import InputField from 'Common/components/InputField/InputField.tsx';
import layoutStyles from 'Modules/DataFill/shared/components/DataFillLayout.module.scss';
import DataFillLayout from 'Modules/DataFill/shared/components/DataFillLayout.tsx';
import DataFillProgress from 'Modules/DataFill/shared/components/DataFillProgress.tsx';
import PhoneField from 'Modules/DataFillStep2/components/PhoneField/PhoneField.tsx';

import { Modal } from '../LoanConditions/components/Modal';

import type { SubmitApplicationType } from './services/DataFillStep2Service';

const DataFillStep2 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const [active, setActive] = useState<boolean | null>(null);
  const [additionalPhoneNumber, setAdditionalPhoneNumber] = useState('');
  const [relativeFullName, setRelativeFullName] = useState('');
  const [relationToBorrower, setRelationToBorrower] = useState('');
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const isFormValid = additionalPhoneNumber && relativeFullName && relationToBorrower;

  const dataFillStep2Store = useDataFillStep2Store();
  const loanConfirmationStore = useLoanConfirmationStore();
  const loanConditionsStore = useLoanConditionsStore();

  const open = (val: boolean) => setActive(val);
  const close = () => setActive(null);

  const handleContinue = async () => {
    const { factOblast, factRaion, factCity, factStreet, factAddress } = JSON.parse(
      location.state.dataFirstStep,
    );
    if (loanConfirmationStore.dataSubmitCredit?.type === 'offline') {
      if (isFormValid) {
        dataFillStep2Store.setFormData({
          additionalPhoneNumber,
          relativeFullName,
          relationToBorrower,
        });
        navigate('/data-fill-3', {
          state: {
            formedData: JSON.stringify({
              ...JSON.parse(location.state.dataFirstStep),
              additionalPhoneNumber,
              relativeFullName,
              relationToBorrower,
            }),
          },
        });
      }
    } else {
      const dataToSend: SubmitApplicationType = {
        applicationId: loanConditionsStore.activeRequests?.applicationId,
        responseCode: 'ONLINE',
        paymentDay: loanConfirmationStore.dataSubmitCredit?.paymentDay,
        serviceBranch: '038-003',
        factOblast,
        factRaion,
        factCity,
        factStreet,
        factAddress,
        additionalPhoneNumber,
        relationToBorrower,
        relativeFullName,
        insureCompanyId: loanConfirmationStore.dataSubmitCredit?.insureCompanyId,
        acceptAgreement: loanConfirmationStore.dataSubmitCredit?.acceptAgreement,
      };

      const { success, error } = await dataFillStep2Store.submitApplication(dataToSend);

      if (success) {
        navigate('/finish-page', {
          state: {
            title: 'Кредит оформлен',
            description: 'Ожидайте поступления денежных средств',
            btnTitle: 'В кабинет кредитов',
            icon: 'success',
          },
        });
      } else {
        setSubmitError(error);
        open(true);
      }
    }
  };

  useEffect(() => {
    if (dataFillStep2Store.formData) {
      const { additionalPhoneNumber, relativeFullName, relationToBorrower } =
        dataFillStep2Store.formData;
      setAdditionalPhoneNumber(additionalPhoneNumber);
      setRelativeFullName(relativeFullName);
      setRelationToBorrower(relationToBorrower);
    }
  }, []);

  return (
    <DataFillLayout
      onBack={() => {
        dataFillStep2Store.setFormData({
          additionalPhoneNumber,
          relativeFullName,
          relationToBorrower,
        });
        navigate(-1);
      }}
      progress={
        <DataFillProgress
          currentStep={2}
          totalSteps={loanConfirmationStore.dataSubmitCredit?.type === 'offline' ? 3 : 2}
        />
      }
      contentClassName={[layoutStyles.content, layoutStyles.contentWithGap].join(' ')}
      footer={
        <Button disabled={!isFormValid} onClick={handleContinue}>
          {dataFillStep2Store.awaiting ? <Spinner width={30} height={30} /> : t('btns.continue')}
        </Button>
      }
    >
      <p className={[layoutStyles.groupSubtitle, layoutStyles.subtitlePreLine].join(' ')}>
        Выберите дополнительный контакт.{`\n`}Он понадобится в крайних случаях, если потеряем связь
        с Вами
      </p>
      <PhoneField value={additionalPhoneNumber} onChange={setAdditionalPhoneNumber} />
      <InputField mainPlaceholder="ФИО" value={relativeFullName} onChange={setRelativeFullName} />
      <InputField
        mainPlaceholder="Кем приходится"
        value={relationToBorrower}
        onChange={setRelationToBorrower}
      />

      <Modal
        isOpen={active}
        onClose={close}
        size="sm"
        footer={
          <button className="btn btn-text-green" onClick={close}>
            Закрыть
          </button>
        }
      >
        {submitError}
      </Modal>
    </DataFillLayout>
  );
};

export default observer(DataFillStep2);
