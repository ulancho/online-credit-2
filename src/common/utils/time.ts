export const getTargetMs = (iso?: string): number | null => {
  if (!iso) return null;
  const fixedIso = iso.replace(/(\.\d{3})\d*/, '$1'); // обрезаем до мс
  const parsed = Date.parse(fixedIso);
  if (Number.isNaN(parsed)) return null;
  return parsed + 6 * 60 * 60 * 1000;
};

export const formatMMSS = (sec: number): string => {
  const s = Math.max(0, sec | 0);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
};
