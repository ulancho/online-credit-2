export const getMonthLabel = (months: number, t: (key: string) => string): string => {
  if (months === 1) return `1 ${t('common.month')}`;
  if (months >= 2 && months <= 4) return `${months} ${t('common.monthBetween')}`;
  return `${months} ${t('common.months')}`;
};
