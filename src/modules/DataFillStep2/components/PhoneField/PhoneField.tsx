import { useState, useRef } from 'react';

import styles from './PhoneField.module.scss';

interface InputFieldProps {
  value?: string;
  onChange?: (value: string) => void;
}

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.0516 2H11.9484C10.2682 1.99999 8.93732 1.99997 7.89575 2.14245C6.82382 2.28908 5.95621 2.59803 5.27199 3.29418C4.58778 3.99033 4.28413 4.87308 4.14001 5.9637C3.99997 7.02343 3.99999 8.37751 4 10.087V13.9129C3.99999 15.6225 3.99997 16.9766 4.14001 18.0363C4.28413 19.1269 4.58778 20.0097 5.27199 20.7058C5.95621 21.402 6.82382 21.7109 7.89575 21.8575C8.93731 22 10.2682 22 11.9484 22H12.0516C13.7318 22 15.0627 22 16.1043 21.8575C17.1762 21.7109 18.0438 21.402 18.728 20.7058C19.4122 20.0097 19.7159 19.1269 19.86 18.0363C20 16.9766 20 15.6225 20 13.913V10.0871C20 8.37754 20 7.02343 19.86 5.9637C19.7159 4.87308 19.4122 3.99033 18.728 3.29418C18.0438 2.59803 17.1762 2.28908 16.1043 2.14245C15.0627 1.99997 13.7318 1.99999 12.0516 2ZM8.57143 18.5116C8.57143 18.1263 8.87843 17.814 9.25714 17.814H14.7429C15.1216 17.814 15.4286 18.1263 15.4286 18.5116C15.4286 18.8969 15.1216 19.2093 14.7429 19.2093H9.25714C8.87843 19.2093 8.57143 18.8969 8.57143 18.5116Z"
      fill="#A0A7B1"
    />
  </svg>
);

const COUNTRY_CODE = '996';

type CharMap = { char: string; di: number | null }[];

function buildMap(digits: string): CharMap {
  const map: CharMap = [];
  const local = digits.slice(3);
  const p1 = local.slice(0, 3);
  const p2 = local.slice(3, 6);
  const p3 = local.slice(6, 9);

  map.push({ char: '+', di: null });
  map.push({ char: '9', di: 0 });
  map.push({ char: '9', di: 1 });
  map.push({ char: '6', di: 2 });

  if (!p1.length) return map;
  map.push({ char: ' ', di: null });
  map.push({ char: '(', di: null });
  for (let i = 0; i < p1.length; i++) map.push({ char: p1[i], di: 3 + i });
  if (p1.length < 3) return map;
  map.push({ char: ')', di: null });

  if (!p2.length) return map;
  map.push({ char: ' ', di: null });
  for (let i = 0; i < p2.length; i++) map.push({ char: p2[i], di: 6 + i });
  if (p2.length < 3) return map;
  map.push({ char: '-', di: null });

  for (let i = 0; i < p3.length; i++) map.push({ char: p3[i], di: 9 + i });
  return map;
}

function format(digits: string): string {
  return buildMap(digits)
    .map((x) => x.char)
    .join('');
}

// Кол-во локальных цифр (di >= 3) слева от курсора
function localDigitsBeforeCursor(digits: string, cursorPos: number): number {
  const map = buildMap(digits);
  let n = 0;
  for (let i = 0; i < cursorPos && i < map.length; i++) {
    if (map[i].di !== null && map[i].di! >= 3) n++;
  }
  return n;
}

// Позиция курсора сразу после n-й локальной цифры (1-based)
// n=0 → позиция 4 (после '+996', перед пробелом)
function cursorAfterNthLocal(digits: string, n: number): number {
  if (n === 0) return 4;
  const map = buildMap(digits);
  let count = 0;
  for (let i = 0; i < map.length; i++) {
    if (map[i].di !== null && map[i].di! >= 3) {
      count++;
      if (count === n) return i + 1;
    }
  }
  return map.length;
}

function extractDigits(val: string): string {
  return val.replace(/\D/g, '');
}

export default function PhoneField({ value = '', onChange }: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const digits = extractDigits(value);
  const isFilled = digits.length > 0;
  const isFloating = focused || isFilled;
  const displayValue =
    focused || isFilled
      ? format(digits.startsWith(COUNTRY_CODE) ? digits : COUNTRY_CODE + digits)
      : '';

  const setCursor = (pos: number) => {
    setTimeout(() => inputRef.current?.setSelectionRange(pos, pos), 0);
  };

  const handleFocus = () => {
    setFocused(true);
    if (!digits) onChange?.(COUNTRY_CODE);
    setTimeout(() => {
      const len = inputRef.current?.value.length ?? 0;
      inputRef.current?.setSelectionRange(len, len);
    }, 0);
  };

  const handleBlur = () => {
    setFocused(false);
    if (digits === COUNTRY_CODE) onChange?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const cur = inputRef.current?.selectionStart ?? displayValue.length;
      const n = localDigitsBeforeCursor(digits, cur);

      // нет локальных цифр слева — 996 не трогаем
      if (n === 0) return;

      const dIdx = 3 + n - 1;
      const newDigits = digits.slice(0, dIdx) + digits.slice(dIdx + 1);

      // стёрли последнюю локальную цифру — остаётся только 996, не очищаем
      if (newDigits === COUNTRY_CODE) {
        onChange?.(COUNTRY_CODE);
        setCursor(4); // курсор после '+996'
        return;
      }

      onChange?.(newDigits);
      setCursor(cursorAfterNthLocal(newDigits, n - 1));
      return;
    }

    if (!/^\d$/.test(e.key)) return;
    e.preventDefault();
    if (digits.length >= 12) return;

    const cur = inputRef.current?.selectionStart ?? displayValue.length;
    const n = localDigitsBeforeCursor(digits, cur);
    const insertAt = 3 + n;
    const newDigits = digits.slice(0, insertAt) + e.key + digits.slice(insertAt);

    onChange?.(newDigits);
    setCursor(cursorAfterNthLocal(newDigits, n + 1));
  };

  // Только для paste
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = extractDigits(e.target.value);
    if (!raw.startsWith(COUNTRY_CODE)) {
      onChange?.(COUNTRY_CODE);
      return;
    }
    if (raw.length > 12) return;
    onChange?.(raw);
    setTimeout(() => {
      const len = inputRef.current?.value.length ?? 0;
      inputRef.current?.setSelectionRange(len, len);
    }, 0);
  };

  return (
    <div className={styles.wrapper}>
      <label className={`${styles.phoneField} ${isFloating ? styles.phoneFieldFilled : ''}`}>
        <div className={styles.phoneIcon}>
          <PhoneIcon />
        </div>
        <div className={styles.fieldContent}>
          <span
            className={`${styles.phoneFloatingLabel} ${
              isFloating ? styles.phoneFloatingLabelActive : ''
            }`}
          >
            Номер телефона
          </span>
          <input
            ref={inputRef}
            className={styles.phoneInput}
            type="tel"
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </label>
    </div>
  );
}
