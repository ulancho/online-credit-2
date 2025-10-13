import { useEffect, useState } from 'react';

const calculateTimeLeft = (expiresIn: string | null, fallback: number) => {
  if (!expiresIn) return fallback;
  const expiresAt = Date.parse(expiresIn);
  if (Number.isNaN(expiresAt)) return fallback;
  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
};

export function useBoundCountdown(isBound: boolean, expiresIn: string | null, initial = 113) {
  const [left, setLeft] = useState(initial);

  // init / reset
  useEffect(() => {
    if (!isBound) {
      setLeft(initial);
      return;
    }
    setLeft(calculateTimeLeft(expiresIn, initial));
  }, [expiresIn, isBound, initial]);

  // tick
  useEffect(() => {
    if (!isBound) return;
    const id = window.setInterval(() => {
      setLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isBound]);

  return left;
}
