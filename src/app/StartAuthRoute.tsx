import { useMemo } from 'react';

import LanguageSwitcher from 'Common/components/languageSwitcher/LanguageSwitcher.tsx';
import { isMobileUserAgent } from 'Common/utils/isMobileUserAgent.ts';
import StartDesktop from 'Modules/startDesktop';
import StartMobile from 'Modules/startMobile';

const StartMobileRoute = () => (
  <>
    <StartMobile />
    <LanguageSwitcher />
  </>
);

function StartAuthRoute() {
  const isMobile = useMemo(() => isMobileUserAgent(), []);

  return isMobile ? <StartMobileRoute /> : <StartDesktop />;
}

export default StartAuthRoute;
