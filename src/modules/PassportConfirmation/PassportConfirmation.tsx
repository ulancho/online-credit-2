import NavBar from 'Common/components/NavBar/NavBar.tsx';

import styles from './PassportConfirmation.module.scss';

interface PassportData {
  fullNameCyrillic: string;
  fullNameLatin: string;
  birthDate: string;
  serialNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
}

interface PassportConfirmationProps {
  data?: PassportData;
  onContinue?: () => void;
  onEdit?: () => void;
}

const DEFAULT_DATA: PassportData = {
  fullNameCyrillic: 'Трамп  Дональдбек Джон уулу',
  fullNameLatin: 'Tramp Donaldbek Djon uulu',
  birthDate: '01.01.1991',
  serialNumber: 'ID324212',
  issueDate: '12.12.2005',
  expiryDate: '12.12.2015',
  issuingAuthority: 'МКК 50-52',
};

export default function PassportConfirmation({
  data = DEFAULT_DATA,
  onContinue,
  onEdit,
}: PassportConfirmationProps) {
  return (
    <div id="page" className={styles.confirmationPage}>
      {/* NavBar */}
      <NavBar title={'Подтверждение'} />
      {/* Scrollable content */}
      <div className={styles.content}>
        <p className={styles.subtitle}>Просим подтвердить соответствие паспортных данных</p>
        {/* Name card */}
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span className={styles.fieldLabel}>ФИО</span>
            <span className={styles.fieldValue}>{data.fullNameCyrillic}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.infoRow}>
            <span className={styles.fieldLabel}>ФИО на латинице</span>
            <span className={styles.fieldValue}>{data.fullNameLatin}</span>
          </div>
        </div>
        {/* Details card */}
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span className={styles.fieldLabel}>Дата рождение</span>
            <span className={styles.fieldValue}>{data.birthDate}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.infoRow}>
            <span className={styles.fieldLabel}>Серийный номер</span>
            <span className={styles.fieldValue}>{data.serialNumber}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.infoRow}>
            <span className={styles.fieldLabel}>Дата выдачи</span>
            <span className={styles.fieldValue}>{data.issueDate}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.infoRow}>
            <span className={styles.fieldLabel}>Срок действия</span>
            <span className={styles.fieldValue}>{data.expiryDate}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.infoRow}>
            <span className={styles.fieldLabel}>Орган выдачи</span>
            <span className={styles.fieldValue}>{data.issuingAuthority}</span>
          </div>
        </div>
      </div>
      {/* Bottom actions */}
      <div className={styles.actions}>
        <button className={styles.continueBtn} onClick={onContinue}>
          Продолжить
        </button>
        <button className={styles.editBtn} onClick={onEdit}>
          Изменить
        </button>
      </div>
    </div>
  );
}
