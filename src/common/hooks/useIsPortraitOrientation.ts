import { useEffect, useState } from 'react';

const getIsPortrait = () => {
  if (typeof window === 'undefined') {
    return true;
  }

  if (window.matchMedia) {
    return window.matchMedia('(orientation: portrait)').matches;
  }

  return window.innerHeight >= window.innerWidth;
};

export const useIsPortraitOrientation = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(getIsPortrait);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateOrientation = () => setIsPortrait(getIsPortrait());
    const mediaQuery = window.matchMedia('(orientation: portrait)');

    updateOrientation();

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsPortrait(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaQueryChange);
    } else {
      mediaQuery.addListener(handleMediaQueryChange);
    }

    window.addEventListener('orientationchange', updateOrientation);
    window.addEventListener('resize', updateOrientation);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaQueryChange);
      } else {
        mediaQuery.removeListener(handleMediaQueryChange);
      }

      window.removeEventListener('orientationchange', updateOrientation);
      window.removeEventListener('resize', updateOrientation);
    };
  }, []);

  return isPortrait;
};
