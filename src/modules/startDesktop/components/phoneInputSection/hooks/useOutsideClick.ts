import { useEffect } from 'react';

export function useOutsideClick(
  ref: React.RefObject<HTMLDivElement | null>,
  onOutside: () => void,
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const node = ref.current;
      if (!node) return;
      if (!node.contains(e.target as Node)) onOutside();
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onOutside, ref]);
}
