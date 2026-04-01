import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Spinner from '@/common/components/Spinner/Spinner';
import { useTranslation } from '@/common/i18n';
import {
  useDataFillStep2Store,
  useDataFillStep3Store,
  useLoanConditionsStore,
  useLoanConfirmationStore,
} from '@/common/stores/rootStore';
import Button from 'Common/components/Button/Button.tsx';
import Select from 'Common/components/Select/Select.tsx';
import layoutStyles from 'Modules/DataFill/shared/components/DataFillLayout.module.scss';
import DataFillLayout from 'Modules/DataFill/shared/components/DataFillLayout.tsx';
import DataFillProgress from 'Modules/DataFill/shared/components/DataFillProgress.tsx';
import DataFillSelectSheet from 'Modules/DataFill/shared/components/DataFillSelectSheet.tsx';

import { Modal } from '../LoanConditions/components/Modal';

import type { CitiesItem } from './api/DirectoriesApi';
import type { SubmitApplicationType } from '../DataFillStep2/services/DataFillStep2Service';

const DataFillStep3 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState<boolean | null>(null);
  const [factCityCftId, setFactCityCftId] = useState<CitiesItem | null>(null);
  const [serviceBranch, setServiceBranch] = useState<CitiesItem | null>(null);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [openSheet, setOpenSheet] = useState<'factCityCftId' | 'serviceBranch' | null>(null);

  const dataFillStep3Store = useDataFillStep3Store();
  const dataFillStep2Store = useDataFillStep2Store();
  const loanConfirmationStore = useLoanConfirmationStore();
  const loanConditionsStore = useLoanConditionsStore();

  const isFormValid = factCityCftId && serviceBranch;

  const open = (val: boolean) => setActive(val);
  const close = () => setActive(null);

  const handleContinue = async () => {
    const {
      factOblast,
      factRaion,
      factCity,
      factStreet,
      factAddress,
      additionalPhoneNumber,
      relationToBorrower,
      relativeFullName,
    } = JSON.parse(location.state.formedData);

    const dataToSend: SubmitApplicationType = {
      applicationId: loanConditionsStore.activeRequests?.applicationId,
      responseCode: 'OFFLINE',
      paymentDay: loanConfirmationStore.dataSubmitCredit?.paymentDay,
      serviceBranch: serviceBranch?.code || '',
      factOblast,
      factRaion,
      factCity,
      factStreet,
      factAddress,
      factCityCftId: factCityCftId?.code,
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
          title: t('offline.LoanIssued.title'),
          description: t('offline.LoanIssued.title'),
          btnTitle: 'В кабинет кредитов',
          icon: 'success',
        },
      });
    } else {
      setSubmitError(error);
      open(true);
    }
  };

  useEffect(() => {
    if (dataFillStep3Store.formData) {
      const { factCityCftId, serviceBranch } = dataFillStep3Store.formData;
      setFactCityCftId(factCityCftId);
      setServiceBranch(serviceBranch);
    }
    dataFillStep3Store.getCitiesDirectory();
  }, []);

  useEffect(() => {
    if (factCityCftId) dataFillStep3Store.getBranchesDirectory(factCityCftId.code);
  }, [factCityCftId]);

  return (
    <DataFillLayout
      onBack={() => {
        if (factCityCftId && serviceBranch) {
          dataFillStep3Store.setFormData = {
            factCityCftId,
            serviceBranch,
          };
        }
        navigate(-1);
      }}
      progress={<DataFillProgress currentStep={3} />}
      footer={
        <Button onClick={handleContinue} disabled={!isFormValid}>
          {dataFillStep2Store.awaiting ? <Spinner width={30} height={30} /> : t('btns.continue')}
        </Button>
      }
    >
      <p className={layoutStyles.groupSubtitle}>Выберите филиал для прикрепления вашей заявки</p>
      <Select
        label="Регион"
        value={factCityCftId ? factCityCftId.name : ''}
        subLabel="Регион"
        filled={factCityCftId ? !!factCityCftId.name : false}
        onClick={() => setOpenSheet('factCityCftId')}
      />
      <Select
        label="Филиал"
        value={serviceBranch ? serviceBranch.name : ''}
        subLabel="Филиал"
        filled={serviceBranch ? !!serviceBranch.name : false}
        onClick={() => {
          if (factCityCftId) {
            setOpenSheet('serviceBranch');
          }
        }}
        disabled={!factCityCftId}
      />
      {openSheet === 'factCityCftId' ? (
        <DataFillSelectSheet
          title="Выберите регион"
          items={dataFillStep3Store.availableCitiesDirectoryItems}
          onSelect={(value) => {
            setFactCityCftId(value);
            setServiceBranch(null);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      ) : null}
      {openSheet === 'serviceBranch' ? (
        <DataFillSelectSheet
          title="Выберите филиал"
          description="Это необходимо для прикрепления вашей заявки к конкретному филиалу"
          items={dataFillStep3Store.availableBranchesDirectoryItems}
          variant="fullscreen"
          onSelect={(value) => {
            setServiceBranch(value);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      ) : null}
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

export default observer(DataFillStep3);
