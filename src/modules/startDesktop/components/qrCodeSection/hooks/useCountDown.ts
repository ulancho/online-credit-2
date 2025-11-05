import { useEffect, useState } from 'react';

const INITIAL_TIME = 113;

export function useCountdown(expiresIn: string | null, fallbackSeconds = INITIAL_TIME) {
  const [timeLeft, setTimeLeft] = useState(fallbackSeconds);
  const expired = timeLeft <= 0;

  const calculateTimeLeft = (expiresIn: string | null) => {
    if (!expiresIn) return fallbackSeconds;
    const expiresAt = Date.parse(expiresIn);
    if (Number.isNaN(expiresAt)) return fallbackSeconds;
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(expiresIn));
  }, [expiresIn]);

  useEffect(() => {
    if (expired) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [expired]);

  return { timeLeft, expired };
}
