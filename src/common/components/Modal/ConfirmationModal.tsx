import { type Dispatch, type SetStateAction } from 'react';

import { useTranslation } from '@/common/i18n';

import { Modal } from '.';

type Props = {
  active: boolean | null;
  setActive: Dispatch<SetStateAction<boolean | null>>;
  submit: () => void;
};

const ConfirmationModal = ({ active, setActive, submit }: Props) => {
  const { t } = useTranslation();
  const closeDeclineModal = () => setActive(null);

  return (
    <Modal
      isOpen={active}
      onClose={closeDeclineModal}
      title={t('btns.declinedTitle')}
      footer={
        <>
          <button className="btn btn-text-muted" onClick={closeDeclineModal}>
            {t('btns.no')}
          </button>
          <button className="btn btn-text-green" onClick={submit}>
            {t('btns.yes')}
          </button>
        </>
      }
    >
      {t('btns.declinedDesc')}
    </Modal>
  );
};

export default ConfirmationModal;
