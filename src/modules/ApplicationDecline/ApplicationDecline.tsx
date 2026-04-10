import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { exitApp } from '@/common/api/common';
// import ExtendedQuestionaire from '@/common/components/ExtendedQuestionaire/ExtendedQuestionaire';
import ConfirmationModal from '@/common/components/Modal/ConfirmationModal';
import { useTranslation } from '@/common/i18n';
import { useApplicationStatusStore, useLoanConditionsStore } from '@/common/stores/rootStore';
import Button from 'Common/components/Button/Button.tsx';

import styles from './ApplicationDecline.module.scss';

const DECLINE_REASONS = [
  {
    id: 1,
    title: 'applicationDecline.badCreditHistory.title',
    description: 'applicationDecline.badCreditHistory.desc',
  },
  {
    id: 2,
    title: 'applicationDecline.lowIncomes.title',
    description: 'applicationDecline.lowIncomes.desc',
  },
  {
    id: 3,
    title: 'applicationDecline.currentDebtLoad.title',
    description: 'applicationDecline.currentDebtLoad.desc',
  },
  {
    id: 4,
    title: 'applicationDecline.absenceOfficialJob.title',
    description: 'applicationDecline.absenceOfficialJob.desc',
  },
  {
    id: 5,
    title: 'applicationDecline.smallWorkingExperience.title',
    description: 'applicationDecline.smallWorkingExperience.desc',
  },
];

const ChevronUp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.5856 14.4685C17.3269 14.7919 16.8549 14.8444 16.5315 14.5856L12 10.9604L7.46849 14.5856C7.14505 14.8444 6.67308 14.7919 6.41432 14.4685C6.15556 14.145 6.208 13.6731 6.53145 13.4143L11.5315 9.41432C11.8054 9.19519 12.1946 9.19519 12.4685 9.41432L17.4685 13.4143C17.7919 13.6731 17.8444 14.145 17.5856 14.4685Z"
      fill="#129958"
    />
  </svg>
);

const ChevronDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z"
      fill="#A0A7B1"
    />
  </svg>
);

export default function ApplicationDecline() {
  const [openIds, setOpenIds] = useState<number[]>([1]);
  const [activeModal, setActiveModal] = useState<boolean | null>(null);
  const openDeclineModal = (val: boolean) => setActiveModal(val);

  const urlParams = new URLSearchParams(window.location.search);
  const isExtended = urlParams.has('extended');

  const loanConditionsStore = useLoanConditionsStore();
  const applicationStatusStore = useApplicationStatusStore();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const toggle = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id],
    );
  };

  const closeWebView = () => {
    exitApp().then((res) => console.log(res.status));
  };

  const proceedToDeclinedPage = async () => {
    const success = await loanConditionsStore.setDeclineApplication(
      applicationStatusStore.requestId as string,
    );
    if (success) {
      navigate('/finish-page', {
        state: {
          title: t('common.declinedTheLoan'),
          description: t('common.successfullyRejected'),
        },
        replace: true,
      });
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.navbarContent}>
          <h1 className={styles.navbarTitle}>{t('applicationDecline.title')}</h1>
          <p className={styles.navbarDescription}>{t('applicationDecline.desc')}</p>
        </div>
      </header>
      <main className={styles.main}>
        {/*{isExtended && <ExtendedQuestionaire />}*/}
        <h2 className={styles.sectionTitle}>{t('applicationDecline.subTitle')}</h2>
        <div className={styles.accordionList}>
          {DECLINE_REASONS.map((reason) => {
            const isOpen = openIds.includes(reason.id);
            return (
              <div key={reason.id} className={styles.accordionItem}>
                <button
                  className={styles.accordionHeader}
                  onClick={() => toggle(reason.id)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.accordionTitle}>{t(reason.title)}</span>
                  <span className={styles.accordionChevron}>
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </button>
                <div className={styles.accordionBody} data-open={isOpen}>
                  <div className={styles.accordionBodyInner}>
                    <p className={styles.accordionDescription}>{t(reason.description)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <div className={styles.footer}>
        <Button onClick={closeWebView} type="button" className={styles.confirmButton}>
          {t('btns.gotIt')}
        </Button>
        {isExtended && (
          <>
            <button onClick={() => openDeclineModal(true)} className={styles.declineButton}>
              {t('btns.decline')}
            </button>
            <ConfirmationModal
              submit={proceedToDeclinedPage}
              active={activeModal}
              setActive={setActiveModal}
            />
          </>
        )}
      </div>
    </div>
  );
}
