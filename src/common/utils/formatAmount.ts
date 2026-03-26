export const formatAmount = (value: number) => {
  if (value === undefined || value === null || isNaN(value)) return '0';

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};
