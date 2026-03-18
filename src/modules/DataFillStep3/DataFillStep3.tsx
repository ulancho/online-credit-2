import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'Common/components/Button/Button.tsx';
import NavBar from 'Common/components/NavBar/NavBar.tsx';
import Select from 'Common/components/Select/Select.tsx';

import styles from './DataFillStep3.module.scss';

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

const BRANCHES_BY_REGION: Record<string, string[]> = {
  Бишкек: [
    'Азия, ул. Горького, 1/2а',
    'Ул. Горького, 23, Бишкек парк',
    'Ул. Московская, 145',
    'Ул. Чуй, 178, ЦУМ',
    'Мкр. Кудайберген, 3',
    'Ул. Абдрахманова, 205',
    'Ул. Байтик Баатыра, 12',
  ],
  'Чуйская область': [
    'Г. Токмок, ул. Ленина, 5',
    'Г. Кара-Балта, ул. Ахунбаева, 12',
    'Г. Кант, ул. Советская, 8',
  ],
  'Иссык-Кульская область': ['Г. Каракол, ул. Токтогула, 34', 'Г. Балыкчы, ул. Ленина, 17'],
  'Нарынская область': ['Г. Нарын, ул. Ленина, 1'],
  'Джалал-Абадская область': [
    'Г. Джалал-Абад, ул. Ленина, 30',
    'Г. Таш-Кумыр, ул. Абдрахманова, 5',
  ],
  'Баткенская область': ['Г. Баткен, ул. Эркиндик, 2', 'Г. Кызыл-Кыя, ул. Ленина, 9'],
  'Ошская область': ['Г. Ош, ул. Ленина, 50', 'Г. Узген, ул. Советская, 14'],
  'Таласская область': ['Г. Талас, ул. Токтогула, 11'],
};

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="#129958" />
    <path
      d="M9 14.8L12.1429 18L20 10"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface BottomSheetProps {
  title: string;
  description?: string;
  items: string[];
  onSelect: (item: string) => void;
  onClose: () => void;
}

function BottomSheet({ title, description, items, onSelect, onClose }: BottomSheetProps) {
  return (
    <div className={styles.sheetOverlay} onClick={onClose}>
      <div className={styles.sheetContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sheetHeader}>
          <button className={styles.sheetBackBtn} onClick={onClose} aria-label="Назад">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5.74023 11.9492C5.74023 12.2812 5.86719 12.5645 6.13086 12.8184L13.748 20.2695C13.9531 20.4844 14.2266 20.5918 14.5391 20.5918C15.1738 20.5918 15.6719 20.1035 15.6719 19.459C15.6719 19.1465 15.5449 18.8633 15.3301 18.6484L8.46484 11.9492L15.3301 5.25C15.5449 5.02539 15.6719 4.74219 15.6719 4.42969C15.6719 3.79492 15.1738 3.30664 14.5391 3.30664C14.2266 3.30664 13.9531 3.41406 13.748 3.62891L6.13086 11.0801C5.86719 11.334 5.75 11.6172 5.74023 11.9492Z"
                fill="#129958"
              />
            </svg>
          </button>
          <div className={styles.sheetTitleBlock}>
            <h2 className={styles.sheetTitle}>{title}</h2>
            {description && <p className={styles.sheetDescription}>{description}</p>}
          </div>
        </div>
        <div className={styles.sheetBody}>
          <div className={styles.branchList}>
            {items.map((item, index) => (
              <button key={index} className={styles.branchItem} onClick={() => onSelect(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataFillStep3() {
  const navigate = useNavigate();
  const [region, setRegion] = useState('');
  const [branch, setBranch] = useState('');
  const [openSheet, setOpenSheet] = useState<'region' | 'branch' | null>(null);
  const isFormValid = region && branch;
  const availableBranches = region ? (BRANCHES_BY_REGION[region] ?? []) : [];

  const handleContinue = () => {
    if (isFormValid) {
      navigate('/data-fill-success');
    }
  };

  const handleRegionSelect = (val: string) => {
    setRegion(val);
    setBranch('');
    setOpenSheet(null);
  };

  return (
    <div id="page" className={styles.page}>
      <NavBar onBack={() => navigate(-1)} />
      <div className={styles.titleSection}>
        <h1 className={styles.pageTitle}>Осталось заполнить данные для завершения заявки</h1>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressStep}>
          <CheckIcon />
          <div className={`${styles.progressLine} ${styles.progressLineFilled}`} />
          <CheckIcon />
          <div className={`${styles.progressLine} ${styles.progressLineFilled}`} />
          <div className={`${styles.stepDot} ${styles.stepDotActive}`}>3</div>
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.groupSubtitle}>Выберите филиал для прикрепления вашей заявки</p>
        <Select
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
          onClick={() => region && setOpenSheet('branch')}
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
          onSelect={handleRegionSelect}
          onClose={() => setOpenSheet(null)}
        />
      )}
      {openSheet === 'branch' && (
        <BottomSheet
          title="Выберите филиал"
          description="Это необходимо для прикрепления вашей заявки к конкретному филиалу"
          items={availableBranches}
          onSelect={(val) => {
            setBranch(val);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      )}
    </div>
  );
}
